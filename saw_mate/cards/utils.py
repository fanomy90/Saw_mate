from cards.models import Products
from django.db.models import Q
#from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, SearchHeadline

def q_search(query):
#Вариант текстового поиска в sqlite3
    #для полнотекстового поиска входные данные разбиваем на составляющие и формируем из них список из токенов запроса
    keywords = [word for word in query.split() if len(word) > 2]
    #создаем переменную как пустой Q объект для полнотекстового поиска
    q_objects = Q()

    for token in keywords:
        #знак |= означает или равно и добавит Q объект в коллекцию в суммарное выражение Q объектов
        q_objects |= Q(description__icontains=token)
        #добавляем поиск по иммени
        q_objects |= Q(name__icontains=token)
        #применяем фильтр из Q объектов на методе object для формирования SQL запроса
    return Products.objects.filter(q_objects)