#django imports
from django.shortcuts import render, redirect
from django.utils import timezone

#Local imports
from .models import CustomUser
from .serializers import UserSerializer, UserCreateSerializer, UserEditSerializer, ChangePasswordSerializer

#Rest framework imports
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken



#A view to register a new user
class UserCreateView(APIView):
    #permission_classes = [IsAuthenticated,]
    permission_classes = [AllowAny,]
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#A view to obtain token pair and update last login to now
class TokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super(TokenObtainPairView, self).post(request, *args, **kwargs)
        user = CustomUser.objects.get(pk=request.user.id)
        user.last_login = timezone.now()
        user.save()
        return response




#a view to logout a user
class UserLogoutView(APIView):
    """
    The user is logged out by blacklisting the refresh token
    so that we can stop the client from receiving new access tokens.
    If the request contains 'all' as a parameter, all refresh tokens are blacklisted.
    """
    permission_classes = [IsAuthenticated,]
    def post(self, request, *args, **kwargs):
        if self.request.data.get('all'):
            token: OutstandingToken
            for token in OutstandingToken.objects.filter(user=CustomUser.objects.get(pk=request.user.id)):
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response({"status": "All tokens blacklisted"}, status=status.HTTP_205_RESET_CONTENT)
        refresh_token = self.request.data.get('refresh_token')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "You are logged out"}, status=status.HTTP_205_RESET_CONTENT)


class UserView(APIView):
    permission_classes = [IsAuthenticated,]
    def get(self, request):
        user = CustomUser.objects.get(pk=request.user.id)
        serializer = UserSerializer(user)
        return Response(serializer.data)



#a view to edit the user's information
class UserEditView(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request):
        serializer = UserEditSerializer(request.user, data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User updated successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





#a view to change the user's password
#when the password is changed, blacklist all refresh tokens
class UserChangePasswordView(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request):
        serializer = ChangePasswordSerializer(request.user, data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


















        



















        






    



