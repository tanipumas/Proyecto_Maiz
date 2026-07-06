import random
from django.db import transaction
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import Producto, Categoria, Pedido, DetallePedido
from .serializers import ProductoSerializer, CategoriaSerializer

# ==========================================
# 🌽 API REST (Viewsets)
# ==========================================

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]

# ==========================================
# 🔐 AUTENTICACIÓN
# ==========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def registro_cliente(request):
    username = request.data.get('username')
    email = request.data.get('correo')
    password = request.data.get('password')

    if not all([username, email, password]):
        return Response({"error": "Todos los campos son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "El usuario ya existe."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"mensaje": "Usuario creado", "token": token.key}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_cliente(request):
    user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "mensaje": "Ingreso correcto"}, status=status.HTTP_200_OK)
    return Response({"error": "Credenciales inválidas."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    user = request.user
    if not user.check_password(old_password):
        return Response({"error": "Contraseña actual incorrecta."}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new_password)
    user.save()
    return Response({"mensaje": "Contraseña actualizada."}, status=status.HTTP_200_OK)

# ==========================================
# 💳 PROCESAR COMPRA E HISTORIAL
# ==========================================

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def procesar_pago(request):
    items = request.data.get('items', [])
    if not items:
        return Response({"error": "Carrito vacío."}, status=status.HTTP_400_BAD_REQUEST)

    total_pedido = 0
    detalles_a_crear = []

    try:
        with transaction.atomic():
            nuevo_pedido = Pedido.objects.create(cliente=request.user, total=0)
            for item in items:
                prod = Producto.objects.get(id=item.get('producto_id'))
                cant = float(item.get('cantidad_kilos', 0))
                
                if prod.stock_disponible_kilos < cant:
                    raise Exception(f"Stock insuficiente para {prod.nombre}")

                prod.stock_disponible_kilos -= cant
                prod.save()
                
                total_pedido += float(prod.precio_por_kilo) * cant
                detalles_a_crear.append(DetallePedido(
                    pedido=nuevo_pedido, producto=prod, 
                    nombre_producto_respaldo=prod.nombre, 
                    cantidad_kilos=cant, precio_por_kilo=prod.precio_por_kilo
                ))

            DetallePedido.objects.bulk_create(detalles_a_crear)
            nuevo_pedido.total = total_pedido
            nuevo_pedido.save()

        return Response({"pedido_id": nuevo_pedido.id, "total": total_pedido}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historial_pedidos(request):
    pedidos = Pedido.objects.filter(cliente=request.user).order_by('-fecha_creacion')
    lista_resultado = []
    for p in pedidos:
        lista_resultado.append({
            "id": p.id,
            "fecha": p.fecha_creacion.strftime('%d/%m/%Y %H:%M'),
            "total": float(p.total),
            "estatus": p.get_estatus_display()
        })
    return Response(lista_resultado, status=status.HTTP_200_OK)

# ==========================================
# 🌐 RENDERIZADO DE PÁGINAS (HTML)
# ==========================================

def render_dashboard(request): return render(request, 'dashboard.html')
def render_tienda(request): return render(request, 'tienda.html')
def render_perfil(request): return render(request, 'perfil.html')
def render_carrito(request): return render(request, 'carrito.html')