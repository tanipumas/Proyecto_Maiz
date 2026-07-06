from django.db import transaction
from django.shortcuts import render
from django.contrib.auth import authenticate, update_session_auth_hash
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Producto, Pedido, DetallePedido
from .serializers import ProductoSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def render_dashboard(request):
    return render(request, 'index.html')

@api_view(['POST'])
@permission_classes([AllowAny])
def registro_cliente(request):
    user = User.objects.create_user(username=request.data.get('username'), password=request.data.get('password'))
    return Response({'message': 'Usuario creado'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historial_pedidos(request):
    return Response([])

# Alias para evitar el error de AttributeError
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_historial(request):
    return historial_pedidos(request)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_cliente(request):
    user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'nombre': user.first_name})
    return Response({'error': 'Credenciales incorrectas'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    user = request.user
    user.set_password(request.data.get('new_password'))
    user.save()
    update_session_auth_hash(request, user)
    return Response({'message': 'Éxito'})

@api_view(['GET'])
def listar_productos(request):
    serializer = ProductoSerializer(Producto.objects.all(), many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def procesar_pago(request):
    items = request.data.get('items', [])
    try:
        with transaction.atomic():
            total = sum(float(Producto.objects.get(id=i['producto_id']).precio_por_kilo) * float(i['cantidad_kilos']) for i in items)
            pedido = Pedido.objects.create(cliente=request.user, total=total)
            for i in items:
                prod = Producto.objects.get(id=i['producto_id'])
                DetallePedido.objects.create(pedido=pedido, producto=prod, nombre_producto_respaldo=prod.nombre, cantidad_kilos=i['cantidad_kilos'], precio_por_kilo=prod.precio_por_kilo)
        return Response({'pedido_id': pedido.id})
    except Exception as e:
        return Response({'error': str(e)}, status=400)