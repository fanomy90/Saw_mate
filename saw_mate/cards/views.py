from django.shortcuts import get_list_or_404, render 

from cards.models import Categories, Products
from django.core.paginator import Paginator
from cards.utils import q_search

def catalog(request, category_slug=None):
    #берем параметры страницы из запроса пользователя, значение по умолчанию 1 страница
    page = request.GET.get('page', 1)
    #параметры фильтров из get запроса который прописан в шаблоне
    on_sale = request.GET.get('on_sale', None)
    order_by = request.GET.get('order_by', None)
    #сохранение в переменную параметров поиска
    query = request.GET.get('q', None)
    #делаем вывод товаров по категориям
    if category_slug == 'all':
    #ojects это метод для работы с записями в БД
        cards = Products.objects.all()
    #вызов обработки поиска из файла utils.py с передачей параметров поиска
    elif query:
        cards = q_search(query)
    else:
        #Использование фильтра при выводе товара по категориям
        cards = get_list_or_404(Products.objects.filter(category__slug=category_slug))
    #выполняем проверку параметров переданных через фильтр в шаблоне и присваиваем полученные значения в фильтр и спортировку
    if on_sale:
        cards = cards.filter(discount__gt=0)
    if order_by and order_by !="default":
        cards = cards.order_by(order_by)
    #благодаря ленивым запросам все пройденные проверки которые формируют queryset сформируют единый SQL запрос к БД и получат соответстующие данные

    #пагинатор
    paginator = Paginator(cards, 9)
    current_page = paginator.page(int(page))

    context: dict[str, str] = {
        "title": "Home - Каталог ",
        "cards": current_page,
        "slug_url": category_slug,
        #'categories': categories,
    }
    return render(request, "cards/catalog.html", context)

def product(request, product_slug):
    product = Products.objects.get(slug=product_slug)
    context = {
        'product': product
    }
    return render(request, "cards/product.html", context=context)