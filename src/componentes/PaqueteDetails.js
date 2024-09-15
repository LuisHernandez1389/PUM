import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { database } from '../firebase';
import "../estilos/Paquete.css"

const PaqueteDetails = ({ paquete, onClose }) => {
  const imageUrl = paquete?.imagenURL;
  const [productosDetalles, setProductosDetalles] = useState([]);
  
  useEffect(() => {
    const fetchProductos = async () => {
      if (!paquete || !paquete.productos || paquete.productos.length === 0) {
        setProductosDetalles([]);
        return;
      }

      const productosPromises = paquete.productos.map(async (productoId) => {
        const productoRef = ref(database, 'productos', productoId);
        const snapshot = await get(productoRef);
      
        if (snapshot.exists()) {
          const producto = snapshot.val();
          return producto[productoId]; // Asegúrate de obtener el producto correcto usando la clave del producto
        }
      
        return null;
      });
      
      const productosResultados = await Promise.all(productosPromises);
      const productosEncontrados = productosResultados.filter(producto => producto !== null);
      setProductosDetalles(productosEncontrados);
      
    };

    fetchProductos();
  }, [paquete]);

  useEffect(() => {
    console.log(productosDetalles);
  }, [productosDetalles]);

  return (
    <div className="product-details text-center d-flex flex-column align-items-center">
      <img style={{ width: "150px", height: "150px" }} src={imageUrl} alt={paquete?.nombre} />
      <h2>{paquete?.nombre}</h2>
      <ul className="list-group">
  {productosDetalles.map((producto, index) => (
    <li key={index} className="list-group-item">
      <div className="producto-item">
        <img className='PPimagen' alt={producto.nombre} src={producto.imagenUrl} />
        <div className="producto-info">
          <span className="producto-nombre">{producto.nombre}</span>
          <span className="producto-precio">${producto.precio}</span>
        </div>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
};

export default PaqueteDetails;
