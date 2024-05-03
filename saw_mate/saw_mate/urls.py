from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from saw_mate import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("main.urls", namespace="main")),
    path("catalog/", include("cards.urls", namespace="catalog")),
    path("user/", include("users.urls", namespace="user")),
    path("cart/", include("carts.urls", namespace="cart")),
    path("orders/", include("orders.urls", namespace="orders")),
    path("carddeck/", include("card_decks.urls", namespace="carddeck")),
    path("game/", include("games.urls", namespace="game")),
]

#для отладки запросов к БД
if settings.DEBUG:
    urlpatterns += [
        path("__debug__/", include("debug_toolbar.urls")),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)