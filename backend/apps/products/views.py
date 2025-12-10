from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from .models import Product
from .serializers import ProductSerializer, ProductCreateSerializer, ProductListSerializer
from .permissions import IsProductVendorOwner
from apps.vendors.models import Vendor


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar productos.

    list: Listar todos los productos activos.
    retrieve: Ver detalle de un producto.
    create: Crear producto (solo vendedores).
    update/partial_update: Actualizar producto (solo vendedor dueño).
    destroy: Desactivar producto (solo vendedor dueño).
    """

    queryset = Product.objects.filter(is_active=True).select_related('vendor', 'vendor__user')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsProductVendorOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'vendor']
    search_fields = ['name', 'description', 'category']
    ordering_fields = ['price', 'created_at', 'name', 'stock']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer

    @extend_schema(
        summary="Listar productos",
        description="Obtener lista de todos los productos activos. Soporta filtros, búsqueda y ordenamiento.",
        parameters=[
            OpenApiParameter(name='category', description='Filtrar por categoría', type=str),
            OpenApiParameter(name='vendor', description='Filtrar por ID de vendedor', type=int),
            OpenApiParameter(name='search', description='Buscar por nombre, descripción o categoría', type=str),
            OpenApiParameter(name='ordering', description='Ordenar por: price, created_at, name, stock', type=str),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        summary="Detalle de producto",
        description="Obtener información detallada de un producto.",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Crear producto",
        description="Crear un nuevo producto. Solo disponible para vendedores.",
        request=ProductCreateSerializer,
        responses={201: ProductSerializer}
    )
    def create(self, request, *args, **kwargs):
        # Verificar que el usuario es vendedor
        if not hasattr(request.user, 'vendor_profile'):
            return Response(
                {'detail': 'Debes tener un perfil de vendedor para crear productos.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        return Response(
            ProductSerializer(product).data,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Actualizar producto",
        description="Actualizar un producto. Solo disponible para el vendedor dueño.",
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Actualizar producto parcialmente",
        description="Actualizar parcialmente un producto. Solo disponible para el vendedor dueño.",
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Eliminar producto",
        description="Desactivar un producto (soft delete). Solo disponible para el vendedor dueño.",
    )
    def destroy(self, request, *args, **kwargs):
        """Desactivar producto en lugar de eliminar."""
        product = self.get_object()
        product.is_active = False
        product.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        summary="Mis productos",
        description="Obtener los productos del vendedor autenticado.",
        responses={200: ProductListSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_products(self, request):
        """Obtener productos del vendedor autenticado."""
        if not hasattr(request.user, 'vendor_profile'):
            return Response(
                {'detail': 'No tienes un perfil de vendedor.'},
                status=status.HTTP_404_NOT_FOUND
            )

        products = Product.objects.filter(
            vendor=request.user.vendor_profile,
            is_active=True
        )
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Productos por vendedor",
        description="Obtener todos los productos de un vendedor específico.",
        responses={200: ProductListSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='by-vendor/(?P<vendor_id>[^/.]+)')
    def by_vendor(self, request, vendor_id=None):
        """Obtener productos de un vendedor específico."""
        try:
            vendor = Vendor.objects.get(pk=vendor_id, is_active=True)
        except Vendor.DoesNotExist:
            return Response(
                {'detail': 'Vendedor no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )

        products = Product.objects.filter(vendor=vendor, is_active=True)
        page = self.paginate_queryset(products)

        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
