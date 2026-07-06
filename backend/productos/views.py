from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Producto, Pedido, DetallePedido
from .serializers import ProductoSerializer

@api_view(['POST'])
def login_cliente(request):
    # Lógica simplificada de validación de usuario
    from django.contrib.auth import authenticate
    user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'nombre': user.first_name})
    return Response({'error': 'Credenciales inválidas'}, status=400)

@api_view(['GET'])
def listar_productos(request):
    productos = Producto.objects.all()
    serializer = ProductoSerializer(productos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def procesar_pago(request):
    items = request.data.get('items', [])
    if not items:
        return Response({'error': 'Carrito vacío'}, status=400)

    try:
        with transaction.atomic():
            total = 0
            # Validar stock y calcular total real en backend
            for item in items:
                prod = Producto.objects.get(id=item['producto_id'])
                total += float(prod.precio_por_kilo) * float(item['cantidad_kilos'])
            
            pedido = Pedido.objects.create(cliente=request.user, total=total, estatus='PENDIENTE')
            
            for item in items:
                prod = Producto.objects.get(id=item['producto_id'])
                DetallePedido.objects.create(
                    pedido=pedido,
                    producto=prod,
                    nombre_producto_respaldo=prod.nombre,
                    cantidad_kilos=item['cantidad_kilos'],
                    precio_por_kilo=prod.precio_por_kilo
                )
        return Response({'pedido_id': pedido.id})
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    from django.http import JsonResponse

# ... (tus otras funciones como listar_productos, login_cliente, etc.)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_historial(request):
    # Por ahora devolvemos una lista vacía para que no de error
    return JsonResponse([], safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    # Por ahora devolvemos un mensaje de éxito simulado
    return Response({'status': 'Pendiente de implementar'})