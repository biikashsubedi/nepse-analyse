from django.urls import path, include
from .views import *

# app_name = 'user'
urlpatterns = [
    path('users/', UserIndexView.as_view(), name='user.index'),
    path('login/', LoginPage, name='login'),
    # path('register/', RegisterPage, name='system.register'),
    path('logout/', logoutView, name='logout'),
]
