# Generated by Django 5.1.7 on 2025-05-11 05:28

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_assignedtraining_at_employee_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('supervisor', models.ForeignKey(limit_choices_to={'user_role': 'employee'}, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Supervisor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('supervisor', models.ForeignKey(limit_choices_to={'user_role': 'supervisor'}, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Employee_Supervisor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee_to_supervise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='supervises_employees', to='api.employee')),
                ('supervisor_of_employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_supervisor', to='api.supervisor')),
            ],
        ),
    ]
