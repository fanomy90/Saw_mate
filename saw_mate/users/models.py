from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    image = models.ImageField(upload_to='users_image', blank=True, null=True, verbose_name='Аватар')
    phone_number = models.CharField(max_length=10, blank=True, null=True, verbose_name='Номер телефона')
    achievements = models.CharField(max_length=200, unique=False, blank=True, verbose_name='Достижения')
    statistic = models.CharField(max_length=400, unique=False, null=True, verbose_name='Статистика')
    level = models.SmallIntegerField(default=1, verbose_name='Уровень')
    win = models.SmallIntegerField(default=0, verbose_name='Побед')
    lose = models.SmallIntegerField(default=0, verbose_name='Поражений')
    status = models.BooleanField(default=False, verbose_name='Статус')
    money = models.DecimalField(default=0.00, max_digits=9, decimal_places=2, verbose_name='Деньги')
    class Meta:
        db_table = 'user'
        verbose_name = 'Пользователя'
        verbose_name_plural = "Пользователи"
    
    def __str__(self):
        return self.username
    