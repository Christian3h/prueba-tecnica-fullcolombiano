from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin para el modelo Product."""

    list_display = ['name', 'vendor', 'price', 'stock', 'category', 'is_active', 'created_at']
    list_filter = ['is_active', 'category', 'vendor', 'created_at']
    search_fields = ['name', 'description', 'vendor__business_name', 'category']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['price', 'stock', 'is_active']

    fieldsets = (
        ('Información del producto', {
            'fields': ('vendor', 'name', 'description', 'category', 'image')
        }),
        ('Precio y stock', {
            'fields': ('price', 'stock')
        }),
        ('Estado', {
            'fields': ('is_active',)
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
