from card_decks.models import CardDeck, SetItem, Set
from django.db.models import Prefetch
from cards.models import Products
from django.core.exceptions import ObjectDoesNotExist
#получение всех карточек пользователя - аналог корзины
def get_user_carddecks(request):
    if request.user.is_authenticated:
        #с помощью .select_related('product') мы объединили 2 запроса в один - когда получаем корзина, также получаем товары которые на них ссылаются
        return CardDeck.objects.filter(user=request.user).select_related('product')
    #Если пользователь неавторизован создадим ему сессионый ключ, возможно уберем в будущем
    if not request.session.session_key:
        request.session.create()
    return CardDeck.objects.filter(session_key=request.session.session_key).select_related('product')

def get_user_cardsets(request):
    if request.user.is_authenticated:
        # Получаем все карточки в наборе для авторизованного пользователя
        return Set.objects.filter(user=request.user).prefetch_related(
            Prefetch(
                "setitem_set",
                queryset=SetItem.objects.select_related("product"),
            )
        ).order_by('created_timestamp')  # Сортируем по времени создания в убывающем порядке
    else:
        # Если пользователь не авторизован, используем сессионный ключ
        if not request.session.session_key:
            request.session.create()
        return Set.objects.filter(session_key=request.session.session_key).select_related('product').order_by('-created_timestamp')


#допилить запрос карточек в наборе пользователя
def get_user_setitem(request):
    if request.user.is_authenticated:
        # Получаем все карточки в наборе для авторизованного пользователя
        return SetItem.objects.filter(set__user=request.user).select_related('product')
    else:
        # Если пользователь не авторизован, используем сессионный ключ
        if not request.session.session_key:
            request.session.create()
        return SetItem.objects.filter(session_key=request.session.session_key).select_related('product')


#данные для карточек персонажей в наборе карт пользователя
#переделать и убрать
def get_user_cardsets_hero(request):
    if request.user.is_authenticated:
        # Получаем все карточки в наборе для авторизованного пользователя
        sets = Set.objects.filter(user=request.user).prefetch_related(
            Prefetch(
                "setitem_set",
                queryset=SetItem.objects.select_related("product"),
            )
        ).order_by('-id')  # Сортируем по времени создания в убывающем порядке
    else:
        # Если пользователь не авторизован, используем сессионный ключ
        if not request.session.session_key:
            request.session.create()
        sets = Set.objects.filter(session_key=request.session.session_key).select_related('product').order_by('-created_timestamp')
    filtered_sets = {}
    for set_obj in sets:
        filtered_items = list(set_obj.setitem_set.filter(
            product__category__name='Персонажи',
            quantity__gt=0
        ).order_by('-id')[:3])  # Преобразуем QuerySet в список
        # Если filtered_items содержит менее 3 элементов, добавляем пустые заглушки
        if len(filtered_items) < 3:
            empty_count = 3 - len(filtered_items)
            # default_product = Products.objects.get(name="empty")
            if Products.objects.filter(name="empty").exists():
                for i in range(empty_count):
                    empty_set_obj = SetItem()
                    # Задаем временные PK для каждой заглушки
                    empty_set_obj.pk = i
                    empty_set_obj.product = Products.objects.get(name="empty")
                    #empty_set_obj.product.category.name = default_product.category.name
                    empty_set_obj.set_id = set_obj.id
                    empty_set_obj.item_id = i
                    empty_set_obj.quantity = 0
                    filtered_items.append(empty_set_obj)
            else:
                for i in range(empty_count):
                    empty_set_obj = SetItem()
                    # Задаем временные PK для каждой заглушки
                    empty_set_obj.pk = i
                    # empty_set_obj.product = default_product
                    #empty_set_obj.product.category.name = default_product.category.name
                    empty_set_obj.set_id = set_obj.id
                    empty_set_obj.item_id = i
                    empty_set_obj.quantity = 0
                    filtered_items.append(empty_set_obj)
        # Добавляем отфильтрованные элементы к каждому набору
        filtered_sets = filtered_items
    return filtered_sets


