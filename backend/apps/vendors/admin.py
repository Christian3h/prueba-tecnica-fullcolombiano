from django.contrib import admin
from .models import Vendor


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    """Admin para el modelo Vendor."""

    list_display = ['business_name', 'user', 'city', 'is_verified', 'is_active', 'created_at']
    list_filter = ['is_verified', 'is_active', 'city', 'created_at']
    search_fields = ['business_name', 'user__email', 'user__username', 'city']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Información del negocio', {
            'fields': ('user', 'business_name', 'description', 'logo')
        }),
        ('Ubicación y contacto', {
            'fields': ('address', 'city', 'phone')
        }),
        ('Estado', {
            'fields': ('is_verified', 'is_active')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
