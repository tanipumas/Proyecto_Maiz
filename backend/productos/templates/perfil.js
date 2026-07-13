const API_URL = window.location.hostname === "proyecto-maiz.onrender.com" 
    ? "https://proyecto-maiz.onrender.com" 
    : "http://127.0.0.1:8000";

async function cargarHistorialPedidos() {
    const token = localStorage.getItem('cliente_token');
    try {
        const response = await fetch(`${API_URL}/api/historial/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            // Lógica para renderizar pedidos en el perfil
            console.log("Pedidos cargados:", data);
        }
    } catch (error) {
        console.error("Error al cargar historial:", error);
    }
}