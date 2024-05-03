from django.shortcuts import render, redirect

from orders.forms import CreateOrderForm
from django.db import transaction
from carts.models import Cart
from django.forms import ValidationError
from orders.models import Order, OrderItem
from django.contrib import messages
from django.contrib.auth.decorators import login_required

#декаратор который позволяет создать заказ только вошедшим на сайт пользователям, неавторизованного пользователя перебросит на страницу авторизации
@login_required
def create_order(request):
    if request.method == 'POST':
        form = CreateOrderForm(data=request.POST)
        if form.is_valid():
            try:
                with transaction.atomic():
                    user = request.user
                    cart_items = Cart.objects.filter(user=user)

                    if cart_items.exists():
                        #создаем заказ
                        order = Order.objects.create(
                            user=user,
                            phone_number=form.cleaned_data['phone_number'],
                            requires_delivery=form.cleaned_data['requires_delivery'],
                            delivery_address=form.cleaned_data['delivery_address'],
                            payment_on_get=form.cleaned_data['payment_on_get'],
                        )
                        #создаем заказанные товары
                        for cart_item in cart_items:
                            product = cart_item.product
                            name = cart_item.product.name
                            price = cart_item.product.sell_price()
                            quantity = cart_item.quantity
                            #лишняя проверка т.к. товаро бесконечный
                            if product.quantity < quantity:
                                raise ValidatorError(f"Недостаточное количество товара {name} на складе\В наличии - {product.quanity}")

                            OrderItem.objects.create(
                                order=order,
                                product=product,
                                name=name,
                                price=price,
                                quantity=quantity,
                            )
                            product.quantity -= quantity
                            product.save()

                        #очистить карзину пользователя после создания заказа
                        cart_items.delete()
                        messages.success(request, 'Заказ оформлен!')
                        return redirect('user:profile')
            except ValidationError as e:
                messages.success(request, str(e))
                return redirect('cart:order')
    else:
        initial = {
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            }
        form = CreateOrderForm(initial=initial)
    context = {
        'title': 'Home - Оформление заказа',
        'form': form,
        'order': True,
    }
    return render(request, 'orders/create_order.html', context=context)
