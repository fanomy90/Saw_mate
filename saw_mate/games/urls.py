from django.urls import path
from games import views
app_name = 'games'

urlpatterns = [
    path('new_game/', views.new_game, name='new_game'),
    path('genshin_game/', views.genshin_game, name='genshin_game'),
    path('lan_game/', views.lan_game, name='lan_game'),
]