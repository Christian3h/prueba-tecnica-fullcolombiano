from rest_framework import permissions


class IsProductVendorOwner(permissions.BasePermission):
    """
    Permiso que solo permite al vendedor dueño del producto editar/eliminar.
    """

    def has_object_permission(self, request, view, obj):
        # Lectura permitida para todos
        if request.method in permissions.SAFE_METHODS:
            return True

        # Escritura solo para el vendedor dueño del producto
        if not request.user.is_authenticated:
            return False

        if not hasattr(request.user, 'vendor_profile'):
            return False

        return obj.vendor == request.user.vendor_profile
