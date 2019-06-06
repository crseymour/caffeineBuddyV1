from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from . import forms

# Create your views here.
def signup_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # log the user in
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request,'accounts/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            #log the user in
            user = form.get_user()
            login(request,user)
            if 'next' in request.POST:
                return redirect('home')
            else:
                return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    if request.method == "POST":
        logout(request)
        return redirect('home')

@login_required(login_url="/accounts/login/")
def save_data(request):
    if request.method == 'POST':
        form = forms.CreateItems(request.POST, request.FILES)
        #print(form)
        #print(form.errors)
        if form.is_valid():
            #print(form.divString)
            instance = form.save(commit=False)
            instance.author = request.user
            instance.save()
            return redirect('home')
    else:
        form = forms.CreateItems()
    return render(request, '', {'form': form})
