import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const SearchPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // Lógica para obtener productos filtrados
  useEffect(() => {
    if (busqueda.trim() !== '') {
      const productosRef = ref(database, 'productos');
      onValue(productosRef, (snapshot) => {
        const productosData = snapshot.val();
        if (productosData) {
          const listaProductos = Object.values(productosData);
          const productosFiltrados = listaProductos.filter((producto) =>
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
          );
          setProductosFiltrados(productosFiltrados);
        }
      });
    } else {
      setProductosFiltrados([]);
    }
  }, [busqueda]);

  // Función para manejar cambios en el campo de búsqueda
  const handleChange = (event) => {
    setBusqueda(event.target.value);
  };

  return (
    <><div class="my-2 bg-gray">
          <div class="p-5 text-center bg-body-tertiary">
              <div class="container py-2">
                  <h1 class="text-body-emphasis">Buscar</h1>
                  <p class="col-lg-8 mx-auto lead">
                      En que podemos ayudarte?
                  </p>
              </div>
          </div>
      </div><div className="container mt-2">
              <div className="row justify-content-center">
                  <div className="col-lg-6">
                      <div className="input-group mb-3">
                          <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar productos"
                              aria-label="Buscar productos"
                              aria-describedby="button-addon2"
                              value={busqueda}
                              onChange={handleChange} />

                      </div>
                  </div>
              </div>
              <div className="row">
                  {productosFiltrados.map((producto) => (
                      <div className="col-lg-4 mb-2" key={producto.id}>
                          <div className="card">
                              <img src={producto.imagenUrl} className="card-img-top" alt={producto.nombre} />
                              <div className="card-body">
                                  <h5 className="card-title">{producto.nombre}</h5>
                                  <p className="card-text">{producto.descripcion}</p>
                                  <Link to={`/producto/${producto.id}`} className="btn btn-primary">
                                      Ver detalles
                                  </Link>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div></>
  );
};

export default SearchPage;
