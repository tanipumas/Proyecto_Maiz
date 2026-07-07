from django.contrib import admin
from django.urls import path
from backend.productos import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rutas corregidas para que coincidan con tu HTML
    path('', views.render_dashboard, name='dashboard'), # 'dashboard' coincide con {% url 'dashboard' %}
    path('inicio/', views.render_dashboard, name='inicio'), # 'inicio' agregado para tu navbar
    path('tienda/', views.render_tienda, name='tienda'), # 'tienda' coincide con {% url 'tienda' %}
    
    # Si vas a usar un perfil, debes tener esta vista o crearla
    # path('perfil/', views.render_perfil, name='perfil'), 
    
    # API endpoints
    path('api/login/', views.login_cliente, name='login_cliente'),
    path('api/registro/', views.registro_cliente, name='registro_cliente'),
    path('api/productos/', views.listar_productos, name='listar_productos'),
    path('api/procesar-pago/', views.procesar_pago, name='procesar_pago'),
    path('api/historial/', views.historial_pedidos, name='historial_pedidos'),
    path('api/cambiar-password/', views.cambiar_password, name='cambiar_password'),
]