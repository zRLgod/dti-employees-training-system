from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics, status
from .models import *
from .serializers import *
import logging
from django.utils import timezone
from django.utils.dateparse import parse_date

logger = logging.getLogger(__name__)
User = get_user_model()

# AUTH VIEWS

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response({'success': True, 'access_token': access_token, 'refresh_token': refresh_token})

            # Set secure HTTP-only cookies
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res
        except Exception as e:
            logger.error(f"Login error: {e}")
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return Response({'refreshed': False, 'error': 'Refresh token not found'}, status=401)

            data = {'refresh': refresh_token}
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            access_token = serializer.validated_data['access']

            res = Response({'refreshed': True, 'access_token': access_token})
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res
        except Exception as e:
            logger.error(f"Token refresh error: {e}") 
            return Response({'refreshed': False, 'error': str(e)}, status=401)


@api_view(['POST'])
def logout(request):
    try:
        res = Response({'success': True})
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except Exception as e:
        logger.error(f"Logout error: {e}")
        return Response({'success': False, 'error': str(e)}, status=400)

from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response

class LearningActionPlanCreateView(generics.CreateAPIView):
    queryset = LearningActionPlan.objects.all()
    serializer_class = LearningActionPlanSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response({'success': True, 'learning_action_plan': serializer.data}, status=status.HTTP_201_CREATED, headers=headers)
        except IntegrityError as e:
            logger.error(f"Integrity error: {str(e)}")
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log serializer errors if validation fails
            if hasattr(serializer, 'errors'):
                logger.error(f"Validation errors: {serializer.errors}")
                return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                logger.error(f"Unexpected error: {str(e)}")
                return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'authenticated': True, 'user': request.user.username})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'user': serializer.data})
    return Response({'success': False, 'errors': serializer.errors}, status=400)

# TRAINING VIEWS

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_enrolled_users(request, training_id):
    try:
        training = Training.objects.get(training_ID=training_id)
    except Training.DoesNotExist:
        return Response({'success': False, 'error': 'Training not found'}, status=status.HTTP_404_NOT_FOUND)

    enrolled_trainings = EnrolledTraining.objects.filter(en_training=training)
    serializer = EnrolledTrainingSerializer(enrolled_trainings, many=True)
    return Response({'success': True, 'enrolled_users': serializer.data}, status=status.HTTP_200_OK)
        
