from django.shortcuts import render
from .models import Shape
import json


# Create your views here.
def new_game(request):
    shapes = [{"type": int(x.type), "color": x.color} for x in Shape.objects.all()]
    shape_json = json.dumps(shapes)
    context: dict = {
        'title': 'Новая игра',
        'content': 'игра с ботом',
        'text_on_page': 'Здесь могла быть ваша херня',
        'shapes': shape_json,
    }
    return render(request, 'games/new_game.html', context)

def lan_game(request):
    context: dict = {
        'title': 'Сетевая игра',
        'content': 'поиск игроков и игра по сети',
        'text_on_page': 'Здесь могла быть ваша херня'
    }
    return render(request, 'games/lan_game.html', context)