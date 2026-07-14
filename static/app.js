async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-tienda');
    if (!contenedor) return;
    
    try {
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        const data = await res.json();
        
        contenedor.innerHTML = ''; // Limpiar contenedor
        
        for (const categoria in data) {
            // Crear contenedor de categoría
            const seccion = document.createElement('div');
            seccion.innerHTML = `<h2 style="margin-top: 30px; border-bottom: 2px solid #2e7d32;">${categoria}</h2>`;
            contenedor.appendChild(seccion);
            
            // Crear grid de productos
            const grid = document.createElement('div');
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            grid.style.gap = '20px';
            grid.style.marginTop = '15px';
            
            data[categoria].forEach(p => {
                const prodDiv = document.createElement('div');
                prodDiv.style.border = '1px solid #ccc';
                prodDiv.style.padding = '10px';
                prodDiv.style.borderRadius = '8px';
                prodDiv.innerHTML = `
                    <img src="${p.imagen}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;">
                    <h3>${p.nombre}</h3>
                    <p>Precio: $${p.precio_por_kilo}/Kg</p>
                    <button onclick="agregarAlCarrito(${p.id})" style="width: 100%; padding: 10px; background: #2e7d32; color: white; border: none; cursor: pointer;">Agregar</button>
                `;
                grid.appendChild(prodDiv);
            });
            contenedor.appendChild(grid);
        }
    } catch (e) {
        console.error("Error al renderizar productos:", e);
    }
}