from django.urls import path

from .views import UserCreateView, UserLogoutView, UserView, UserEditView, UserChangePasswordView

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('user/', UserView.as_view(), name='user'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', UserCreateView.as_view(), name='register'),    
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('edit/', UserEditView.as_view(), name='edit'),
    path('change-password/', UserChangePasswordView.as_view(), name='change_password'),
]






