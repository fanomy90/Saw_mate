from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.template.loader import render_to_string
from carts.models import Cart
from carts.utils import get_user_carts

from cards.models import Products
#упрощаяем работу с покупкой карточек
def cart_add(request):
    #получает с фронта id купленной карточки
    product_id = request.POST.get("product_id")
    #получаем объект товара в корзину
    product = Products.objects.get(id=product_id)
    if request.user.is_authenticated:
        #запрашиваем корзину пользователя по определенному товару
        carts = Cart.objects.filter(user=request.user, product=product)
        #если товар уже есть в корзине то увеличиваем количество товара на 1 и сохраняем корзину
        if carts.exists():
            cart = carts.first()
            if cart:
                cart.quantity += 1
                cart.save()
            #если корзина по доавбляемому товару не найдена то создаем ее
        else:
            Cart.objects.create(user=request.user, product=product, quantity=1)
    #добавление товара в корзину для неавторизованного пользователя
    else:
        carts = Cart.objects.filter(
            session_key=request.session.session_key, product=product)
        if carts.exists():
            cart = carts.first()
            if cart:
                cart.quantity += 1
                cart.save()
        else:
            Cart.objects.create(session_key=request.session.session_key, product=product, quantity=1)
    #работа с jquery для перерисовки корзины без обновления страницы
    #получаем все корзины пользователя с помошью метода из файла utils.py
    user_cart = get_user_carts(request)
    #преобразуем в строку разметку корзины пользователя с передачей в разметку контекста user_cart и request
    cart_items_html = render_to_string(
        #формируем часть разметки шаблона в виде строки и контекст в виде словаря для перерисовки с помощью jquery
        "carts/includes/included_cart.html", {"carts": user_cart}, request=request)
    #формируем контекст для передачи в виде json словаря
    response_data = {
        #передаем текст оповещения
        "message": "Товар добавлен в корзину",
        #передаем разметку содержимого корзины для переотрисовки с помощью jquery
        "cart_items_html": cart_items_html,
    }
    return JsonResponse(response_data)

def cart_change(request):
    #получаем данные из post запроса
    cart_id = request.POST.get("cart_id")
    #получаем с фронтенда количество товара которое должно быть в корзине
    quantity = request.POST.get("quantity")
    #получаем экзепляр объекта корзины из модели по id
    cart = Cart.objects.get(id=cart_id)
    #Формируем данные для контекста - записываем количество товара в корзине
    cart.quantity = quantity
    cart.save()
    update_quantity = cart.quantity
    #работа с jquery для перерисовки корзины без обновления страницы
    #получаем все корзины пользователя с помошью метода из файла utils.py
    cart = get_user_carts(request)
    cart_items_html = render_to_string(
        #формируем часть разметки шаблона в виде строки и контекст в виде словаря для перерисовки с помощью jquery
        "carts/includes/included_cart.html", {"carts": cart}, request=request
    )
    #собираем контекст для передачи в jquery
    response_data = {
        "message": "Количество товара изменено",
        "cart_items_html": cart_items_html,
        "quantity": update_quantity,
    }
    return JsonResponse(response_data)
    
def cart_remove(request):
    #получаем данные из post запроса
    cart_id = request.POST.get("cart_id")
    #собираем данные для контекста
    #получаем экзепляр объекта корзины из модели по idcart_change
    cart = Cart.objects.get(id=cart_id)
    quantity = cart.quantity
    cart.delete()
    #работа с jquery для перерисовки корзины без обновления страницы
    #получаем все корзины пользователя с помошью метода из файла utils.py
    user_cart = get_user_carts(request)
    cart_items_html = render_to_string(
        #формируем часть разметки шаблона в виде строки и контекст в виде словаря для перерисовки с помощью jquery
        "carts/includes/included_cart.html", {"carts": user_cart}, request=request)
    #собираем контекст для передачи в jquery
    response_data = {
        "message": "Товар удален",
        "cart_items_html": cart_items_html,
        "quantity_deleted": quantity,
    }
    return JsonResponse(response_data)