
# Django Rest Framework User Authentication w/JWT

## Packages
* Django 4.0.4
* DjangoRestFramework 3.13.1
* DjangoCorsHeader 5.1.0
* DjangoRestFramework-simpleJWT
* React 17.0.2
* Others

## Postman JSON Link
* https://www.getpostman.com/collections/37fa8653c3b17485c98f

## Installation

Enviroment settings should already be pre-configured with the docker-compose.yaml file

Run sudo su (recommeneded for privilege)

```sh
$ sudo su
```
Run build

```sh
$ cd app
```

```sh
$ docker-compose run build
```

### Running the app

Run
```sh
$ docker-compose up -d
```
or
```sh
$ docker-compose up 
```
to view http logs


### Create Super User for Admin and Admin Dashboard

Run while containers are running
```sh
$ docker-compose exec -it web python manage.py createsuperuser
```
There will be 3 prompts. One for the email and the other two for the password and password confirmation

Navigate to http://localhost:8000/admin/ and input your credentials

From here you should be able to view Users, Outstanding or live Refresh Token, and Blacklisted RefreshTokens


#Design Choices

Django is Python web framework that allows you create secure and scalabe websites in a short amount of time, primarily due to its "batteries-included" philosophy . Django Rest Framework also adopts the same idea in that it makes things such as model serialization easy. DRF(Django Rest Framework) also has
a built in browsable api to visualize responses. 

I assumed that this app would model a banking app. I've chose to go with JWT authentication to provide stateless authentication; this allows users to login using their credentials and storing as much of the session information on the server side. This provides less database hits when requesting information. The purpose behind using JWT is that I can abstract the client-side from the backend using our encrypted token. The access token essentially has all the information
on the "claims" a user has to the information, all encrypted into one key. Using it this way prevents our frontend from having to validate the token against the database on every request. 

A challenge was making log out functionality. Access tokens cannot be deleted or revoked without major "hacking"; however To combat this, DRF simpleJWT provides a method in which you can blacklist refresh tokens and prevent the client side from obtaining a new access token when the validity of the short-lived access token is invalid. We define the lifetime for both token here:

```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    ...
}
```
I also provide the method to blacklist tokens here:
Automatically on refresh
```python
SIMPLE_JWT = {
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    ...
}
```
Manually blacklist on logout with option
```python
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request, *args, **kwargs):
        
        #If all is 1 in the request 
        if self.request.data.get('all'):
            token: OutstandingToken
            #for each refresh token the user owns, 
            for token in OutstandingToken.objects.filter(user=request.user):
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response({"status": "All tokens blacklisted"}, status=status.HTTP_205_RESET_CONTENT)
        refresh_token = self.request.data.get('refresh_token')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "You are logged out"}, status=status.HTTP_205_RESET_CONTENT)
```
Rotating refresh tokens allows us to change refresh tokens when a request is sent to /refresh, this gives us a new refresh token and invalidates the old one for security. This also helps us detect stolen refresh tokens.

JWT requires robust security on the frontend, so its imperative that when building an app with JWT that you trust the client to handle the tokens with care. Since this is a dummy project I opted to save the tokens in the session storage.
This is not ideal, but even on a larger scales JWT's are never 100% secure. 


#Troubleshooting Issues

*frontend Dockerfile is only used to copy and install all the deps for the React app, the container will exit after execution of npm run build

*When excecuting the entrypoint for the django dockerfile, the script will do:
```sh
python manage.py flush --no-input
python manage.py migrate
```
python manage.py flush --no-input essentially wipes DB on excution so to prevent loss of data when starting and stopping comment out the field  
```sh
#python manage.py flush --no-input
python manage.py migrate
```

*End urls with "/" when sending request to the api or you may get an error

*Since Django is serving the React App I made it so that any request sent outside of api/ and admin/ will be defaulted to the React app using regex

*If the website is having a hard time rendering after starting and stopping containers a few times try
```sh
$ docker-compose run build --no-cache
```

*After building you may need to clear cookies for localhost again due to variables and states that might be stored locally in the broswer










