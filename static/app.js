const API_URL = window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:8000' : 'https://proyecto-maiz.onrender.com';

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM cargado.");
    const contenedor = document.getElementById('contenedor-tienda');
    if (contenedor) {
        cargarProductos();
    }
});

async function cargarProductos() {
    try {
        console.log("Intentando obtener productos...");
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        
        if (!res.ok) {
            throw new Error(`Error de servidor: ${res.status}`);
        }

        const data = await res.json();
        console.log("Datos recibidos:", data); // Esto nos dirá si 'data' es lo que esperamos

        const contenedor = document.getElementById('contenedor-tienda');
        contenedor.innerHTML = '';

        // Validamos que 'data' sea un objeto y no esté vacío
        if (!data || Object.keys(data).length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles actualmente.</p>';
            return;
        }

        Object.keys(data).forEach(categoria => {
            const header = document.createElement('div');
            header.className = 'categoria-header';
            header.innerHTML = `<h2>${categoria} <span>▼</span></h2>`;
            
            const grid = document.createElement('div');
            grid.className = 'productos-grid';
            
            header.onclick = () => {
                grid.classList.toggle('active');
                header.querySelector('span').textContent = grid.classList.contains('active') ? '▲' : '▼';
            };

            data[categoria].forEach(p => {
                const prodDiv = document.createElement('div');
                prodDiv.className = 'tarjeta-producto';
                prodDiv.innerHTML = `
                    <img src="${p.imagen || ''}" alt="${p.nombre}" style="width:100px;">
                    <h3>${p.nombre}</h3>
                    <p>$${p.precio_por_kilo}/Kg</p>
                    <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${p.id})">Agregar</button>
                `;
                grid.appendChild(prodDiv);
            });

            contenedor.appendChild(header);
            contenedor.appendChild(grid);
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
        const contenedor = document.getElementById('contenedor-tienda');
        if (contenedor) contenedor.innerHTML = '<p>Error al cargar la tienda. Intenta recargar.</p>';
    }
}