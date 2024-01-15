import {database} from '../firebase'
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
      });
  }, [userUID]);
    return (
      <div>
        <form class="w-100 me-3" role="search">
          <input type="search" class="form-control" placeholder="Search..." aria-label="Search"/>
        </form>
      <h3>Lista de Órdenes</h3>
      <ul>
          {ordenes.map((orden, index) => (
              <li key={index}>{orden.id}</li>

          ))}
      </ul>
      
  </div>
    )
}

export default Mispedidos