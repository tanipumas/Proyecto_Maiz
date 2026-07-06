from django.urls import path
from . import views

urlpatterns = [
    path('api/productos/', views.listar_productos),
    path('api/login/', views.login_cliente),
    path('api/procesar-pago/', views.procesar_pago),
    path('api/historial/', views.obtener_historial), # Debes crear esta vista similar
    path('api/cambiar-password/', views.cambiar_password), # Debes crear esta vista
]