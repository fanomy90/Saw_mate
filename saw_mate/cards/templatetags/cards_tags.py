from django import template
from cards.models import Categories
from django.utils.http import urlencode
#регистрируем пользовательский шаблон
register = template.Library()
#шаблонный тег для отображения категорий товаров
@register.simple_tag()
def tag_categories():
    return Categories.objects.all()
#шаблонный тег для передачи параметров фильтрации при использовании пагинации который принимает все контекстные переменные шаблона
@register.simple_tag(takes_context=True)
def change_params(context, **kwargs):
    #формируем словарь из контекста по ключу request - пользовательские фильтры
    query = context['request'].GET.dict()
    #расширяем словарь данными из шаблона - именованные параметры page=page переданные из шаблона
    query.update(kwargs)
    # формируем из словаря строку которую можно использовать как url адрес
    return urlencode(query)