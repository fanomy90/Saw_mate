from django.shortcuts import render
from django.http import HttpResponse
from cards.models import Categories

# Create your views here.
def index(request):
    context: dict = {
        'title': 'Главная',
        'content': 'Наша первая Гача-Игра',
    }
    return render(request, 'main/index.html', context)

def about(request):
    context: dict = {
        'title': 'О нас',
        'content': 'О нас',
        'text_on_page': 'Здесь могла быть ваша херня'
    }
    return render(request, 'main/about.html', context)