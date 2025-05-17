from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

User = get_user_model()

from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'] 
        )
        return user

class CustomUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'middle_name', 'user_role', 'contact', 'department']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'id', 'first_name', 'middle_name', 'last_name', 'user_role', 'contact', 'specialization', 'department', 'user_status' ]


class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = ['training_ID','training_title','training_venue','training_date', 'training_type', 'training_category', 'training_status']

    def get_employees(self, obj):
        return obj.assigned_employees.all().values("at_employee")

class CompetencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Competency
        fields = ['comp_ID','comp_global', 'comp_solutions', 'comp_networking', 'comp_delivering', 'comp_collab' , 'comp_agility', 'comp_prof', 'comp_employee']

class UserNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'user_role', 'first_name', 'middle_name', 'last_name', 'specialization']

class AssignedTrainingSerializer(serializers.ModelSerializer):
    user = UserNestedSerializer(source='at_employee', read_only=True)
    training = TrainingSerializer(source='at_training', read_only=True)

    class Meta:
        model = AssignedTraining
        fields = ['id', 'at_training', 'training', 'at_employee', 'user']

    def get_trainings(self, obj):
        return obj.assigned_trainings.all().values("at_training")
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login_input = attrs.get("username")  # This could be username or email
        password = attrs.get("password")

        # Try to find user by username or email
        user = User.objects.filter(username=login_input).first() or User.objects.filter(email=login_input).first()

        if user and user.check_password(password):
            if user.user_status != "active":
                raise serializers.ValidationError("User account is not active.")
            attrs['username'] = user.username  # Needed for parent serializer
            return super().validate(attrs)

        raise serializers.ValidationError("Invalid username/email or password")

class LearningActionPlanSerializer(serializers.ModelSerializer):
    lap_employee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    lap_training = serializers.PrimaryKeyRelatedField(queryset=Training.objects.all(), write_only=True)
    lap_employee_detail = UserSerializer(source='lap_employee', read_only=True)
    lap_training_detail = TrainingSerializer(source='lap_training', read_only=True)

    class Meta:
        model = LearningActionPlan
        fields = ['lap_ID', 'lap_employee', 'lap_training', 'lap_employee_detail', 'lap_training_detail', 'lap_status', 'lap_takeaways', 'lap_goal', 'lap_plan', 'lap_support', 'lap_outcome', 'lap_date', 'lap_timeframe']

class UserNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'user_role', 'first_name', 'last_name', 'specialization']

class ProgressSerializer(serializers.ModelSerializer):

    progress_employee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    progress_training = serializers.PrimaryKeyRelatedField(queryset=Training.objects.all(), write_only=True)
    progress_employee_detail = UserNestedSerializer(source='progress_employee', read_only=True)
    progress_training_detail = TrainingSerializer(source='progress_training', read_only=True)
    progress_status_display = serializers.SerializerMethodField()

    STATUS_LABELS = {
        "to_evaluate": "To be Evaluated",
        "training_attended": "Training Attended",
        "training_not_attended": "Training Not Attended",
        "lap_approved": "Action Plan Approved",
        "lap_rejected": "Action Plan Rejected",
        "successful": "Successful",
        "failed": "Failed",
    }

    class Meta:
        model = Progress
        fields = [
            'progress_ID',
            'progress_employee',          
            'progress_employee_detail',    
            'progress_training',           
            'progress_training_detail',    
            'progress_status_display',
            'progress_lap',
            'progress_status', 
        ]

    def get_progress_status_display(self, obj):
        return self.STATUS_LABELS.get(obj.progress_status, "Unknown Status")

class Employee_SupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Supervisor
        fields = ['id','supervisor_of_employee', 'employee_to_supervise']

class EnrolledTrainingSerializer(serializers.ModelSerializer):
    user = UserNestedSerializer(source='en_employee', read_only=True)
    training = TrainingSerializer(source='en_training', read_only=True)

    class Meta:
        model = EnrolledTraining
        fields = ['id','en_training', 'en_employee', 'user', 'training']

class SupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor
        fields = ['id','supervisor']