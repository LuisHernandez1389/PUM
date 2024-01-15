import ProductList from "./ProducList"
import ProductForm from "./ProductForm"
import CrearPaquete from "../componentes/PackageForm"
import EventList from "./EventList"
import ListaOrdenes from "./ListaOrdenes"
import {database} from '../firebase'
import { useState, useEffect } from "react"
import { ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function Admin() {
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
    return(
      <div>
      <ProductForm />
      <ProductList showDeleteButton={true} />
      <CrearPaquete />
      <EventList />
      <ListaOrdenes />
      
      <div>
          <h1>Lista de Órdenes</h1>
          <ul>
              {ordenes.map((orden, index) => (
                  <li key={index}>{orden.id}</li>
              ))}
          </ul>
      </div>
      
  </div>
    )
}

export default Admin;