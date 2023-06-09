from django.urls import path
from .views import *

app_name = 'config'
urlpatterns = [
    path('', Index.as_view(), name='index'),
    path('create/', Create.as_view(), name='create'),
    path('update/<str:pk>', Update.as_view(), name='update'),
    path('delete/<str:pk>', Delete.as_view(), name='delete'),
]
