from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, CategoriaViewSet, registro_cliente, 
    login_cliente, procesar_pago, render_dashboard, render_tienda, render_perfil
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    # API
    path('api/', include(router.urls)),
    path('api/registro/', registro_cliente, name='registro_cliente'),
    path('api/login/', login_cliente, name='login_cliente'),
    path('api/pago/', procesar_pago, name='procesar_pago'),

    # Rutas para páginas HTML (sin el .html para evitar errores)
    path('dashboard/', render_dashboard, name='dashboard'),
    path('tienda/', render_tienda, name='tienda'),
    path('perfil/', render_perfil, name='perfil'),
    path('', render_tienda, name='inicio'), # Raíz
]