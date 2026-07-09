const API_URL = window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:8000' : 'https://proyecto-maiz.onrender.com';

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM cargado.");
    if (document.getElementById('contenedor-tienda')) {
        cargarProductos();
    }
});

async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-tienda');
    let data = null; // Definimos data aquí para que sea global a esta función

    try {
        console.log("Fetching a:", `${API_URL}/api/productos-agrupados/`);
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        
        if (!res.ok) throw new Error(`Error ${res.status}`);

        data = await res.json(); // Ahora sí, asignamos el valor aquí
        console.log("Datos recibidos:", data);

        contenedor.innerHTML = '';

        if (!data || Object.keys(data).length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
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

// LÓGICA: Si la imagen ya tiene http, la usamos. Si no, le agregamos el API_URL
const srcImagen = p.imagen.startsWith('http') ? p.imagen : `${API_URL}${p.imagen}`;

prodDiv.innerHTML = `
    <img src="${srcImagen}" alt="${p.nombre}" style="width:100px;">
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
        console.error("Error capturado:", error);
        contenedor.innerHTML = '<p>Error al cargar la tienda.</p>';
    }
}