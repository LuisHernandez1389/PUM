import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { onValue, ref } from 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../estilos/Carrusel.css"

const CarruselProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Obtenemos los datos de la base de datos
    const productosRef = ref(database, 'productos');
    onValue(productosRef, (snapshot) => {
      const productosData = snapshot.val();
      if (productosData) {
        const listaProductos = Object.values(productosData);
        setProductos(listaProductos);
      }
    });
  }, []);

  return (
    <div className="container mt-5">
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {productos.map((producto, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={producto.nombre}>
  <div className="carousel-image-container">
    <img src={producto.imagenUrl} className="d-block w-100" alt={producto.nombre} />
  </div>
  <div className="carousel-caption d-none d-md-block">
    <h5>{producto.nombre}</h5>
    <p>{producto.descripcion}</p>
  </div>
</div>


          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default CarruselProductos;
