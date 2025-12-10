"""
Script para crear datos de prueba
"""
from django.contrib.auth import get_user_model
from apps.vendors.models import Vendor
from apps.products.models import Product

User = get_user_model()

# Crear usuarios de prueba
users_data = [
    {
        'email': 'maria@fullcolombiano.com',
        'username': 'maria',
        'password': 'Colombia2024!',
        'first_name': 'María',
        'last_name': 'Rodríguez',
    },
    {
        'email': 'carlos@fullcolombiano.com',
        'username': 'carlos',
        'password': 'Colombia2024!',
        'first_name': 'Carlos',
        'last_name': 'Sánchez',
    },
]

vendors_data = [
    {
        'business_name': 'Café del Eje',
        'description': 'Café premium del Eje Cafetero, cultivado artesanalmente en las montañas de Quindío',
        'city': 'Armenia',
        'phone': '+57 300 123 4567',
    },
    {
        'business_name': 'Artesanías Wayuu',
        'description': 'Mochilas y artesanías auténticas hechas a mano por comunidades indígenas Wayuu',
        'city': 'Riohacha',
        'phone': '+57 311 234 5678',
    },
]

products_data = [
    # Productos de María (Café del Eje)
    [
        {
            'name': 'Café Especial Colombia 500g',
            'description': 'Café 100% arábica cultivado a 1800 metros de altura. Notas de chocolate, caramelo y frutas rojas. Tostado medio.',
            'price': 45000,
            'stock': 50,
            'category': 'Alimentos',
            'image': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500',
        },
        {
            'name': 'Café Orgánico Premium 250g',
            'description': 'Café orgánico certificado, proceso de fermentación controlada. Perfil dulce y balanceado.',
            'price': 35000,
            'stock': 30,
            'category': 'Alimentos',
            'image': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
        },
        {
            'name': 'Café Descafeinado 250g',
            'description': 'Café descafeinado por método suizo. Mantiene todo el sabor sin la cafeína.',
            'price': 38000,
            'stock': 25,
            'category': 'Alimentos',
            'image': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
        },
    ],
    # Productos de Carlos (Artesanías Wayuu)
    [
        {
            'name': 'Mochila Wayuu Grande',
            'description': 'Mochila tejida a mano con diseños tradicionales. 100% algodón. Tiempo de elaboración: 20 días.',
            'price': 180000,
            'stock': 10,
            'category': 'Artesanías',
            'image': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
        },
        {
            'name': 'Mochila Wayuu Mediana',
            'description': 'Mochila versátil con colores vibrantes. Perfecta para el día a día. Hecha por artesanas Wayuu.',
            'price': 120000,
            'stock': 15,
            'category': 'Artesanías',
            'image': 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500',
        },
        {
            'name': 'Pulsera Wayuu - Set de 3',
            'description': 'Set de 3 pulseras tejidas a mano con hilos de colores. Diseño tradicional Wayuu.',
            'price': 35000,
            'stock': 40,
            'category': 'Artesanías',
            'image': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
        },
    ],
]

print("🇨🇴 Creando datos de prueba para Full Colombiano...")

# Crear usuarios y vendedores
vendors = []
for i, user_data in enumerate(users_data):
    email = user_data['email']

    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        print(f"✓ Usuario {email} ya existe")
    else:
        user = User.objects.create_user(**user_data)
        print(f"✓ Usuario creado: {email}")

    # Crear perfil de vendedor
    if hasattr(user, 'vendor_profile'):
        vendor = user.vendor_profile
        print(f"✓ Vendedor {vendor.business_name} ya existe")
    else:
        vendor = Vendor.objects.create(
            user=user,
            **vendors_data[i]
        )
        print(f"✓ Vendedor creado: {vendor.business_name}")

    vendors.append(vendor)

# Crear productos
for i, vendor in enumerate(vendors):
    for product_data in products_data[i]:
        name = product_data['name']

        if Product.objects.filter(name=name, vendor=vendor).exists():
            print(f"  - Producto {name} ya existe")
        else:
            Product.objects.create(
                vendor=vendor,
                **product_data
            )
            print(f"  ✓ Producto creado: {name}")

print("\n✅ ¡Datos de prueba creados exitosamente!")
print("\n📝 Credenciales de prueba:")
print("=" * 60)
print("Usuario 1:")
print(f"  Email: maria@fullcolombiano.com")
print(f"  Password: Colombia2024!")
print(f"  Negocio: Café del Eje")
print()
print("Usuario 2:")
print(f"  Email: carlos@fullcolombiano.com")
print(f"  Password: Colombia2024!")
print(f"  Negocio: Artesanías Wayuu")
print()
print("Admin:")
print(f"  Email: admin@fullcolombiano.com")
print(f"  Password: admin123")
print("=" * 60)
