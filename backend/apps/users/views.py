from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import UserSerializer, UserRegistrationSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para incluir datos del usuario en el token."""

    def validate(self, attrs):
        data = super().validate(attrs)

        # Agregar información del usuario
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_vendor': hasattr(self.user, 'vendor_profile'),
        }

        if hasattr(self.user, 'vendor_profile'):
            data['user']['vendor_id'] = self.user.vendor_profile.id
            data['user']['business_name'] = self.user.vendor_profile.business_name

        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista de login que retorna tokens JWT con información del usuario."""

    serializer_class = CustomTokenObtainPairSerializer

    @extend_schema(
        summary="Iniciar sesión",
        description="Obtener tokens de acceso y refresh usando email y contraseña.",
        responses={
            200: OpenApiResponse(description="Login exitoso"),
            401: OpenApiResponse(description="Credenciales inválidas"),
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class RegisterView(generics.CreateAPIView):
    """Vista para registro de nuevos usuarios."""

    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    @extend_schema(
        summary="Registrar usuario",
        description="Crear una nueva cuenta de usuario.",
        responses={
            201: UserSerializer,
            400: OpenApiResponse(description="Datos inválidos"),
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            'message': 'Usuario registrado exitosamente.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class UserProfileView(APIView):
    """Vista para ver y actualizar el perfil del usuario autenticado."""

    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Obtener perfil",
        description="Obtener información del usuario autenticado.",
        responses={200: UserSerializer}
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data

        # Agregar información del vendor si existe
        if hasattr(request.user, 'vendor_profile'):
            data['is_vendor'] = True
            data['vendor_id'] = request.user.vendor_profile.id
            data['business_name'] = request.user.vendor_profile.business_name
        else:
            data['is_vendor'] = False

        return Response(data)

    @extend_schema(
        summary="Actualizar perfil",
        description="Actualizar información del usuario autenticado.",
        request=UserSerializer,
        responses={200: UserSerializer}
    )
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
