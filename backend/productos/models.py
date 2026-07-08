from django.db import models

from django.contrib.auth.models import User



# ==========================================

# 1. TABLAS DE CONFIGURACIÓN Y CATÁLOGOS

# ==========================================



class Proveedor(models.Model):

    nombre = models.CharField(max_length=150)

    telefono = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):

        return self.nombre


class Categoria(models.Model):

    nombre = models.CharField(max_length=100)

    def __str__(self):

        return self.nombre



# ==========================================

# 2. TABLA DE PRODUCTOS

# ==========================================



class Producto(models.Model):

    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')

    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True, blank=True, related_name='productos')

    nombre = models.CharField(max_length=200)

    precio_por_kilo = models.DecimalField(max_digits=10, decimal_places=2)

    stock_disponible_kilos = models.DecimalField(max_digits=10, decimal_places=2)

    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)



    @property

    def categoria_nombre(self):

        return self.categoria.nombre



    @property

    def imagen_url(self):

        # Corregido: Retornamos la ruta relativa para que el navegador resuelva la URL base automáticamente

        if self.imagen and hasattr(self.imagen, 'url'):

            return self.imagen.url

        return "https://via.placeholder.com/150?text=Sin+Imagen"



    def __str__(self):

        return self.nombre



# ==========================================

# 3. GESTIÓN DE PEDIDOS Y VENTAS

# ==========================================



class Pedido(models.Model):

    ESTATUS_OPCIONES = [

        ('PENDIENTE', 'Pendiente de entrega'),

        ('EN_PROCESO', 'Preparando en bodega'),

        ('ENTREGADO', 'Entregado con éxito'),

        ('CANCELADO', 'Pedido cancelado'),

    ]



    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')

    fecha_creacion = models.DateTimeField(auto_now_add=True)

    metodo_pago = models.CharField(max_length=50, default='EFECTIVO')

    total = models.DecimalField(max_digits=10, decimal_places=2)

    estatus = models.CharField(max_length=20, choices=ESTATUS_OPCIONES, default='PENDIENTE')



    def __str__(self):

        return f"Pedido #{self.id} - {self.cliente.username} ({self.estatus})"



class DetallePedido(models.Model):

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')

    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True)

    # Respaldo del nombre por si el producto es eliminado en el futuro

    nombre_producto_respaldo = models.CharField(max_length=255, blank=True, null=True)

    cantidad_kilos = models.FloatField()

    precio_por_kilo = models.DecimalField(max_digits=10, decimal_places=2)



    def __str__(self):

        return f"{self.cantidad_kilos} Kg de {self.nombre_producto_respaldo} en Pedido #{self.pedido.id}" 

