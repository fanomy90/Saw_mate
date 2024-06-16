from django.db.models import Q
from django.forms import ValidationError
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.template.loader import render_to_string
from card_decks.models import CardDeck, Set, SetItem
from card_decks.utils import get_user_carddecks, get_user_setitem, get_user_cardsets, get_user_cardsets_hero
from card_decks.forms import CreateCardsetForm
from django.contrib import messages
from django.db import transaction
from django.shortcuts import get_object_or_404

from cards.models import Products
#упрощаяем работу с покупкой карточек
def carddeck_add(request):
    #получает с фронта id купленной карточки
    product_id = request.POST.get("product_id")
    try:
        product = Products.objects.get(id=product_id)
    except Products.DoesNotExist:
        return JsonResponse({"error": "Товар с указанным идентификатором не найден."}, status=400)
    #получаем объект товара в корзину
    product = Products.objects.get(id=product_id)
    if request.user.is_authenticated:
        #запрашиваем корзину пользователя по определенному товару
        carddecks = CardDeck.objects.filter(user=request.user, product=product)
        #если товар уже есть в корзине то увеличиваем количество товара на 1 и сохраняем корзину
        if carddecks.exists():
            carddeck = carddecks.first()
            if carddeck:
                carddeck.quantity += 1
                carddeck.save()
            #если корзина по доавбляемому товару не найдена то создаем ее
        else:
            CardDeck.objects.create(user=request.user, product=product, quantity=1)
    #добавление товара в корзину для неавторизованного пользователя
    else:
        carddecks = CardDeck.objects.filter(
            session_key=request.session.session_key, product=product)
        if carddecks.exists():
            carddeck = carddecks.first()
            if carddeck:
                carddeck.quantity += 1
                carddeck.save()
        else:
            CardDeck.objects.create(session_key=request.session.session_key, product=product, quantity=1)
    #работа с jquery для перерисовки корзины без обновления страницы
    #получаем все корзины пользователя с помошью метода из файла utils.py
    user_carddeck = get_user_carddecks(request)
    #преобразуем в строку разметку корзины пользователя с передачей в разметку контекста user_cart и request
    carddeck_items_html = render_to_string(
        #формируем часть разметки шаблона в виде строки и контекст в виде словаря для перерисовки с помощью jquery
        "card_decks/includes/included_carddeck.html", {"carddecks": user_carddeck}, request=request)
    #формируем контекст для передачи в виде json словаря
    response_data = {
        #передаем текст оповещения
        "message": "Карта добавлена в колоду",
        #передаем разметку содержимого корзины для переотрисовки с помощью jquery
        "carddeck_items_html": carddeck_items_html,
    }
    return JsonResponse(response_data)

# def carddeck_change(request):
#     #получаем данные из post запроса
#     carddeck_id = request.POST.get("carddeck_id")
#     #получаем с фронтенда количество товара которое должно быть в корзине
#     quantity = request.POST.get("quantity")
#     #получаем экзепляр объекта корзины из модели по id
#     carddeck = CardDeck.objects.get(id=carddeck_id)
#     #Формируем данные для контекста - записываем количество товара в корзине
#     carddeck.quantity = quantity
#     carddeck.save()
#     update_quantity = carddeck.quantity
#     #работа с jquery для перерисовки корзины без обновления страницы
#     #получаем все корзины пользователя с помошью метода из файла utils.py
#     carddeck = get_user_carddecks(request)
#     carddeck_items_html = render_to_string(
#         #формируем часть разметки шаблона в виде строки и контекст в виде словаря для перерисовки с помощью jquery
#         "card_decks/includes/included_carddeck.html", {"carddecks": carddeck}, request=request
#     )
#     #собираем контекст для передачи в jquery
#     response_data = {
#         "message": "Количество карт в колоде изменено",
#         "carddeck_items_html": carddeck_items_html,
#         "quantity": update_quantity,
#     }
#     return JsonResponse(response_data)

