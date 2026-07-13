from rest_framework import serializers
from .models import Producto, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'precio_por_kilo', 'stock_disponible_kilos', 'categoria', 'categoria_nombre', 'imagen_url']

    def get_imagen_url(self, obj):
        # Retorna solo la ruta relativa (ej: /media/productos/maiz.jpg)
        if hasattr(obj, 'imagen') and obj.imagen:
            return obj.imagen.url
        return ""