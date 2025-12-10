from django.db import models
from django.conf import settings


class Vendor(models.Model):
    """
    Modelo de vendedor - representa un negocio/tienda en el marketplace.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='vendor_profile',
        verbose_name='Usuario'
    )
    business_name = models.CharField('Nombre del negocio', max_length=200)
    description = models.TextField('Descripción', blank=True)
    logo = models.URLField('Logo URL', blank=True)
    address = models.CharField('Dirección', max_length=300, blank=True)
    city = models.CharField('Ciudad', max_length=100, blank=True)
    phone = models.CharField('Teléfono del negocio', max_length=15, blank=True)
    is_verified = models.BooleanField('Verificado', default=False)
    is_active = models.BooleanField('Activo', default=True)
    created_at = models.DateTimeField('Fecha de creación', auto_now_add=True)
    updated_at = models.DateTimeField('Fecha de actualización', auto_now=True)

    class Meta:
        verbose_name = 'Vendedor'
        verbose_name_plural = 'Vendedores'
        ordering = ['-created_at']

    def __str__(self):
        return self.business_name
