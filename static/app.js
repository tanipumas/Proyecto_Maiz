document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM cargado.");
    if (document.getElementById('contenedor-tienda')) {
        cargarProductos();
    }
});

async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-tienda');
    let data = null;

    try {
        console.log("Fetching a:", `${API_URL}/api/productos-agrupados/`);
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        
        if (!res.ok) throw new Error(`Error ${res.status}`);

        data = await res.json();
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

                // LÓGICA CORREGIDA: Definida dentro del ciclo donde 'p' ya existe
                const srcImagen = (p.imagen && p.imagen.startsWith('http')) ? p.imagen : `${API_URL}${p.imagen}`;

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

function agregarAlCarrito(productoId) {
    console.log("Agregando al carrito el producto ID:", productoId);
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    alert("Producto agregado al carrito");
}