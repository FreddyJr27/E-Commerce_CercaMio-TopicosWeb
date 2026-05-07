from django.contrib.auth import authenticate
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Categoria, Dimensiones, HistorialVenta, Producto, Resena, Usuario
from .serializers import (
    CategoriaSerializer,
    DimensionesSerializer,
    HistorialVentaSerializer,
    ProductoSerializer,
    ResenaSerializer,
    UsuarioSerializer,
)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductoSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CategoriaSerializer


class ResenaViewSet(viewsets.ModelViewSet):
    queryset = Resena.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ResenaSerializer


class DimensionesViewSet(viewsets.ModelViewSet):
    queryset = Dimensiones.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DimensionesSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UsuarioSerializer

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=email, password=password)
        if user:
            return Response({'message': 'Usuario autenticado exitosamente'}, status=status.HTTP_200_OK)
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class HistorialVentaViewSet(viewsets.ModelViewSet):
    queryset = HistorialVenta.objects.select_related('usuario').all().order_by('-creado_en')
    permission_classes = [permissions.AllowAny]
    serializer_class = HistorialVentaSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        usuario_id = self.request.query_params.get('usuario')
        estado = self.request.query_params.get('estado')

        if usuario_id:
            queryset = queryset.filter(usuario_id=usuario_id)
        if estado:
            queryset = queryset.filter(estado=estado)

        return queryset


class ProductoResenasAPIView(APIView):
    """Vista para obtener las reseñas asociadas a un producto."""

    def get(self, request, producto_id):
        try:
            producto = Producto.objects.get(id=producto_id)
            resenas = producto.resenas.all()
            serializer = ResenaSerializer(resenas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, producto_id):
        try:
            producto = Producto.objects.get(id=producto_id)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        data['producto'] = producto.id

        serializer = ResenaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)