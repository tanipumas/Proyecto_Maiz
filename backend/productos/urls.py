from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, CategoriaViewSet, registro_cliente, 
    login_cliente, procesar_pago, render_dashboard, 
    render_tienda, render_perfil, render_carrito
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/registro/', registro_cliente, name='registro_cliente'),
    path('api/login/', login_cliente, name='login_cliente'),
    path('api/pago/', procesar_pago, name='procesar_pago'),

    # Rutas de navegación
    path('', render_tienda, name='inicio'),
    path('dashboard/', render_dashboard, name='dashboard'),
    path('tienda/', render_tienda, name='tienda'),
    path('perfil/', render_perfil, name='perfil'),
    path('carrito/', render_carrito, name='carrito'),
]