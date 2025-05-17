from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import *

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = (
            'username', 'email', 'first_name', 'last_name', 'middle_name',
            'user_role', 'user_status', 'contact', 'specialization', 'department'
        )

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = (
            'username', 'email', 'first_name', 'last_name', 'middle_name',
            'user_role', 'user_status', 'contact', 'specialization', 'department'
        )

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    list_display = [
        'username', 'email', 'first_name', 'last_name', 'middle_name',
        'user_role', 'user_status', 'is_staff', 'is_active',
        'contact', 'specialization', 'department'
    ]
    list_filter = ['user_role', 'user_status', 'is_staff', 'is_active']

    fieldsets = (
        (None, {
            'fields': (
                'username', 'email', 'password', 'first_name', 'last_name', 'middle_name',
                'user_role', 'user_status', 'contact', 'specialization', 'department'
            )
        }),
        ('Permissions', {
            'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'first_name', 'last_name', 'middle_name',
                'user_role', 'user_status', 'contact', 'specialization', 'department',
                'password1', 'password2', 'is_staff', 'is_active'
            )
        }),
    )

    search_fields = ('username', 'email', 'first_name', 'last_name', 'middle_name', 'contact', 'specialization', 'department')
    ordering = ('username',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Training)
admin.site.register(AssignedTraining)
admin.site.register(Competency)
admin.site.register(Progress)
admin.site.register(Employee)
admin.site.register(Supervisor)
admin.site.register(Employee_Supervisor)
admin.site.register(EnrolledTraining)
admin.site.register(LearningActionPlan)