# Generated by Django 5.1.7 on 2025-05-07 11:07

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Training',
            fields=[
                ('training_ID', models.AutoField(primary_key=True, serialize=False)),
                ('training_title', models.CharField(max_length=200)),
                ('training_venue', models.CharField(max_length=200)),
                ('training_date', models.DateField()),
                ('training_type', models.CharField(choices=[('technical', 'Technical'), ('financial', 'Financial'), ('supervisorial', 'Supervisorial'), ('hr', 'HR'), ('administrative', 'Administrative')], max_length=100)),
                ('training_category', models.CharField(choices=[('mandatory', 'Mandatory'), ('optional', 'Optional')], max_length=20)),
                ('training_status', models.CharField(choices=[('scheduled', 'Scheduled'), ('ongoing', 'Ongoing'), ('completed', 'Completed')], default='scheduled', max_length=20)),
            ],
            options={
                'ordering': ['training_ID'],
            },
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('user_role', models.CharField(choices=[('admin', 'Admin'), ('employee', 'Employee'), ('supervisor', 'Supervisor')], default='employee', max_length=20)),
                ('contact', models.CharField(blank=True, max_length=20, null=True)),
                ('middle_name', models.CharField(blank=True, max_length=20, null=True)),
                ('specialization', models.CharField(choices=[('one', 'ONE'), ('two', 'TWO')], default='one', max_length=20)),
                ('department', models.CharField(max_length=20)),
                ('user_status', models.CharField(choices=[('active', 'Active'), ('deactivated', 'Deactivated')], default='active', max_length=20)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Competency',
            fields=[
                ('comp_ID', models.AutoField(primary_key=True, serialize=False)),
                ('comp_global', models.CharField(choices=[(1, 'Basic'), (2, 'Intermediate'), (3, 'Advanced')], default=1, max_length=20)),
                ('comp_solutions', models.CharField(choices=[(1, 'Basic'), (2, 'Intermediate'), (3, 'Advanced')], default=1, max_length=20)),
                ('comp_networking', models.CharField(choices=[(1, 'Basic'), (2, 'Intermediate'), (3, 'Advanced')], default=1, max_length=20)),
                ('comp_delivering', models.CharField(choices=[(1, 'Basic'), (2, 'Intermediate'), (3, 'Advanced')], default=1, max_length=20)),
                ('comp_collab', models.CharField(choices=[(1, 'Basic'), (2, 'Intermediate'), (3, 'Advanced')], default=1, max_length=20)),
                ('comp_agility', models.CharField(choices=[(1, 'Basic'), (2, 'Intermediate'), (3, 'Advanced')], default=1, max_length=20)),
                ('comp_prof', models.CharField(choices=[(1, 'Basic'), (2, 'Intermediate'), (3, 'Advanced')], default=1, max_length=20)),
                ('comp_employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='competencies', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AssignedTraining',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('at_employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_trainings', to=settings.AUTH_USER_MODEL)),
                ('at_training', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_employees', to='api.training')),
            ],
        ),
    ]
