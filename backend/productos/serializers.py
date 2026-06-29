from rest_framework import serializers
from .models import Producto, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    # 🖼️ Cambiamos a SerializerMethodField para armar la URL dinámicamente
    imagen_url = serializers.SerializerMethodField()
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    
    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'precio_por_kilo',
            'stock_disponible_kilos',
            'categoria',
            'categoria_nombre',
            'imagen_url'
        ]

    # Este método se ejecuta automáticamente para llenar el campo 'imagen_url'
    def get_imagen_url(self, obj):
        # Asumiendo que tu campo en el modelo se llama 'imagen'
        if hasattr(obj, 'imagen') and obj.imagen:
            return f"http://127.0.0.1:8000{obj.imagen.url}"
        
        # Si el producto no tiene imagen, podemos buscar si guardaste una ruta de texto
        elif hasattr(obj, 'imagen_url') and obj.imagen_url:
            # Si ya empieza con http, la dejamos igual; si no, le sumamos el servidor local
            if str(obj.imagen_url).startswith('http'):
                return obj.imagen_url
            return f"http://127.0.0.1:8000{obj.imagen_url}"
            
        return "" # Si de plano no hay nada, mandamos vacío