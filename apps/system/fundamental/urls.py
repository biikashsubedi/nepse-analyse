from django.urls import path
from .views import *

app_name = 'fundamental'
urlpatterns = [
    path('data/list', DataIndexView.as_view(), name='index'),
    path('data/collect', DataCollectIndexView.as_view(), name='collect'),
    path('data/process/<str:pk>/', DataIndexView.as_view(), name='data.process'),
]
