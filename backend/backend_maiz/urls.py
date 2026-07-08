from django.contrib import admin
from django.urls import path
from backend.productos import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rutas necesarias para que tus etiquetas {% url %} funcionen:
    path('', views.render_dashboard, name='dashboard'),
    path('inicio/', views.render_dashboard, name='inicio'),  # Nombre 'inicio'
    path('tienda/', views.render_tienda, name='tienda'),     # Nombre 'tienda'
    
    # Agregamos estas para que no falle el menú:
    path('perfil/', views.render_dashboard, name='perfil'),  # Placeholder de perfil
    path('carrito/', views.render_dashboard, name='carrito'),# Placeholder de carrito
    
    # API endpoints
    path('api/login/', views.login_cliente, name='login_cliente'),
    path('api/registro/', views.registro_cliente, name='registro_cliente'),
    path('api/productos/', views.listar_productos_agrupados, name='listar_productos'),
    path('api/procesar-pago/', views.procesar_pago, name='procesar_pago'),
    path('api/historial/', views.historial_pedidos, name='historial_pedidos'),
    path('api/cambiar-password/', views.cambiar_password, name='cambiar_password'),
]