#переносим карту из колоды в набор
def carddeck_change(request):
    #работаем с набором карт пользователя
    #получаем данные из post запроса о колоде пользователя
    carddeck_id = request.POST.get("carddeck_id")
    #получаем экзепляр объекта набора карт из модели по id
    carddeck = CardDeck.objects.get(id=carddeck_id)
    #получим количество объекта из модели
    #quantity = setitem.quantity
    if carddeck.quantity >= 1:
        carddeck.quantity -=1
        carddeck.save()

    cardset_id = request.POST.get("cardset_id")
    print('набор карт')
    print(cardset_id)
    cardset, created = Set.objects.get_or_create(id=cardset_id, user=request.user)
    
    setitem, created = SetItem.objects.get_or_create(set=cardset, product=carddeck.product, defaults={"quantity": 1})
    setitem.quantity += 1
    setitem.save()

    #работаем с перерисовкой шаблонов
    #получаем все наборы карт пользователя с помошью метода из файла utils.py
    user_cardset = get_user_cardsets(request)
    user_cardsets_hero = get_user_cardsets_hero(request)
    #преобразуем в строку разметку набора карт пользователя с передачей в разметку контекста
    cardset_items_html = render_to_string(
        "card_decks/includes/included_slider_cardset.html", {"cardsets": user_cardset}, {"cardsets_hero": user_cardsets_hero}, request=request)
    #получаем колоду пользователя с помошью метода из файла utils.py
    user_carddeck = get_user_carddecks(request)
    #преобразуем в строку разметку колоды пользователя с передачей в разметку контекста
    carddeck_items_html = render_to_string(
        #формируем часть разметки шаблона в виде строки и контекст в виде словаря для перерисовки с помощью jquery
        "card_decks/includes/included_slider.html", {"carddecks": user_carddeck}, request=request)
    #собираем контекст для передачи измений в наборе карт в jquery
    response_data = {
        "message": "Карточка успешно убрана из набора и возвращена в колоду карт",
        "cardset_items_html": cardset_items_html,
        "carddeck_items_html": carddeck_items_html,
    }
    return JsonResponse(response_data)

#сделать как продажу карточки чтобы получить деньги для покупки новой
def carddeck_remove(request):
    #получаем данные из post запроса
    carddeck_id = request.POST.get("carddeck_id")
    #собираем данные для контекста
    #получаем экзепляр объекта корзины из модели по idcart_change
    carddeck = CardDeck.objects.get(id=carddeck_id)
    quantity = carddeck.quantity
    carddeck.delete()
    #работа с jquery для перерисовки корзины без обновления страницы
    #получаем все корзины пользователя с помошью метода из файла utils.py
    user_carddeck = get_user_carddecks(request)
    carddeck_items_html = render_to_string(
        #формируем часть разметки шаблона в виде строки и контекст в виде словаря для перерисовки с помощью jquery
        # "card_decks/includes/included_carddeck.html", {"carddecks": user_carddeck}, request=request)
        "card_decks/includes/included_slider.html", {"carddecks": user_carddeck}, request=request)
    #собираем контекст для передачи в jquery
    response_data = {
        "message": "Карта удалена из колоды",
        "carddeck_items_html": carddeck_items_html,
        "quantity_deleted": quantity,
    }
    return JsonResponse(response_data)

