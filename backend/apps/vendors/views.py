from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Vendor
from .serializers import VendorSerializer, VendorCreateSerializer
from .permissions import IsVendorOwner


class VendorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar vendedores.

    list: Listar todos los vendedores activos.
    retrieve: Ver detalle de un vendedor.
    create: Crear perfil de vendedor (usuario autenticado).
    update/partial_update: Actualizar perfil (solo dueño).
    destroy: Desactivar perfil (solo dueño).
    """

    queryset = Vendor.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsVendorOwner]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return VendorCreateSerializer
        return VendorSerializer

    @extend_schema(
        summary="Listar vendedores",
        description="Obtener lista de todos los vendedores activos.",
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Detalle de vendedor",
        description="Obtener información detallada de un vendedor.",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Crear perfil de vendedor",
        description="Crear un perfil de vendedor para el usuario autenticado.",
        request=VendorCreateSerializer,
        responses={201: VendorSerializer}
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vendor = serializer.save()

        return Response(
            VendorSerializer(vendor).data,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Actualizar vendedor",
        description="Actualizar perfil de vendedor (solo el dueño).",
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Actualizar vendedor parcialmente",
        description="Actualizar parcialmente perfil de vendedor (solo el dueño).",
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Desactivar vendedor en lugar de eliminar."""
        vendor = self.get_object()
        vendor.is_active = False
        vendor.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        summary="Mi perfil de vendedor",
        description="Obtener el perfil de vendedor del usuario autenticado.",
        responses={200: VendorSerializer}
    )
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Obtener el perfil de vendedor del usuario autenticado."""
        if not hasattr(request.user, 'vendor_profile'):
            return Response(
                {'detail': 'No tienes un perfil de vendedor.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = VendorSerializer(request.user.vendor_profile)
        return Response(serializer.data)
