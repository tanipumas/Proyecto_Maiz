document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM listo");
    const contenedor = document.getElementById('contenedor-tienda');
    if (contenedor) {
        console.log("¡Contenedor encontrado! Intentando inyectar texto...");
        contenedor.innerHTML = '<h1 style="color: red;">¡ESTO ES UNA PRUEBA DE INYECCIÓN!</h1>';
    } else {
        console.error("¡ERROR: No se encontró el elemento con ID 'contenedor-tienda'!");
    }
});