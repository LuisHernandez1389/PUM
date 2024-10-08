import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { database } from '../firebase';

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
    <div className="product-details text-center d-flex flex-column align-items-center p-4 shadow-lg rounded">
      <img
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        src={imageUrl}
        alt={paquete?.nombre}
        className="mb-3"
      />
      <h2 className="mb-4">{paquete?.nombre}</h2>
      <ul className="list-group w-100">
        {productosDetalles.map((producto, index) => (
          <li key={index} className="list-group-item d-flex align-items-center justify-content-between">
            <div className="producto-item d-flex align-items-center">
              <img
                className="PPimagen mr-3 rounded"
                alt={producto.nombre}
                src={producto.imagenUrl}
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <div className="producto-info">
                <span className="producto-nombre font-weight-bold">{producto.nombre}</span>
              </div>
            </div>
            <span className="producto-precio font-weight-bold text-success">${producto.precio}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default PaqueteDetails;
