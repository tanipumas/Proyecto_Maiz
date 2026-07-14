document.addEventListener("DOMContentLoaded", () => {
    // 1. Esto se ejecuta en TODAS las páginas
    console.log("DOM listo");

    // 2. Lógica condicional: Solo cargar productos si estamos en la tienda
    const contenedor = document.getElementById('contenedor-tienda');
    if (contenedor) {
        console.log("Estamos en la tienda, cargando productos...");
        cargarProductos(); 
    } else {
        console.log("Estamos en otra página (ej. Dashboard), omitiendo carga de productos.");
    }

    // 3. Vincular botones SIEMPRE (existan o no en esta página)
    const btnLogin = document.getElementById('btn-nav-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            if (window.abrirModalAutenticacion) window.abrirModalAutenticacion();
        });
    }

    const btnRegistro = document.getElementById('btn-nav-registro');
    if (btnRegistro) {
        btnRegistro.addEventListener('click', () => {
            if (window.abrirModalRegistro) window.abrirModalRegistro();
        });
    }
});