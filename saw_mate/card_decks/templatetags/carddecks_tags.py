from django import template
from card_decks.models import CardDeck
from card_decks.utils import get_user_carddecks, get_user_cardsets, get_user_setitem, get_user_cardsets_hero
register = template.Library()
#Шаблонный тег для вывода всех корзин пользователя
@register.simple_tag()
def user_carddecks(request):
    return get_user_carddecks(request)

@register.simple_tag()
def user_cardsets(request):
    return get_user_cardsets(request)

@register.simple_tag()
def user_setitem(request):
    return get_user_setitem(request)

@register.simple_tag()
def user_cardsets_hero(request):
    return get_user_cardsets_hero(request)