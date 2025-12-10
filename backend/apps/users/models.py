from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modelo de usuario extendido para Full Colombiano.
    Usa email como campo principal de autenticación.
    """
    email = models.EmailField('Correo electrónico', unique=True)
    phone = models.CharField('Teléfono', max_length=15, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-date_joined']

    def __str__(self):
        return self.email
