from carts.models import Cart
#получение всех корзин пользователя
def get_user_carts(request):
    if request.user.is_authenticated:
        #с помощью .select_related('product') мы объединили 2 запроса в один - когда получаем корзина, также получаем товары которые на них ссылаются
        return Cart.objects.filter(user=request.user).select_related('product')
    #Если пользователь неавторизован создадим ему сессионый ключ, возможно уберем в будущем
    if not request.session.session_key:
        request.session.create()
    return Cart.objects.filter(session_key=request.session.session_key).select_related('product')