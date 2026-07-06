from django.contrib import admin
from django.urls import path
from backend.productos import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.render_dashboard, name='dashboard'),
    path('tienda/', views.render_tienda, name='tienda'),
    path('api/login/', views.login_cliente, name='login_cliente'),
    path('api/registro/', views.registro_cliente, name='registro_cliente'),
    path('api/productos/', views.listar_productos, name='listar_productos'),
    path('api/procesar-pago/', views.procesar_pago, name='procesar_pago'),
    path('api/historial/', views.historial_pedidos, name='historial_pedidos'),
    path('api/obtener_historial/', views.obtener_historial, name='obtener_historial'),
    path('api/cambiar-password/', views.cambiar_password, name='cambiar_password'),
]