from rest_framework import serializers
from .models import Vendor
from apps.users.serializers import UserSerializer


class VendorSerializer(serializers.ModelSerializer):
    """Serializer para mostrar información del vendedor."""

    user = UserSerializer(read_only=True)
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = [
            'id', 'user', 'business_name', 'description', 'logo',
            'address', 'city', 'phone', 'is_verified', 'is_active',
            'products_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at']

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()


class VendorCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar vendedor."""

    class Meta:
        model = Vendor
        fields = [
            'business_name', 'description', 'logo',
            'address', 'city', 'phone'
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        # Verificar si el usuario ya tiene un perfil de vendedor
        if hasattr(user, 'vendor_profile'):
            raise serializers.ValidationError({
                'user': 'Este usuario ya tiene un perfil de vendedor.'
            })
        vendor = Vendor.objects.create(user=user, **validated_data)
        return vendor
