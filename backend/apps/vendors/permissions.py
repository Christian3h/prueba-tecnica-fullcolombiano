from rest_framework import permissions


class IsVendorOwner(permissions.BasePermission):
    """
    Permiso que solo permite al dueño del perfil de vendedor editar.
    """

    def has_object_permission(self, request, view, obj):
        # Lectura permitida para todos
        if request.method in permissions.SAFE_METHODS:
            return True

        # Escritura solo para el dueño
        return obj.user == request.user


class IsVendor(permissions.BasePermission):
    """
    Permiso que verifica si el usuario es un vendedor.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'vendor_profile')
