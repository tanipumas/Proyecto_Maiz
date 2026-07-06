import random
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator  # 🎯 IMPORTADO CORRECTAMENTE

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
# 🌽 VIEWSETS PARA EL CATÁLOGO (API REST)
# ==========================================

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]


# Unificado en una sola declaración con blindaje CORS nativo
@method_decorator(csrf_exempt, name='dispatch')
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]


# ==========================================
# 🔐 AUTENTICACIÓN DE CLIENTES (LOGIN/REGISTRO)
# ==========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def registro_cliente(request):
    print("Datos recibidos:", request.data)

    username = request.data.get('username')
    email = request.data.get('correo')
    password = request.data.get('password')

    if not username or not password or not email:
        print(f"Error de validación: username={username}, email={email}, password={password}")
        return Response({"error": "Todos los campos (username, email, password) son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)
    
    if not username or not password or not email:
        return Response({"error": "Todos los campos son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "El nombre de usuario ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"mensaje": "Usuario creado con éxito", "token": token.key}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": f"Error al registrar: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_cliente(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Usuario y contraseña requeridos."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "mensaje": "Ingreso correcto"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Credenciales inválidas de usuario o contraseña."}, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# 💳 PROCESAR COMPRA, GUARDAR HISTORIAL Y DESCONTAR BODEGA
# ==========================================

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def procesar_pago(request):
    datos = request.data
    items = datos.get('items', None)
    if items is None and isinstance(datos, list):
        items = datos
        
    if not items or len(items) == 0:
        return Response({"error": "El carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

    metodo_pago = datos.get('metodo_pago', 'EFECTIVO')
    total_pedido = 0
    productos_a_actualizar = []
    detalles_a_crear = []

    try:
        with transaction.atomic():
            nuevo_pedido = Pedido.objects.create(
                cliente=request.user,
                metodo_pago=metodo_pago,
                total=0
            )

            for item in items:
                producto_id = item.get('producto_id')
                cantidad_kilos = float(item.get('cantidad_kilos', 0))

                if not producto_id or cantidad_kilos <= 0:
                    continue

                producto = Producto.objects.get(id=producto_id)
                stock_actual = float(producto.stock_disponible_kilos)
                if stock_actual < cantidad_kilos:
                    return Response(
                        {"error": f"Stock insuficiente para '{producto.nombre}'."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                subtotal = float(producto.precio_por_kilo) * cantidad_kilos
                total_pedido += subtotal
                
                producto.stock_disponible_kilos = stock_actual - cantidad_kilos
                productos_a_actualizar.append(producto)

                detalles_a_crear.append(DetallePedido(
                    pedido=nuevo_pedido,
                    producto=producto,
                    nombre_producto_respaldo=producto.nombre,
                    cantidad_kilos=cantidad_kilos,
                    precio_por_kilo=producto.precio_por_kilo
                ))

            for prod in productos_a_actualizar:
                prod.save()
            DetallePedido.objects.bulk_create(detalles_a_crear)

            nuevo_pedido.total = total_pedido
            nuevo_pedido.save()

        return Response({
            "pedido_id": nuevo_pedido.id,
            "total_pedido": round(total_pedido, 2),
            "status": nuevo_pedido.get_estatus_display()
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Error en bodega: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==========================================
# 📋 OBTENER HISTORIAL DEL USUARIO
# ==========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historial_pedidos(request):
    pedidos = Pedido.objects.filter(cliente=request.user).order_by('-fecha_creacion')
    
    lista_resultado = []
    for p in pedidos:
        items_comprados = []
        for d in p.detalles.all():
            items_comprados.append({
                "producto": d.nombre_producto_respaldo,
                "kilos": d.cantidad_kilos,
                "precio_unitario": float(d.precio_por_kilo)
            })

        lista_resultado.append({
            "id": p.id,
            "fecha": p.fecha_creacion.strftime('%d/%m/%Y %H:%M'),
            "metodo_pago": p.metodo_pago,
            "total": float(p.total),
            "estatus": p.get_estatus_display(),
            "items": items_comprados
        })

    return Response(lista_resultado, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    
    user = request.user
    if not user.check_password(old_password):
        return Response({"error": "La contraseña actual es incorrecta."}, status=status.HTTP_400_BAD_REQUEST)
        
    if not new_password or len(new_password) < 4:
        return Response({"error": "La nueva contraseña no es válida."}, status=status.HTTP_400_BAD_REQUEST)
        
    user.set_password(new_password)
    user.save()
    return Response({"mensaje": "Contraseña actualizada correctamente."}, status=status.HTTP_200_OK)

from django.shortcuts import render

# Esta función servirá tu archivo dashboard.html
def render_dashboard(request):
    return render(request, 'dashboard.html')

def render_tienda(request):
    return render(request, 'tienda.html')

def render_perfil(request):
    return render(request, 'perfil.html')

from django.shortcuts import render

def dashboard_view(request):
    return render(request, 'dashboard.html')