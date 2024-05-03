from django.urls import path
from card_decks import views
app_name = 'carddecks'

urlpatterns = [
    path('carddeck_add/', views.carddeck_add, name='carddeck_add'),
    path('carddeck_change/', views.carddeck_change, name='carddeck_change'),
    path('carddeck_remove/', views.carddeck_remove, name='carddeck_remove'),
    path('cardset_create/', views.cardset_create, name='cardset_create'),
    path('cardset_change/', views.cardset_change, name='cardset_change'),
    path('cardset_remove/', views.cardset_remove, name='cardset_remove'),
    path('setitem_remove/', views.setitem_remove, name='setitem_remove'),
]