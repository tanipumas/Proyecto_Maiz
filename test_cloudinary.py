import cloudinary
import cloudinary.uploader
import cloudinary.api

# 1. Configuración de Cloudinary
cloudinary.config(
    cloud_name = "hojx2qw5",
    api_key = "181798435912144",
    api_secret = "WdotTXz2iIPbzYRaWxaFYRoOH6I"  # <--- replace this
)

# 2. Subir una imagen de prueba
print("Subiendo imagen...")
upload_result = cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    public_id = "test_image"
)

print(f"URL segura: {upload_result['secure_url']}")
print(f"Public ID: {upload_result['public_id']}")

# 3. Obtener detalles de la imagen
print("\nObteniendo metadatos...")
print(f"Ancho: {upload_result['width']}px")
print(f"Alto: {upload_result['height']}px")
print(f"Formato: {upload_result['format']}")
print(f"Tamaño: {upload_result['bytes']} bytes")

# 4. Transformar la imagen
# f_auto: selecciona automáticamente el mejor formato (webp, avif, etc.)
# q_auto: optimiza automáticamente la calidad para que sea ligera
transformed_url = cloudinary.utils.cloudinary_url(
    "test_image", 
    fetch_format="auto", 
    quality="auto"
)[0]

print("\n¡Listo! Tu imagen ha sido optimizada.")
print(f"URL de la imagen optimizada: {transformed_url}")
print("Abre el enlace anterior para ver la imagen. ¡Revisa qué formato y tamaño tiene!")