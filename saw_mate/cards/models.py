from email.base64mime import header_length
from django.db import models
from django.urls import reverse

class Categories(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True, verbose_name='URL')

    class Meta:
        db_table = 'category'
        verbose_name = 'категорию'
        verbose_name_plural = "Категории"
    def __str__(self):
        return self.name

class Products(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name='Название')
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True, verbose_name='URL')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    image = models.ImageField(upload_to='cards_image', blank=True, null=True, verbose_name='Изображение')
    price = models.DecimalField(default=0.00, max_digits=7, decimal_places=2, verbose_name='Цена')
    discount = models.DecimalField(default=0.00, max_digits=4, decimal_places=2, verbose_name='Скидка в %')
    quantity = models.PositiveIntegerField(default=0, verbose_name='Количество')
    category = models.ForeignKey(to=Categories, on_delete=models.CASCADE, verbose_name='Категория')
    health = models.DecimalField(default=10.0, max_digits=4, decimal_places=1, verbose_name='Очки жизни')
    attack = models.DecimalField(default=2.0, max_digits=4, decimal_places=1, verbose_name='Сила атаки')
    defense = models.DecimalField(default=0.0, max_digits=4, decimal_places=1, verbose_name='Очки защиты')

    class Meta:
        db_table = 'product'
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'
        #сортировка для работы пагинации
        ordering = ("id",)
    #Кастомный возврат имени категории и количества вместо PK в админке
    def __str__(self):
        return f'{self.name} Количество - {self.quantity}'
    def get_absolute_url(self):
        return reverse("catalog:product", kwargs={"product_slug": self.slug})
    
    #унификация отображение id товара на странице
    def display_id(self):
        return f"{self.id:05}"
    #Обработка скидки
    def sell_price(self):
        if self.discount:
            return round(self.price - self.price*self.discount/100, 2)
        return self.price