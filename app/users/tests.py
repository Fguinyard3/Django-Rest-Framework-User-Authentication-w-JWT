from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

#An API client to to create and test login with users

class UserViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'test_user',
            'email': 'testuser@django.com',
            'password': 'testpassword'
        }

    def test_register_valid_user(self):
        response = self.client.post(reverse('register'), self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.user_data['email'])

    def test_register_invalid_user(self):
        self.user_data['username'] = ''
        response = self.client.post(reverse('register'), self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['username'][0], 'This field may not be blank.')
        self.assertEqual(response.data['email'][0], 'This field may not be blank.')
        self.assertEqual(response.data['password'][0], 'This field may not be blank.')

    def test_login_valid_user(self):
        response = self.client.post(reverse('login'), self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user_data['email'])

    def test_login_invalid_user(self):
        self.user_data['password'] = 'wrongpassword'
        response = self.client.post(reverse('login'), self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['non_field_errors'][0], 'Unable to log in with provided credentials.')

    def test_login_invalid_user_no_password(self):
        self.user_data['password'] = ''
        response = self.client.post(reverse('login'), self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['password'][0], 'This field may not be blank.')

    def test_login_invalid_user_no_email(self):
        self.user_data['email'] = ''
        response = self.client.post(reverse('login'), self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['email'][0], 'This field may not be blank.')




