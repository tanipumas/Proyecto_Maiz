from django.contrib import admin

from .models import Producto, Categoria, Pedido, DetallePedido, Proveedor # 👈 Asegúrate de importar Proveedor



# Configuración para ver qué productos se compraron dentro del mismo pedido

class DetallePedidoInline(admin.TabularInline):

    model = DetallePedido

    extra = 0

    readonly_fields = ['producto', 'nombre_producto_respaldo', 'cantidad_kilos', 'precio_por_kilo']



@admin.register(Pedido)

class PedidoAdmin(admin.ModelAdmin):

    list_display = ['id', 'cliente', 'fecha_creacion', 'total', 'estatus', 'metodo_pago']

    list_filter = ['estatus', 'metodo_pago', 'fecha_creacion']

    search_fields = ['cliente__username', 'id']

    list_editable = ['estatus'] # Te permite cambiar el estatus rápido desde la lista de pedidos

    inlines = [DetallePedidoInline]



# ==========================================

# 🏢 REGISTRO DE LOS MODELOS EN EL PANEL ADMIN

# ==========================================

@admin.register(Proveedor)

class ProveedorAdmin(admin.ModelAdmin):

    list_display = ['id', 'nombre', 'telefono'] # Muestra estos campos en columnas limpias

    search_fields = ['nombre']



admin.site.register(Producto)

admin.site.register(Categoria) 

