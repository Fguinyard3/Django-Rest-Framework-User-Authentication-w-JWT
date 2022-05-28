from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser
from random import randint
from django.utils import timezone





#a serializer for the user model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'date_joined', 'last_login', 'is_active', 'balance']

#a class to create a new user. the user has to put in their password twice and validate that they are the same
class UserCreateSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password_confirmation = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    balance = serializers.IntegerField(default=0)

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError('Passwords must match')
        #also if the user already exists
        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError('User already exists')
        return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            validated_data['email'],
            validated_data['password']
        )
        user.balance = randint(0,10000)
        user.save()
        return user


#a serializer to edit the current user's information
#the user must enter their current password to edit their information
class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True},'balance': {'read_only': True}}

    #validate that the password is correct
    def validate(self, data):
        if not self.instance.check_password(data['password']):
            raise serializers.ValidationError('Incorrect password')
        return data

    def update(self, instance, validated_data):
        instance.email = validated_data['email']
        instance.save()
        return instance



# a serializer to change the password of the user
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError("Old password is incorrect")
        return data

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance
        


















    







    



    
