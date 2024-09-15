import { database } from '../firebase'
import { useState, useEffect } from "react"
import { ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const Mispedidos = () => {
  const [ordenes, setOrdenes] = useState([]);
  const auth = getAuth();
  const userUID = auth.currentUser.uid;

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
      setOrdenes(ordenes);
      console.log(ordenes)
    });
  }, [userUID]);

  return (
    <div className="card text-center">
      <div className="card-header">
        PEDIDOS
      </div>
      {ordenes.map((orden, index) => (
        <div key={index} className="card text-center">

          <div className="card-body">
            <ul key={index}>
              <li>{orden.id}</li>
              <li>{orden.usuario.nombre} {orden.usuario.apellido}</li>
              <li>{orden.usuario.email}</li>
              <li>{orden.usuario.direccion}</li>
              <li>{orden.total}</li>
            </ul>

            <button className="btn btn-primary">VOLVER A COMPRAR</button>
          </div>
          <div className="card-footer text-body-secondary">
            <p>Fecha de Compra: {orden.fechaCompra ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(orden.fechaCompra)) : new Date().toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Mispedidos