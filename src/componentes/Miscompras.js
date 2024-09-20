import { database } from '../firebase';
import { useState, useEffect } from "react";
import { ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import './Miscompras.css'; // Asegúrate de crear este archivo para los estilos personalizados

const Miscompras = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const auth = getAuth();
  const userUID = auth.currentUser?.uid;

  useEffect(() => {
    const databaseRef = ref(database, 'productos');
    onValue(databaseRef, (snapshot) => {
      const productosArray = [];
      snapshot.forEach((childSnapshot) => {
        const producto = { id: childSnapshot.key, ...childSnapshot.val() };
        productosArray.push(producto);
      });
      setProductos(productosArray);
    });
  }, []);

  useEffect(() => {
    const databaseRef = ref(database, 'ordenes');
    onValue(databaseRef, (snapshot) => {
      const ordenes = [];
      snapshot.forEach((childSnapshot) => {
        const orden = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        if (orden.usuario && orden.usuario.uid === userUID) {
          ordenes.push(orden);
        }
      });

      const ordenesOrdenadas = ordenes
        .filter(orden => orden.fechaCompra && !isNaN(new Date(orden.fechaCompra).getTime()))
        .sort((a, b) => {
          const fechaA = new Date(a.fechaCompra).getTime();
          const fechaB = new Date(b.fechaCompra).getTime();
          return fechaB - fechaA;
        });

      const ordenesConNombres = ordenesOrdenadas.map((orden) => {
        const productosEnOrden = orden.productos.map((productoId) => {
          const producto = productos.find((prod) => prod.id === productoId);
          return producto ? producto.nombre : 'Desconocido';
        });

        return {
          ...orden,
          productos: productosEnOrden,
        };
      });

      setOrdenes(ordenesConNombres);
    });
  }, [userUID, productos]);

  return (
    <div className="mispedidos-container">
      <div className="card-header text-center">
        <h3>MIS COMPRAS</h3>
      </div>
      {ordenes.length > 0 ? (
        ordenes.map((orden) => (
          <div key={orden.id} className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{orden.usuario.nombre} {orden.usuario.apellido}</h5>
              <p className="card-text"><strong>Email:</strong> {orden.usuario.email}</p>
              <p className="card-text"><strong>Productos:</strong></p>
              <ul className="list-unstyled">
                {orden.productos.map((producto, index) => (
                  <li key={index} className="product-item">{producto}</li>
                ))}
              </ul>
              <p className="card-text"><strong>Total:</strong> ${orden.total}</p>
              <button className="btn btn-primary">VOLVER A COMPRAR</button>
            </div>
            <div className="card-footer text-muted">
              <p className="mb-0">
                Fecha de Compra: {orden.fechaCompra 
                  ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(orden.fechaCompra)) 
                  : 'Sin fecha de compra'}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No hay pedidos disponibles</p>
      )}
    </div>
  );
};

export default Miscompras;
