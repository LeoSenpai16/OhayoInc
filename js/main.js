// incia la variable de productos como un array vacío
let productos = [];

// Obtiene de los datos de los productos desde el archivo de productos 
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos); // Llamada a la función cargarProductos una vez que se han obtenido los datos
    })

// Función para mostrar la descripción de un producto al pasar el mouse sobre el
function mostrarDescripcion() {
    document.getElementById("descripcionBox").style.display = "block";
}

// Función para ocultar la descripción 
function ocultarDescripcion() {
    document.getElementById("descripcionBox").style.display = "none";
}

// selecciona de elementos 
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Iteración sobre los botones de categorías para agregarles un event listener
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible"); 
}))

// Función para cargar los productos en el contenedor 
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor 

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <div class="producto">
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
            <div class="descripcionBox">
                <p>${producto.descripcion}</p>
            </div>
        </div>
        `;
        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar(); // Actualizar los botones de agregar producto 
}

// Iteración sobre los botones de categorías para agregarles event listeners que cambien los productos mostrados
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active")); // Remover la clase "active" de todos los botones de categorías
        e.currentTarget.classList.add("active"); // Agregar la clase "active" al botón de categoría seleccionado

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id); // Obtener el primer producto de la categoría seleccionada para mostrar su nombre en el título
            tituloPrincipal.innerText = productoCategoria.categoria.nombre; // Cambiar el título principal por el nombre de la categoría 
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id); // Filtrar los productos por la categoría
            cargarProductos(productosBoton); // Cargar los productos filtrados en el contenedor correspondiente
        } else {
            tituloPrincipal.innerText = "Todos los Mangas y comics"; // Si se selecciona la opción "todos", mostrar todos los productos
            cargarProductos(productos); // Cargar todos los productos en el contenedor
        }
    })
});

// Función para agregar event listeners a los botones de agregar producto al carrito
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito); 
    });
}

// Inicialización de la variable productosEnCarrito y recuperación de datos del carrito desde el Local Storage
let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

// Si hay productos en el carrito en el Local Storage, asignarlos a la variable productosEnCarrito y actualizar el numerito del carrito
if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

// Función para agregar un producto al carrito al hacer clic 
function agregarAlCarrito(e) {
    // Mostrar un mensaje de confirmación de producto agregado utilizando Toastify
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)", 
          borderRadius: "2rem", 
          textTransform: "uppercase", 
          fontSize: ".75rem" 
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem'
          },
        onClick: function(){}
      }).showToast();

    // Obtener el ID del producto del botón clickeado
    const idBoton = e.currentTarget.id;
    // Encuentra  el producto correspondiente al ID en el array de productos
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    // Verificar si el producto ya está en el carrito
    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++; 
    } else {
        productoAgregado.cantidad = 1; 
        productosEnCarrito.push(productoAgregado); // Agregar el producto al carrito
    }

    actualizarNumerito(); // Actualizar el numerito del carrito
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); // Guardar el carrito en el Local Storage
}

// Función para actualizar el numerito del carrito con la cantidad total de productos en él
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}
