from django.contrib import admin
from django.urls import path, include
from productos import views

# 🖼️ IMPORTACIONES REQUERIDAS PARA LAS IMÁGENES
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Panel de administración
    path('admin/', admin.site.urls),
    path('procesar-pago/', views.procesar_pago, name='procesar_pago'),
    path('', include('productos.urls')),
    # 🎯 RUTAS DIRECTAS DE LA API (Fuerzan a Django a reconocerlas sí o sí)
    path('api/productos/', views.ProductoViewSet.as_view({'get': 'list'}), name='productos-lista'),
    path('api/categorias/', views.CategoriaViewSet.as_view({'get': 'list'}), name='categorias-lista'),
    
    # 🔐 RUTAS MANUALES DE AUTENTICACIÓN Y PAGO
    path('api/registro/', views.registro_cliente, name='registro_cliente'),
    path('api/login/', views.login_cliente, name='login_cliente'),
    path('api/pago/', views.procesar_pago, name='procesar_pago'),
    path('api/historial/', views.historial_pedidos, name='historial_pedidos'),
    path('api/cambiar-password/', views.cambiar_password, name='cambiar_password'),
]

# Servir archivos multimedia en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)