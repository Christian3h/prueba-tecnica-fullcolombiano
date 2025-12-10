from rest_framework import serializers
from .models import Product
from apps.vendors.serializers import VendorSerializer


class ProductSerializer(serializers.ModelSerializer):
    """Serializer para mostrar información del producto."""

    vendor = VendorSerializer(read_only=True)
    vendor_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'vendor', 'vendor_id', 'name', 'description', 'price',
            'stock', 'image', 'category', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'vendor', 'created_at', 'updated_at']


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar productos."""

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'stock',
            'image', 'category', 'is_active'
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        # Obtener el vendor del usuario autenticado
        if not hasattr(user, 'vendor_profile'):
            raise serializers.ValidationError({
                'vendor': 'Debes tener un perfil de vendedor para crear productos.'
            })
        vendor = user.vendor_profile
        product = Product.objects.create(vendor=vendor, **validated_data)
        return product


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listados de productos."""

    vendor_name = serializers.CharField(source='vendor.business_name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock',
            'image', 'category', 'vendor_name', 'created_at'
        ]
