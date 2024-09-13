import React, { useState, useEffect, useRef } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import "../estilos/Productos.css";
import ProductDetails from './ProductDetails';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';


const Productos = () => {
  // Estado para almacenar los productos de la base de datos
  const [productosDatabase, setProductosDatabase] = useState([]);
  // Estado para almacenar el carrito de compras
  const [carrito, setCarrito] = useState([]);
  // Estado para almacenar el peso total del carrito
  const [carritoPeso, setCarritoPeso] = useState(0);
  // Configuraciones para la moneda y el peso máximo del carrito
  const divisa = '$';
  const pesoMaximo = 9000;
  // Estado para almacenar el producto seleccionado para ver detalles
  const [selectedCohete, setSelectedCohete] = useState(null);
  // Referencia para el modal de detalles del producto
  const modalRef = useRef(null);
  // Estado para la barra de búsqueda
  const [busqueda, setBusqueda] = useState('');
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const showToast = () => {
    // Obtén el elemento toast del DOM
    const toastElement = document.getElementById('myToast');

    // Crea un nuevo objeto Toast de Bootstrap
    const bootstrapToast = new window.bootstrap.Toast(toastElement);

    // Muestra el toast
    bootstrapToast.show();
  };

  // Función para abrir los detalles de un producto
  const openProductDetails = (producto) => {
    setSelectedCohete(producto);
    logEvent(analytics, 'ver_detalles_producto', {
      productoId: producto.id,
    });
    ReactGA.event({
      category: 'Interacción',
      action: 'Ver Detalles del Producto',
      label: 'Producto: ' + producto.id,
    });
  };

  // Función para cerrar los detalles de un producto
  const closeProductDetails = () => {
    setSelectedCohete(null);
  };

  // Efecto para cargar productos y carrito desde localStorage y la base de datos
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    const pesoGuardado = JSON.parse(localStorage.getItem('carritoPeso')) || 0;
    setCarrito(carritoGuardado);
    setCarritoPeso(pesoGuardado);

    const databaseRef = ref(database, 'productos');
    onValue(databaseRef, (snapshot) => {
      const productos = [];
      snapshot.forEach((childSnapshot) => {
        const producto = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        productos.push(producto);
      });
      setProductosDatabase(productos);
    });

    return () => {
      setSelectedCohete(null);
    };
  }, []);

  // Función para guardar el carrito en localStorage
  const guardarCarritoEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  // Lógica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productosDatabase.slice(indexOfFirstProduct, indexOfLastProduct);

  // Función para cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Efecto para desplazarse hacia arriba al cambiar de página
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    scrollToTop();
  }, [currentPage]);

  // Función para renderizar la lista de productos
  const renderizarProductos = () => {
    const productosFiltrados = currentProducts.filter((producto) => {
      return producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    });

    return productosFiltrados.map((info) => (
      <div key={info.id} className="card col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div className="card-body d-flex flex-column h-100">
          <div className="text-center">
            <img
              className="card-img-top"
              src={info.imagenUrl}
              alt="paquete"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <h5 className="card-title">{info.nombre}</h5>
            <p>{info.peso} gramos</p>
            <p className="card-text">{info.precio}{divisa}</p>
            <br />
          </div>
          <div className="card-footer mt-auto d-flex justify-content-between">
            <button
              className="btn btn-primary"
              onClick={() => {
                anyadirProductoAlCarrito(info.id, info.peso);
                showToast()
              }}
              style={{ width: '48%' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
              </svg>
            </button>
            <Link to={`/producto/${info.id}`}
              className="btn btn-primary"
              style={{ width: '48%' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    ));
  };

  // Función para calcular el peso actual del carrito
  const pesoActualCarrito = carrito.reduce((totalPeso, itemId) => {
    const itemCarrito = productosDatabase.find((item) => item.id === itemId);

    if (itemCarrito) {
      return totalPeso + itemCarrito.peso;
    } else {
      return totalPeso;
    }
  }, 0);

  // Función para agregar un producto al carrito
  const anyadirProductoAlCarrito = (productoId, pesoProducto) => {
    const pesoEnGramos = pesoProducto;

    if (pesoActualCarrito + pesoEnGramos <= pesoMaximo) {
      const nuevoCarrito = [...carrito, productoId];
      setCarrito(nuevoCarrito);

      guardarCarritoEnLocalStorage(nuevoCarrito);

      const pesoCarritoActualizado = pesoActualCarrito + pesoEnGramos;
      setCarritoPeso(pesoCarritoActualizado);
      localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));
      logEvent(analytics, 'agregar_al_carrito', {
        productoId,
      });
      ReactGA.event({
        category: 'Interacción',
        action: 'Agregar al Carrito',
        label: 'Producto: ' + productoId,
      });
    } else {
      alert('Has alcanzado el límite de peso en el carrito (9000 gramos)');
    }
  };

  return (
    <div className="container">
      <main id="items" className="col-sm-12 row">
        {/* Barra de búsqueda */}
        <input
          className='form-control'
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {/* Lista de productos */}
        {renderizarProductos()}
      </main>
      <div className="position-fixed bottom-0 end-0 p-3">
        {/* Componente Toast de Bootstrap */}
        <div id="myToast" className="toast bottom-0 end-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Productos</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div >
          <div className="toast-body">
            <div class="d-flex justify-content-between align-items-center">
              <p class="mr-2">Producto Agregado al carro</p>
            </div>
          </div>
        </div>
      </div>
      {/* Modal para detalles del producto */}
      <div className="modal " tabIndex="-1" id="ProductosModal" ref={modalRef}>
        <div className="modal-dialog  ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>Productos</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedCohete && (
                <div className="product-details-modal">
                  <ProductDetails producto={selectedCohete} onClose={closeProductDetails} />
                </div>
              )}
            </div>
            <div className="modal-footer ">
              <button type="button" className="btn btn-danger  " onClick={closeProductDetails} data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Paginación */}
      <div>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(productosDatabase.length / productsPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Productos;