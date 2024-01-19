import React, { useState, useEffect, useRef } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import "../estilos/Cohetes.css";
import ProductDetails from './ProductDetails';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';
import ReactGA from 'react-ga';

function Cohetes() {
  const [productosDatabase, setProductosDatabase] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoPeso, setCarritoPeso] = useState(0);
  const divisa = '$';
  const pesoMaximo = 9000;
  const [selectedCohete, setSelectedCohete] = useState(null);
  const modalRef = useRef(null);
  const [busqueda, setBusqueda] = useState('');


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

  const closeProductDetails = () => {
    setSelectedCohete(null);
  };

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

  const guardarCarritoEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  };

  const renderizarProductos = () => {
    const productosFiltrados = productosDatabase.filter((producto) => {
      return producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    });
    
    return productosFiltrados.map((info) => (
<div key={info.id} className="card col-sm-3">
  <div className="card-body">
    <div className="text-center">
    <img
                  className="card-img-top"
                  src={info.imagenUrl}
                  alt="paquete"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
      <h5 className="card-title text-center">{info.nombre}</h5>
      <p>{info.peso} gramos</p>
      <p className="card-text">{info.precio}{divisa}</p>
      <br/>
    </div>
    <div className="card-footer">
      <button
        className="btn btn-primary"
        onClick={() => anyadirProductoAlCarrito(info.id, info.peso)}
        style={{ width: '50%' }}
      >
        Agregar
      </button>
      <button
        style={{ width: '50%' }}
        className='btn btn-primary'
        onClick={() => openProductDetails(info)}
        data-bs-toggle="modal"
        data-bs-target="#cohetesModal"
      >
        Ver
      </button>
    </div>
  </div>
</div>

    ));
  };

  const pesoActualCarrito = carrito.reduce((totalPeso, itemId) => {
    const itemCarrito = productosDatabase.find((item) => item.id === itemId);
  
    if (itemCarrito) {
      return totalPeso + itemCarrito.peso;
    } else {
      return totalPeso;
    }
  }, 0);

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
    
    
    <div >
      <main id="items" className="col-sm-12 row">
      <input
      className='form-control'
        placeholder="Buscar productos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
        {renderizarProductos()}
      </main>

      
      <div className="modal " tabIndex="-1" id="cohetesModal" ref={modalRef}>
        <div className="modal-dialog">
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

    </div>
  </div>
  );
}

export default Cohetes;
