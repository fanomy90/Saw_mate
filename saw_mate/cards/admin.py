from django.contrib import admin

from cards.models import Categories, Products

@admin.register(Categories)
class CategoriesAdmin(admin.ModelAdmin):
    #автоматическое заполнения поля слаг по картежу в который передали поле имя
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['name',]

@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    #автоматическое заполнения поля слаг по картежу в который передали поле имя
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['name', 'quantity', 'price', 'discount',]
    list_editable = ['discount',]
    search_fields = ['name', 'description',]
    list_filter = ['discount', 'quantity', 'category',]
    fields = [
        'name',
        'category',
        'slug',
        'description',
        'image',
        ('health', 'attack', 'defense'),
        ('price', 'discount'),
        'quantity',
    ]