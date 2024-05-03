from django.contrib import admin
from card_decks.models import CardDeck, Set, SetItem

# @admin.register(CardSet)
# class CardSetAdmin(admin.ModelAdmin):
#     list_display: ['name', 'cards', 'quantity',]
#     list_editable: ['name', 'cards']
#     search_fields: ['name', 'cards']
#     list_filter: ['name', 'cards']

#     def product_display(self, obj):
#         return str(obj.product.name)

class CardDeckTabAdmin(admin.TabularInline):
    model = CardDeck
    fields = 'product', 'quantity', 'created_timestamp',
    search_fields = 'product', 'quantity', 'created_timestamp',
    readonly_fields = ('created_timestamp',)
    extra = 1

@admin.register(CardDeck)
class CardDeckAdmin(admin.ModelAdmin):
    list_display = ['user_display', 'product_display', 'quantity', 'created_timestamp',]
    list_filter = ['created_timestamp', 'user', 'product__name',]
    #переопределяем поля для отображения в list_display
    def user_display(self, obj):
        if obj.user:
            return str(obj.user)
        return "Анонимный пользователь"

    def product_display(self, obj):
        return str(obj.product.name)
    
#отображение второго варианта набора карт
class SetItemTabulareAdmin(admin.TabularInline):
    model = SetItem
    fields = "product", "quantity"
    search_fields = (
        "product",
    )
    extra = 0
@admin.register(SetItem)
class SetItemAdmin(admin.ModelAdmin):
    list_display = "set", "product", "quantity"
    search_fields = (
        "set",
        "product",
    )
class SetTabulareAdmin(admin.TabularInline):
    model = Set
    fields = (
        "active",
        "created_timestamp",
    )
    search_fields = (
        "created_timestamp",
    )
    readonly_fields = ("created_timestamp",)
    extra = 0
@admin.register(Set)
class SetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "active",
        "created_timestamp",
    )
    search_fields = ("id",)
    readonly_fields = ("created_timestamp",)
    list_filter = (
        "active",
    )
    inlines = (SetItemTabulareAdmin,)