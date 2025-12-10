from django.db import models
from apps.vendors.models import Vendor


class Product(models.Model):
    """
    Modelo de producto - representa un producto en el marketplace.
    """
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='Vendedor'
    )
    name = models.CharField('Nombre', max_length=200)
    description = models.TextField('Descripción')
    price = models.DecimalField('Precio', max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField('Stock', default=0)
    image = models.URLField('Imagen URL', blank=True)
    category = models.CharField('Categoría', max_length=100, blank=True)
    is_active = models.BooleanField('Activo', default=True)
    created_at = models.DateTimeField('Fecha de creación', auto_now_add=True)
    updated_at = models.DateTimeField('Fecha de actualización', auto_now=True)

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.vendor.business_name}"
