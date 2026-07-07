from django.contrib import admin
from django.urls import path
from backend.productos import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Nombres que tus plantillas HTML buscan:
    path('', views.render_dashboard, name='dashboard'),      # Usado por {% url 'dashboard' %}
    path('inicio/', views.render_dashboard, name='inicio'),  # Usado por {% url 'inicio' %}
    path('tienda/', views.render_tienda, name='tienda'),     # Usado por {% url 'tienda' %}
    path('dashboard/', views.render_dashboard, name='dashboard_url'),
    
    # Si aún no tienes la vista de perfil, la crearemos abajo
    path('perfil/', views.render_dashboard, name='perfil'),  # Placeholder para evitar el error
    
    # API endpoints
    path('api/login/', views.login_cliente, name='login_cliente'),
    path('api/registro/', views.registro_cliente, name='registro_cliente'),
    path('api/productos/', views.listar_productos, name='listar_productos'),
    path('api/procesar-pago/', views.procesar_pago, name='procesar_pago'),
    path('api/historial/', views.historial_pedidos, name='historial_pedidos'),
    path('api/cambiar-password/', views.cambiar_password, name='cambiar_password'),
]