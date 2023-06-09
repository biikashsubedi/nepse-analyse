from django.shortcuts import render
from .models import Config
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic import CreateView, ListView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .forms import *


# Create your views here.
class Index(ListView):
    model = Config
    template_name = "backend/config/index.html"


class Create(SuccessMessageMixin, CreateView):
    model = Config
    form_class = ConfigForm
    template_name = "backend/config/form.html"
    success_message = "Config Created Successfully."
    success_url = reverse_lazy('config:index')


class Update(SuccessMessageMixin, UpdateView):
    model = Config
    form_class = ConfigForm
    template_name = "backend/config/form.html"
    success_message = "Config Updated Successfully."
    success_url = reverse_lazy('config:index')


class Delete(SuccessMessageMixin, DeleteView):
    model = Config
    template_name = "backend/layouts/deletePopUp.html"
    success_message = "Config Deleted Successfully."
    success_url = reverse_lazy('config:index')
