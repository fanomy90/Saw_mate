from django.contrib import admin
from users.models import User
from carts.admin import CartTabAdmin
from orders.admin import OrderTabulareAdmin 
# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email',]
    search_fields = ['username', 'email',]
#добавили корзину пользователя для отображения в профиле пользователя
    inlines = [CartTabAdmin, OrderTabulareAdmin]