#@login_required
def cardset_create(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                user = request.user
                Set.objects.create(user=user)
                messages.success(request, 'Новый набор карт создан')
        except ValidationError as e:
            messages.error(request, str(e))
        # Получаем все наборы карт пользователя с помощью метода из файла utils.py
        user_cardset = get_user_cardsets(request)
        # Преобразуем в строку разметку набора карт пользователя с передачей в разметку контекста
        cardset_items_html = render_to_string("card_decks/includes/included_cardset_item.html", {"cardsets": user_cardset}, request=request)
        # Собираем контекст для передачи изменений в наборе карт в jQuery
        response_data = {
            "message": "Набор карт успешно создан и отрисован",
            "cardset_items_html": cardset_items_html,
        }
        return JsonResponse(response_data)
    return JsonResponse({"error": "Invalid request method"}, status=400)

#@login_required
def cardset_add(request):
    if request.method == 'POST':
        form = CreateCardsetForm(data=request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():
                    user = request.user
                    carddeck_items = CardDeck.objects.filter(user=user)

                    if carddeck_items.exists():
                        cardset = Set.objects.create(
                            user=user,
                            active=form.cleaned_data['cardset_status'],
                        )
                        #добавляем карточки в набор
                        for carddeck_item in carddeck_items:
                            product = carddeck_item.product
                            name = carddeck_item.product.name
                            quantity = carddeck_item.quantity

                            SetItem.objects.create(
                                set = cardset,
                                product = product,
                                #name = name,
                                quantity = quantity,
                            )
                            #меняем количество карточек в колоде - будем также менять в обратную сторону при корректировке набора карт
                            #тут меняется количество товара в модели product как было в магазине - нужно поменять на модель колоды CardDeck
                            product.quantity -= quantity
                            product.save()
                            
                        messages.success(request, 'Карты успешно добавлены в набор')
            except ValidationError as e:
                messages.success(request, str(e))
    else:
        initial = {
            'cardset_name': "новый набор",
            'cardset_status': False,
        }
        form = CreateCardsetForm(initial=initial)
    context = {
        'title': 'Home = создание набора карт для игры',
        'form': form,
        'cardset': True,
    }
    return render(request, 'card_decks/cardset_create.html', context=context)

def cardset_change(request):
    if request.method == 'POST':
        try:
            with transaction.atomic():
                # user = request.user
                cardset_id = request.POST.get("cardset_id")
                cardset = Set.objects.get(id=cardset_id, user=request.user)
                cardset.active = 1
                messages.success(request, 'Набор карт получен из БД')
        except ValidationError as e:
            messages.error(request, str(e))
                # Получаем все наборы карт пользователя с помощью метода из файла utils.py
        user_cardset = get_user_cardsets(request)
        # Преобразуем в строку разметку набора карт пользователя с передачей в разметку контекста
        cardset_items_html = render_to_string("card_decks/includes/included_cardset_item.html", {"cardsets": user_cardset}, request=request)
        # Собираем контекст для передачи изменений в наборе карт в jQuery
        response_data = {
            "message": "Набор карт передан для показа",
            "cardset_items_html": cardset_items_html,
        }
        return JsonResponse(response_data)
    return JsonResponse(response_data)

#переносим карту из набора в колоду
# def cardset_change(request):
#     # Получаем данные из POST-запроса о наборе пользователя
#     setitem_id = request.POST.get("setitem_id")
#     # Получаем экземпляр объекта набора карт из модели по id или возвращаем 404 ошибку, если объект не найден
#     #setitem = get_object_or_404(SetItem, id=setitem_id)
#     setitem = SetItem.objects.get(id=setitem_id)
    
#     # Проверяем, существует ли у объекта набора карт quantity больше или равное 1
#     if setitem.quantity >= 1:
#         setitem.quantity -= 1
#         setitem.save()
#     # else:
#     #     setitem.delete()

#     # Работаем с колодой карт пользователя
#     carddecks = CardDeck.objects.filter(user=request.user, product=setitem.product)
#     if carddecks.exists():
#         carddeck = carddecks.first()
#         if carddeck:
#             carddeck.quantity += 1
#             carddeck.save()
#     else:
#         # Если объекта в колоде не существует, создаем новый объект для данного пользователя и продукта
#         CardDeck.objects.create(user=request.user, product=setitem.product, quantity=1)
    
#     # Работаем с перерисовкой шаблонов
#     # Получаем все наборы карт пользователя с помощью метода из файла utils.py
#     user_cardset = get_user_cardsets(request)
#     #user_cardset = get_user_setitem(request)
#     # Преобразуем в строку разметку набора карт пользователя с передачей в разметку контекста
#     cardset_items_html = render_to_string("card_decks/includes/included_slider_cardset.html", {"cardsets": user_cardset}, request=request)
#     # Получаем колоду пользователя с помощью метода из файла utils.py
#     user_carddeck = get_user_carddecks(request)
#     # Преобразуем в строку разметку колоды пользователя с передачей в разметку контекста
#     carddeck_items_html = render_to_string("card_decks/includes/included_slider.html", {"carddecks": user_carddeck}, request=request)
    
#     # Собираем контекст для передачи изменений в наборе карт в jQuery
#     response_data = {
#         "message": "Карточка успешно убрана из набора и возвращена в колоду карт",
#         "cardset_items_html": cardset_items_html,
#         "carddeck_items_html": carddeck_items_html,
#     }
#     return JsonResponse(response_data)

def cardset_remove(request):
    cardset_id = request.POST.get("cardset_id")
    cardset = Set.objects.get(id=cardset_id)
    # quantity = cardset.SetItem.total_quantity
    cardset.delete()
    # получаем все наборы карт пользователя и перерисовываем подключаемый шаблон
    user_cardset = get_user_cardsets(request)
    cardset_items_html = render_to_string(
        "card_decks/includes/included_cardset_item.html", {"cardsets": user_cardset}, request=request)
    response_data = {
        "message": "Набор карт пользователя удален",
        "cardset_items_html": cardset_items_html,
        # "quantity_deleted": quantity,
    }
    return JsonResponse(response_data)

#@login_required
def setitem_remove(request):
    #нужно дополнительно получить из запроса id набора карт в котором будем производить удаление
    #получаем данные из post запроса
    setitem_id = request.POST.get("setitem_id")
    #собираем данные для контекста
    #получаем экзепляр объекта корзины из модели по id
    setitem = SetItem.objects.get(id=setitem_id)
    quantity = setitem.quantity
    setitem.delete()
    #работа с jquery для перерисовки корзины без обновления страницы
    #получаем все корзины пользователя с помошью метода из файла utils.py
    user_setitem = get_user_setitem(request)
    setitem_items_html = render_to_string(
        #формируем часть разметки шаблона в виде строки и контекст в виде словаря для перерисовки с помощью jquery
        "card_decks/includes/included_slider_cardset.html", {"carddecks": user_setitem}, request=request)
    #собираем контекст для передачи в jquery
    response_data = {
        "message": "Карта удалена из колоды",
        "carddeck_items_html": setitem_items_html,
        "quantity_deleted": quantity,
    }
    return JsonResponse(response_data)