class PostTraining(generics.ListCreateAPIView):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response({'success': True, 'training': serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

class ViewTraining(generics.ListAPIView):
    serializer_class = TrainingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Training.objects.all()

        # Get the start and end date parameters from the query string
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        # Filter by start date
        if start_date:
            start_date_obj = parse_date(start_date)
            if start_date_obj:
                queryset = queryset.filter(training_date__gte=start_date_obj)

        # Filter by end date
        if end_date:
            end_date_obj = parse_date(end_date)
            if end_date_obj:
                queryset = queryset.filter(training_date__lte=end_date_obj)

        # Additional status updates based on date
        today = timezone.now().date()
        queryset.filter(training_date=today).update(training_status='ongoing')
        queryset.filter(training_date__lt=today).update(training_status='completed')
        queryset.filter(training_date__gt=today).update(training_status='scheduled')

        return queryset

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UpdateTraining(request, pk):
    try:
        training = Training.objects.get(pk=pk)
    except Training.DoesNotExist:
        return Response({'success': False, 'error': 'Training not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = TrainingSerializer(training, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'training': serializer.data})
    return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def DeleteTraining(request, pk):
    try:
        training = Training.objects.get(pk=pk)
    except Training.DoesNotExist:
        return Response({'success': False, 'error': 'Training not found'}, status=status.HTTP_404_NOT_FOUND)

    training.delete()
    return Response({'success': True, 'message': 'Training deleted successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response({'success': True, 'users': serializer.data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response({'success': True, 'user': serializer.data})

#COMPETENCY VIEWS
class PostCompetency(generics.ListCreateAPIView):
     queryset = Competency.objects.all()
     serializer_class = CompetencySerializer
     def create_Competency(self, serializer):
       serializer.save(owner=self.request.user)

class ViewCompetency(generics.ListAPIView):
     queryset = Competency.objects.all()
     serializer_class = CompetencySerializer

class ViewCompetencyDetail(generics.RetrieveAPIView):
     queryset = Competency.objects.all()
     serializer_class = CompetencySerializer

@api_view(['DELETE'])
def DeleteCompetency(request, pk):
    try:
        competency = Competency.objects.get(pk=pk)
    except competency.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    competency.delete()
    return Response(status=200)

from rest_framework.permissions import IsAuthenticated

from rest_framework.exceptions import ValidationError

class PostATTraining(generics.ListCreateAPIView):
    queryset = AssignedTraining.objects.all()
    serializer_class = AssignedTrainingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        training_id = request.data.get('at_training')
        employee_id = request.data.get('at_employee')
        try:
            training = Training.objects.get(training_ID=training_id)
        except Training.DoesNotExist:
            raise ValidationError("Training does not exist.")

        if training.training_status in ['completed', 'ongoing']:
            raise ValidationError("You cannot assign users to a training that is completed or ongoing.")

        # Check for duplicate assignment
        if AssignedTraining.objects.filter(at_training=training, at_employee_id=employee_id).exists():
            raise ValidationError("This user is already assigned to the training.")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response({'success': True, 'assigned_training': serializer.data}, status=201, headers=headers)


class PostEnrolledTraining(generics.ListCreateAPIView):
    queryset = EnrolledTraining.objects.all()
    serializer_class = EnrolledTrainingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        training_id = request.data.get('en_training')
        user = self.request.user
        try:
            training = Training.objects.get(training_ID=training_id)
        except Training.DoesNotExist:
            raise ValidationError("Training does not exist.")

        # Check if already enrolled
        if EnrolledTraining.objects.filter(en_training=training, en_employee=user).exists():
            return Response({'success': False, 'error': 'User already enrolled in this training.'}, status=400)

        # Create enrollment
        enrollment_data = {
            'en_training': training.training_ID,
            'en_employee': user.id
        }
        serializer = self.get_serializer(data=enrollment_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response({'success': True, 'enrolled_training': serializer.data}, status=201, headers=headers)

class ViewEnrolledTrainingsForUser(generics.ListAPIView):
    serializer_class = EnrolledTrainingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        status_filter = self.request.query_params.get('status', None)
        queryset = EnrolledTraining.objects.filter(en_employee=user)
        if status_filter:
            queryset = queryset.filter(en_training__training_status=status_filter)
        return queryset

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # Log serialized data for debugging
        import logging
        logger = logging.getLogger(__name__)
        logger.debug(f"Serialized enrolled trainings data: {response.data}")
        print(f"Serialized enrolled trainings data: {response.data}")
        return response


class ViewATTraining(generics.ListAPIView):
     queryset = AssignedTraining.objects.all()
     serializer_class = AssignedTrainingSerializer
     permission_classes = [IsAuthenticated]


class ViewAssignedTrainingsForUser(generics.ListAPIView):
    serializer_class = AssignedTrainingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user
            return AssignedTraining.objects.filter(at_employee=user)
        except Exception as e:
            logger.error(f"Error in ViewAssignedTrainingsForUser: {e}")
            return AssignedTraining.objects.none()

class ViewATTrainingDetail(generics.RetrieveAPIView):
     queryset = AssignedTraining.objects.all()
     serializer_class = AssignedTrainingSerializer

@api_view(['PUT'])
def UpdateATTraining(request, pk):
    try:
        assigned_training = AssignedTraining.objects.get(pk=pk)
    except assigned_training.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = AssignedTrainingSerializer(assigned_training, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def DeleteATTraining(request, pk):
    try:
        assigned_training = AssignedTraining.objects.get(pk=pk)
    except assigned_training.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    assigned_training.delete()
    return Response(status=200)

# USER VIEWS
from rest_framework import status
from rest_framework.response import Response

class PostUser(generics.ListCreateAPIView):
    queryset = User.objects.all()
    # Use CustomUserRegistrationSerializer for creating users to handle password properly
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CustomUserRegistrationSerializer
        return UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        read_serializer = UserSerializer(user)
        headers = self.get_success_headers(read_serializer.data)
        return Response({'success': True, 'user': read_serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

class ViewUser(generics.ListAPIView):
     queryset = User.objects.all()
     serializer_class = UserSerializer

class ViewUserDetail(generics.RetrieveAPIView): 
     queryset = User.objects.all()
     serializer_class = UserSerializer

@api_view(['PUT'])
def UpdateUser(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    password = data.pop('password', None)

    serializer = UserSerializer(user, data=data)
    if serializer.is_valid():
        user = serializer.save()
        if password:
            user.set_password(password)
            user.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def DeleteUser(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except user.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response(status=200)

class EmployeeListView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(user_role='employee')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assigned_users(request, training_id):
    try:
        assigned_trainings = AssignedTraining.objects.filter(at_training=training_id)
        serializer = AssignedTrainingSerializer(assigned_trainings, many=True)
        return Response({'success': True, 'assigned_users': serializer.data}, status=status.HTTP_200_OK)
    except Training.DoesNotExist:
        return Response({'success': False, 'error': 'Training not found'}, status=status.HTTP_404_NOT_FOUND)
    
class PostSupervisor(generics.ListCreateAPIView):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer
    def create_Supervisor(self, serializer):
        serializer.save(owner=self.request.user)

class ViewSupervisor(generics.ListAPIView):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer

class ViewSupervisorDetail(generics.RetrieveAPIView):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer

@api_view(['PUT'])
def UpdateSupervisor(request, pk):
    try:
        supervisor = Supervisor.objects.get(pk=pk)
    except supervisor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = SupervisorSerializer(supervisor, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def DeleteSupervisor(request, pk):
    try:
        supervisor = Supervisor.objects.get(pk=pk)
    except supervisor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    supervisor.delete()
    return Response(status=200)

# PROGRESS VIEWS
class PostProgress(generics.ListCreateAPIView):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Progress creation validation errors: {serializer.errors}")
            return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response({'success': True, 'progress': serializer.data}, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            logger.error(f"Progress creation error: {str(e)}")
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ViewProgress(generics.ListAPIView):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

class ViewProgressForCurrentUser(generics.ListAPIView):
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Progress.objects.filter(progress_employee=user)

class ViewProgressDetail(generics.RetrieveAPIView):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer

@api_view(['DELETE'])
def DeleteProgress(request, pk):
    try:
        progress = Progress.objects.get(pk=pk)
    except progress.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    progress.delete()
    return Response(status=200)

class ListUserLearningActionPlans(generics.ListAPIView):
    serializer_class = LearningActionPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LearningActionPlan.objects.filter(lap_employee=user)

class ListAllLearningActionPlans(generics.ListAPIView):
    serializer_class = LearningActionPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LearningActionPlan.objects.all()
    
api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress_by_lap(request, lap_id):
    progresses = Progress.objects.filter(progress_lap__lap_ID=lap_id)
    if progresses.exists():
        serializer = ProgressSerializer(progresses.first())  # or use many=True to return all
        return Response({'success': True, 'progress': serializer.data})
    else:
        return Response({'success': False, 'error': 'Progress not found for this LAP'}, status=404)
    
class UpdateProgress(generics.UpdateAPIView):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            progress = self.get_object() 
        except Progress.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(progress, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)