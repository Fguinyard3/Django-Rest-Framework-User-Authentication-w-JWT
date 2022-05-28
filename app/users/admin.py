from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin
from django.forms import CharField, Textarea, TextInput
from django.db import models
from django.forms import ModelForm


#Form to register new user

class CustomUserForm(ModelForm):
    class Meta:
        model = CustomUser
        fields = ['email', 'password','balance']
        widgets = {
            'email': TextInput(attrs={'class': 'form-control'}),
            'password': TextInput(attrs={'class': 'form-control'}),
        }


#Form to edit user

class CustomUserChangeForm(ModelForm):
    class Meta:
        model = CustomUser
        fields = ['email', 'password','balance']
        widgets = {
            'email': TextInput(attrs={'class': 'form-control'}),
            'password': TextInput(attrs={'class': 'form-control'}),
        }


#Admin class

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'groups']
    search_fields = ['email']
    ordering = ['email']
    filter_horizontal = ('groups', 'user_permissions')
    fieldsets = (
        (None, {'fields': ('email', 'password', 'balance')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')
        }),
    )
    readonly_fields = ('date_joined',)


#Register admin class

admin.site.register(CustomUser, CustomUserAdmin)