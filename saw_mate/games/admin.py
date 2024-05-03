from django.contrib import admin
from .models import Shape
# from games.models import Game
# from carts.admin import CartTabAdmin
# from orders.admin import OrderTabulareAdmin 
# # Register your models here.
# @admin.register(Game)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ['username', 'first_name', 'last_name', 'email',]
#     search_fields = ['username', 'email',]
#добавили корзину пользователя для отображения в профиле пользователя
    # inlines = [CartTabAdmin, OrderTabulareAdmin]

admin.site.register(Shape)