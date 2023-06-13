from django.db.models import Q
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import ListView
from .models import FinancialData
import requests

from ..data.models import Exchange


class DataIndexView(ListView):
    model = FinancialData
    paginate_by = 50
    template_name = "backend/financial/index.html"


class DataCollectIndexView(ListView):
    model = Exchange
    paginate_by = 50
    template_name = "backend/financial/collect.html"

    def get_queryset(self):
        queryset = super().get_queryset()
        keyword = self.request.GET.get('keyword')

        if keyword:
            queryset = queryset.filter(Q(title__icontains=keyword) | Q(title__icontains=keyword.lower()))
        return queryset


class DataProcessView(ListView):
    model = FinancialData
    success_message = "Exchange Data Synced Successfully."
    error_message = "Failed to sync exchange data from the API."
    success_url = reverse_lazy('fundamental:index')

    def get(self, request, *args, **kwargs):
        exchange = self.kwargs['pk']
        dd(exchange)
