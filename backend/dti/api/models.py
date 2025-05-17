from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLES = [
        ("admin", "Admin"),
        ("employee", "Employee"),
        ("supervisor", "Supervisor"), 
    ]

    STATUS = [
        ("active", "Active"),
        ("deactivated", "Deactivated"),
    ]
    
    SPECIAL = [
        ("technical" , "Technical"),
        ("financial" , "Financial"), 
        ("supervisorial" , "Supervisorial"),
        ("human Resource" , "HR"),
        ("administrative" , "Administrative"),
    ]

    DEPT = [
        ("Information Technology" , "IT"),
        ("Human Resource" , "human Resource"),
        ("Finance" , "finance"),
    ]
    email = models.EmailField(unique=True)
    user_role = models.CharField(max_length=20, choices=ROLES, default='employee')
    contact = models.CharField(max_length=20, blank=True, null=True)
    middle_name = models.CharField(max_length=20, blank=True, null=True)
    specialization = models.CharField(max_length=20,choices=SPECIAL, default='technical')
    department = models.CharField(max_length=22, choices=DEPT)
    user_status = models.CharField(max_length=20, choices=STATUS, default="active")


    def __str__(self):
        return self.username

class Training(models.Model):
    CATEGORY = [
        ("mandatory", "Mandatory"),
        ("optional", "Optional"),
    ]

    TYPE = [
        ("technical" , "Technical"),
        ("financial" , "Financial"), 
        ("supervisorial" , "Supervisorial"),
        ("human Resource" , "HR"),
        ("administrative" , "Administrative"),
    ]
    STATUS = [
        ("scheduled" , "Scheduled"),
        ("ongoing" , "Ongoing"),
        ("completed" , "Completed"),
    ]

    training_ID = models.AutoField(primary_key=True)
    training_title = models.CharField(max_length=200, blank=False)
    training_venue = models.CharField(max_length=200, blank=False)
    training_date = models.DateField()
    training_type = models.CharField(max_length=100, choices=TYPE)
    training_category = models.CharField(max_length=20, choices=CATEGORY)
    training_status = models.CharField(max_length=20, choices=STATUS, default="scheduled")

    class Meta:
        ordering = ['training_ID']

    def __str__(self):
        return self.training_title
    
class Employee(models.Model):
    supervisor = models.ForeignKey(CustomUser, limit_choices_to={'user_role': 'employee'}, on_delete=models.CASCADE)

class Supervisor(models.Model):
    supervisor = models.ForeignKey(CustomUser, limit_choices_to={'user_role': 'supervisor'}, on_delete=models.CASCADE)

class Employee_Supervisor(models.Model):
    supervisor_of_employee = models.ForeignKey(Supervisor, related_name='assigned_supervisor', on_delete=models.CASCADE)
    employee_to_supervise = models.ForeignKey(Employee, related_name='supervises_employees', on_delete=models.CASCADE)

class AssignedTraining(models.Model):
    at_training = models.ForeignKey(Training, related_name='assigned_employees', on_delete=models.CASCADE)
    at_employee = models.ForeignKey(CustomUser, limit_choices_to={'user_role': 'employee'}, related_name='assigned_trainings', on_delete=models.CASCADE)

class EnrolledTraining(models.Model):
    en_training = models.ForeignKey(Training, related_name='enrolled_employees', on_delete=models.CASCADE)
    en_employee = models.ForeignKey(CustomUser, limit_choices_to={'user_role': 'employee'}, related_name='enrolled_trainings', on_delete=models.CASCADE)
    
class Competency(models.Model):
    RATING = [
    (1, "Basic"),
    (2, "Intermediate"),
    (3, "Advanced"),
]

    comp_ID = models.AutoField(primary_key=True)
    comp_global = models.CharField(max_length=20, choices=RATING, default=1)
    comp_solutions = models.CharField(max_length=20, choices=RATING, default=1)
    comp_networking = models.CharField(max_length=20, choices=RATING, default=1)
    comp_delivering = models.CharField(max_length=20, choices=RATING, default=1)
    comp_collab = models.CharField(max_length=20, choices=RATING, default=1)
    comp_agility = models.CharField(max_length=20, choices=RATING, default=1)
    comp_prof = models.CharField(max_length=20, choices=RATING, default=1)
    comp_employee = models.ForeignKey(CustomUser, limit_choices_to={'user_role': 'employee'}, related_name='competencies',on_delete=models.CASCADE)

class LearningActionPlan(models.Model):
    STATUS = {
        "to_evaluate": "To be Evaluated",
        "approved": "Action Plan Approved",
        "rejected": "Action Plan Rejected",
    }
    lap_ID = models.AutoField(primary_key=True)
    lap_employee = models.ForeignKey(CustomUser, limit_choices_to={'user_role': 'employee'}, related_name='submitted_laps',on_delete=models.CASCADE)
    lap_training = models.ForeignKey(Training, on_delete=models.CASCADE)
    lap_date = models.DateField(auto_now_add=True)
    lap_takeaways = models.TextField()
    lap_goal = models.TextField()
    lap_plan = models.TextField()
    lap_timeframe = models.TextField()
    lap_support = models.TextField()
    lap_outcome = models.TextField()
    lap_status = models.CharField(max_length=20, choices=STATUS, default="to_evaluate")

class Progress(models.Model):
    STATUS = {
        "to_evaluate": "To be Evaluated",
        "training_attended": "Training Attended",
        "training_not_attended": "Training Not Attended",
        "lap_approved": "Action Plan Approved",
        "lap_rejected": "Action Plan Rejected",
        "successful": "Successful",
        "failed": "Failed",
    }
    progress_ID = models.AutoField(primary_key=True)
    progress_employee = models.ForeignKey(CustomUser, limit_choices_to={'user_role': 'employee'}, related_name='progress_as_employee', on_delete=models.CASCADE)
    progress_training = models.ForeignKey(Training, on_delete=models.CASCADE)
    progress_lap = models.ForeignKey(LearningActionPlan, on_delete=models.CASCADE)
    progress_status = models.CharField(max_length=100, choices=STATUS, default="to_evaluate")
    
