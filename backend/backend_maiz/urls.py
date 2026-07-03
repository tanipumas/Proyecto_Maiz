from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from backend.productos import views # <--- LA RUTA CORREGIDA

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('productos/', include('backend.productos.urls')),
    path('', views.render_dashboard, name='dashboard'),
    path('api/', include('backend.productos.urls')), 
    path('api/registro/', views.registro_cliente, name='registro_cliente'),
    path('api/login/', views.login_cliente, name='login_cliente'),
    path('api/pago/', views.procesar_pago, name='procesar_pago'),
    path('api/historial/', views.historial_pedidos, name='historial_pedidos'),
    path('api/cambiar-password/', views.cambiar_password, name='cambiar_password'),
    path('tienda/', views.render_tienda, name='tienda'),
    path('perfil/', views.render_perfil, name='perfil'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)