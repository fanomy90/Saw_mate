from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from users.forms import UserLoginForm, UserRegistrationForm, ProfileForm
from django.contrib import auth, messages
from django.urls import reverse
from django.http import HttpResponseRedirect
from carts.models import Cart
from orders.models import Order, OrderItem
from django.db.models import Prefetch
from card_decks.models import CardDeck, Set, SetItem
from cards.models import Products

# Create your views here.
def login(request):
    if request.method == 'POST':
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            username = request.POST['username']
            password = request.POST['password']
            user = auth.authenticate(username=username, password=password)

            #сессионный ключ неавторизованного пользователя
            session_key = request.session.session_key

            if user:
                auth.login(request, user)
                #уведомление пользователя о входе
                messages.success(request, f"{username}, успешно вошел на сайт")

                #когда авторизуется пользователь с заполненной корзиной по сессионном ключу то привязываем ему корзину
                if session_key:
                    Cart.objects.filter(session_key=session_key).update(user=user)

                #редирект для неавторизованного пользователя
                redirect_page = request.POST.get('next', None)
                if redirect_page and redirect_page != reverse('user:logout'):
                    return HttpResponseRedirect(request.POST.get('next'))
                return HttpResponseRedirect(reverse('main:index'))
    else:
        form = UserLoginForm()

    context = {
        'title': 'Home - Авторизация',
        'form': form
    }
    return render(request, 'users/login.html', context)

def registration(request):
    if request.method == 'POST':
        form = UserRegistrationForm(data=request.POST)
        if form.is_valid():
            form.save()
            #сессионный ключ неавторизованного пользователя
            session_key = request.session.session_key
            #записываем в переменную введенные при регистрации данные
            user = form.instance
            #делаем автовход по сохраненным из формы регистрации данным
            auth.login(request, user)

            #когда регистрируется и авторизуется пользователь с заполненной корзиной по сессионном ключу то привязываем ему корзину
            if session_key:
                Cart.objects.filter(session_key=session_key).update(user=user)

            messages.success(request, f"{user.username}, успешно зарегистрировался и вошел на сайт")
            return HttpResponseRedirect(reverse('main:index'))
    else:
        form = UserRegistrationForm()
    context = {
        'title': 'Home - Регистрация',
        'form': form
    }
    return render(request, 'users/registration.html', context)
#ограничение доступа для неавторизованных пользователей
@login_required
def profile(request):
    # нужно будет добавить фильтр по купленным карточкам как было реализовано в catalog

    # вспоминить как работает
    if request.method == 'POST':
        form = ProfileForm(data=request.POST, instance=request.user, files=request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "Пользователь упешно обновлен")
            return HttpResponseRedirect(reverse('users:profile'))
    else:
        #отображение информации пользователя
        form = ProfileForm(instance=request.user)
    #отображение заказов в профиле
    orders = (
        #фильтруем заказы по пользователю
        Order.objects.filter(user=request.user).prefetch_related(
            #класс prefetch - указываем имя дополнительного queryset и формируем его из всех заказов по пользователю и через select_releted всеми товарами привязанными к этим заказам
            Prefetch(
                "orderitem_set",
                queryset=OrderItem.objects.select_related("product"),
            )
        )
        #сортируем полученные элементы по -id - вверху будет последний заказ
        .order_by("-id")
    )
    #отображение наборов карточек в профиле
    sets = (
        Set.objects.filter(user=request.user).prefetch_related(
            Prefetch(
                "setitem_set",
                queryset=SetItem.objects.select_related("product"),
            )
        )
        .order_by("-id")
    )

    # Переделать вывод карточек в наборе
    #передаем карточки героев
    # user_cardsets_hero = {}
    # for set_obj in sets:
    #     filtered_items = list(set_obj.setitem_set.filter(
    #         product__category__name='Персонажи',
    #         quantity__gt=0
    #     ).order_by('-id')[:3])  # Преобразуем QuerySet в список

    #     # Если filtered_items содержит менее 3 элементов, добавляем пустые заглушки
    #     if len(filtered_items) < 3:
    #         empty_count = 3 - len(filtered_items)

    #         if Products.objects.filter(name="empty").exists():
    #             for i in range(empty_count):
    #                 empty_set_obj = SetItem()
    #                 # Задаем временные PK для каждой заглушки
    #                 empty_set_obj.pk = i
    #                 empty_set_obj.product = Products.objects.get(name="empty")
    #                 #empty_set_obj.product.category.name = default_product.category.name
    #                 empty_set_obj.set_id = set_obj.id
    #                 empty_set_obj.item_id = i
    #                 empty_set_obj.quantity = 0
    #                 filtered_items.append(empty_set_obj)
    #         else:
    #             for i in range(empty_count):
    #                 empty_set_obj = SetItem()
    #                 # Задаем временные PK для каждой заглушки
    #                 empty_set_obj.pk = i
    #                 # empty_set_obj.product = default_product
    #                 #empty_set_obj.product.category.name = default_product.category.name
    #                 empty_set_obj.set_id = set_obj.id
    #                 empty_set_obj.item_id = i
    #                 empty_set_obj.quantity = 0
    #                 filtered_items.append(empty_set_obj)

    #     user_cardsets_hero = filtered_items

    context = {
        'title': 'Home - Кабинет',
        'form': form,
        'orders': orders,
        'sets': sets,
        # 'cardsets_hero': user_cardsets_hero,
    }

    return render(request, 'users/profile.html', context)

def users_cart(request):
    return render(request, "users/users_cart.html")

#ограничение доступа для неавторизованных пользователей
@login_required
def logout(request):
    messages.success(request, f"{request.user.username}, упешно вышел")
    auth.logout(request)
    return redirect(reverse('main:index'))