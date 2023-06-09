from django.shortcuts import render
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect
from .forms import *
from .models import *
from django.contrib import messages
from django.db.models import Q
from django.views.generic import ListView


# Create your views here.

class UserIndexView(ListView):
    model = User
    paginate_by = 50
    template_name = "backend/user/index.html"


def LoginPage(request):
    form = LoginForm(request.POST or None)

    if form.is_valid():
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            login(request, user)
            messages.success(request, 'User Successfully Logging')
            return redirect('home')
        else:
            messages.error(request, 'User Not found')

    context = {
        'form': form
    }
    return render(request, 'backend/auth/login.html', context)


#
# def RegisterPage(request):
#     form = UserCreationForm(request.POST or None)
#
#     if form.is_valid():
#         username = form.cleaned_data.get('username')
#         password = form.cleaned_data.get('password')
#
#         user = form.save()
#         login(request, user)
#         messages.success(request, 'User Successfully Created')
#         return redirect('system')
#     else:
#         form = UserCreationForm()
#
#     context = {
#         'form': form
#     }
#     return render(request, 'backend/auth/register.html', context)


def logoutView(request):
    logout(request)
    messages.success(request, 'Logout Successfully')
    return redirect('login')
