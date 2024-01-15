import React, { useState, useEffect } from 'react';
import { database } from '../firebase'; // Asegúrate de importar la instancia de la base de datos desde tu archivo firebase.js
import { ref, onValue, get, set, remove } from 'firebase/database';
import '../estilos/ListaOrdenes.css'

const ListaOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [ordenesAtendidas, setordenesAtendidas] = useState([]);

  useEffect(() => {
    const ordenListRef = ref(database, 'ordenes');
  
    const unsubscribe = onValue(ordenListRef, async (snapshot) => {
      const ordenList = [];
      const ordenesAtendidas = [];
  
      snapshot.forEach((childSnapshot) => {
        const orden = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };
  
        if (orden.atendido) {
          ordenesAtendidas.push(orden);
        } else {
          ordenList.push(orden);
        }
      });
  
      const ordenesConDetalles = await fetchProductDetails(ordenList);
      const ordenesAtendidasConDetalles = await fetchProductDetails(ordenesAtendidas);
  
      setOrdenes(ordenesConDetalles);
      setordenesAtendidas(ordenesAtendidasConDetalles);
      console.log(ordenes[0].productos)
    });
  
    // Devolver una función de limpieza para desuscribirse cuando el componente se desmonte
    return () => {
      unsubscribe();
    };
  }, [ordenes]); 
  
  const fetchProductDetails = async (ordenes) => {
    const ordenesConDetalles = await Promise.all(
      ordenes.map(async (orden) => {
        const cantidades = {}; // Objeto para rastrear las cantidades de cada producto
  
        // Calcular las cantidades de cada producto en esta orden
        orden.productos.forEach((productoId) => {
          cantidades[productoId] = (cantidades[productoId] || 0) + 1;
        });
  
        // Obtener los detalles de los productos
        const productosDetalles = await Promise.all(
          Object.keys(cantidades).map(async (productoId) => {
            const productoSnapshot = await get(ref(database, `productos/${productoId}`));
            if (productoSnapshot.exists()) {
              const productoData = productoSnapshot.val();
              return {
                id: productoId,
                nombre: productoData.nombre,
                cantidad: cantidades[productoId], // Usar la cantidad del objeto de cantidades
                precio: productoData.precio,
              };
            }
            // Manejar el caso cuando el producto no existe
            return null;
          })
        );
  
        // Filtra los productos nulos (productos no encontrados) del array
        orden.productosDetalles = productosDetalles.filter((detalle) => detalle !== null);
        return orden;
      })
    );
  
    return ordenesConDetalles;
  };
  
  
  
  const moverAAtendidos = (orden) => {
    // Actualizar el campo 'atendido' en la base de datos
    const ordenRef = ref(database, `ordenes/${orden.id}`);
    set(ordenRef, { ...orden, atendido: true });
};
const moverADesatendidos = (orden) => {
    // Actualizar el campo 'atendido' en la base de datos
    const ordenRef = ref(database, `ordenes/${orden.id}`);
    set(ordenRef, { ...orden, atendido: false });
};
const eliminarorden = (orden) => {
    // Eliminar el orden de la lista de ordens atendidos y de la base de datos
    const ordenRef = ref(database, `ordenes/${orden.id}`);
    remove(ordenRef);

    // Actualizar el estado para que se refleje el cambio
    const nuevosordenesAtendidas = ordenesAtendidas.filter((e) => e.id !== orden.id);
    setordenesAtendidas(nuevosordenesAtendidas);
};

return (
  <div className="container mt-5">
    <h1 className="mb-4">Lista de Órdenes</h1>
    <div className="row">
      <div className="col-md-6 scroll-container">
        <h2>Órdenes Pendientes</h2>
        <ul className="list-group">
          {ordenes.map((orden) => (
            <li className="list-group-item" key={orden.id}>
          <h4>Orden ID: {orden.id}</h4>
          <p>Usuario: {orden.usuario.nombre} {orden.usuario.apellido}</p>
          <p>Email: {orden.usuario.email}</p>
          <p>Dirección: {orden.usuario?.direccion}</p>
          <p>Teléfono: {orden.usuario.numeroTelefono}</p>
              <ul>
                {orden.productosDetalles.map((producto) => (
                  <li key={producto.id}>
                    {producto.nombre} - Cantidad: {producto.cantidad} - Precio: ${producto.precio}
                  </li>
                ))}
              </ul>
              <p>Total: ${orden.total}</p>
              <button className="btn btn-primary" onClick={() => moverAAtendidos(orden)}>
                Atender
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-md-6 scroll-container">
        <h2>Órdenes Atendidas</h2>
        <ul className="list-group">
          {ordenesAtendidas.map((orden) => (
            <li className="list-group-item" key={orden.id}>
          <h4>Orden ID: {orden.id}</h4>
          <p>Usuario: {orden.usuario.nombre} {orden.usuario.apellido}</p>
          <p>Email: {orden.usuario.email}</p>
          <p>Dirección: {orden.usuario.direccion}</p>
          <p>Teléfono: {orden.usuario.numeroTelefono}</p>
              <ul>
                {orden.productosDetalles.map((producto) => (
                  <li key={producto.id}>
                    {producto.nombre} - Cantidad: {producto.cantidad} - Precio: ${producto.precio}
                  </li>
                ))}
              </ul>
              <p>Total: ${orden.total}</p>
              <button className="btn btn-primary" onClick={() => moverADesatendidos(orden)}>
                Devolver
              </button>
              <button className="btn btn-danger" onClick={() => eliminarorden(orden)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

};

export default ListaOrdenes;
