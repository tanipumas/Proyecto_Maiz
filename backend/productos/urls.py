from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import ProductoViewSet, CategoriaViewSet, registro_cliente, login_cliente, procesar_pago



# 🌽 Configuramos el router para el CRUD automático de productos

router = DefaultRouter()

router.register(r'productos', ProductoViewSet)

router.register(r'categorias', CategoriaViewSet)



urlpatterns = [

    # Conecta las rutas automáticas del router (ej: api/productos/)

    path('', include(router.urls)),

   

    # Ruta para el registro de nuevos clientes (api/registro/)

    path('registro/', registro_cliente, name='registro_cliente'),

   

    # Ruta para el inicio de sesión (api/login/)

    path('login/', login_cliente, name='login_cliente'),

   

    # 💳 Ruta para procesar el carrito y descontar stock (api/pago/)

    path('pago/', procesar_pago, name='procesar_pago'),

]