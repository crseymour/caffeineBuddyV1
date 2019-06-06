from django.http import HttpResponse
from django.shortcuts import render

def homepage(request):
    # return HttpResponse('homepage')
    return render(request, 'base_layout.html')

def signup(request):
    # return HttpResponse('about')
    return render(request, 'signup_layout.html')
