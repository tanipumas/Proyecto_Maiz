console.log("1. App.js iniciado");

const API_URL = window.location.hostname === "proyecto-maiz.onrender.com" 
    ? "https://proyecto-maiz.onrender.com" 
    : "http://127.0.0.1:8000";

async function cargarProductos() {
    console.log("2. Ejecutando cargarProductos...");
    try {
        const url = `${API_URL}/api/productos-agrupados/`;
        console.log("3. Haciendo fetch a:", url);
        
        const res = await fetch(url);
        const data = await res.json();
        
        console.log("4. Datos obtenidos:", data);
    } catch (e) {
        console.error("5. Error en fetch:", e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("6. DOM listo");
    cargarProductos();
});