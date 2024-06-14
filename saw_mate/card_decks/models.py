from django.db import models

from cards.models import Products

from users.models import User

#from card_decks.models import CardDeck, CardSet



#описание общей колоды купленных карточек (аналог корзины)

class CardDeckQueryset(models.QuerySet):
    #вывод количества купленных карточек
    def total_quantity(self):
        if self:
            return sum(carddeck.quantity for carddeck in self)
        return 0

class CardDeck(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, blank=True, null=True, verbose_name='Пользователь')
    product = models.ForeignKey(to=Products, on_delete=models.CASCADE, verbose_name='Товар')
    quantity = models.PositiveSmallIntegerField(default=0, verbose_name='Количество')
    #если пользователь не авторизован то данные из корзины будут вноситься по ключу сессии
    session_key = models.CharField(max_length=32, null=True, blank=True)
    created_timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')
    #set_of_cards = models.ForeignKey(to='CardSet', on_delete=models.CASCADE, null=True, verbose_name='Набор карт')


    class Meta:
        db_table = 'carddeck'
        verbose_name = 'Колода карт'
        verbose_name_plural = 'Колоды карт'

    #переопределим менеджер objects
    objects = CardDeckQueryset().as_manager()

    def __str__(self):
        if self.user:
            return f'Колода {self.user.username} | Товар {self.product.name} | Количество {self.quantity}'

        return f'Анонимная колода | Товар {self.product.name} | Количество {self.quantity}'

# второй вариант набора карт (аналог заказа)
class SetItemQueryset(models.QuerySet):

    def total_quantity(self):
        if self:
            return sum(set_item.quantity for set_item in self)
        return 0
# модель для описания набора карточек
class Set(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.SET_DEFAULT, blank=True, null=True, verbose_name="Пользователь", default=None)
    created_timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания колоды")
    active = models.BooleanField(default=False, verbose_name='Активная колоды')

    class Meta:
        db_table = 'set'
        verbose_name = 'Набор карт версия 2'
        verbose_name_plural = 'Наборы карт версия 2'
    
    def __str__(self):
        return f"Набор карточек (версия 2) № {self.pk}"
# модель для карточек в наборе
class SetItem(models.Model):
    set = models.ForeignKey(to=Set, on_delete=models.CASCADE, verbose_name='Заказ')
    product = models.ForeignKey(to=Products, on_delete=models.SET_DEFAULT, null=True, verbose_name='Карточка в наборе (версия 2)', default=None)
    quantity = models.PositiveIntegerField(default=0, verbose_name='Количество')
    class Meta:
        db_table = 'set_item'
        verbose_name = 'Карточка в наборе (версия 2)'
        verbose_name_plural = 'Карточки в наборе (версия 2)'

    objects = SetItemQueryset.as_manager()

    def __str__(self):
        return f"Карточка {self.product} | Набор № {self.set.pk}"