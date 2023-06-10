from django.urls import path
from .views import *

app_name = 'nepse'
urlpatterns = [
    path('data/', DataIndexView.as_view(), name='data.index'),
    path('data/data-process', DataProcessView.as_view(), name='data.data.process'),

    path('symbol/', SymbolIndexView.as_view(), name='symbol.index'),
    path('symbol/data-process', SymbolDataProcessView.as_view(), name='symbol.data.process'),
    path('symbol/csv-process', SymbolCSVProcessView.as_view(), name='symbol.csv.process'),

    path('csv/', CSVIndexView.as_view(), name='csv.index'),
    path('csv-viewer/<str:pk>/', view_csv, name='csv.viewer'),
]
