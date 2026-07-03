from django.contrib import admin
from django.urls import path, include
from productos import views 

# 🖼️ IMPORTACIONES REQUERIDAS PARA LAS IMÁGENES
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # 1. Panel de administración
    path('admin/', admin.site.urls),
    
    # 2. La página principal (Dashboard) - Llamamos a la vista que crearemos
    path('', views.render_dashboard, name='dashboard'),
    
    # 3. API - Todas tus funciones de lógica quedan aquí
    # Incluimos las rutas que ya tenías en productos.urls
    path('api/', include('productos.urls')), 
    
    # 4. RUTAS MANUALES DE AUTENTICACIÓN Y PAGO
    # (Ya están dentro de 'api/' en productos.urls, pero si necesitas estas rutas directas, déjalas así)
    path('api/registro/', views.registro_cliente, name='registro_cliente'),
    path('api/login/', views.login_cliente, name='login_cliente'),
    path('api/pago/', views.procesar_pago, name='procesar_pago'),
    path('api/historial/', views.historial_pedidos, name='historial_pedidos'),
    path('api/cambiar-password/', views.cambiar_password, name='cambiar_password'),
    path('tienda/', views.render_tienda, name='tienda'),
    path('perfil/', views.render_perfil, name='perfil'),
]

# Servir archivos multimedia en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)