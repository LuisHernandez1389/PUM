import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardLink,
  MDBCol,
  MDBRow
} from 'mdb-react-ui-kit';

function PaquetesAleatorios() {
  const [paquetes, setPaquetes] = useState([]);
  const [productos, setProductos] = useState({});

  useEffect(() => {
    const paquetesListRef = ref(database, 'paquetes');
    const productosListRef = ref(database, 'productos');

    const paquetesUnsubscribe = onValue(paquetesListRef, (snapshot) => {
      const paqueteList = [];
      snapshot.forEach((childSnapshot) => {
        const paquete = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        paqueteList.push(paquete);
      });

      // Seleccionar 3 paquetes aleatorios
      const shuffledPaquetes = paqueteList.sort(() => 0.5 - Math.random());
      const selectedPaquetes = shuffledPaquetes.slice(0, 3);
      setPaquetes(selectedPaquetes);
    });

    const productosUnsubscribe = onValue(productosListRef, (snapshot) => {
      const productosData = {};
      snapshot.forEach((childSnapshot) => {
        const producto = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        productosData[producto.id] = producto;
      });
      setProductos(productosData);
    });

    return () => {
      paquetesUnsubscribe();
      productosUnsubscribe();
    };
  }, []);

  return (
    <MDBRow>
      {paquetes.map((paquete) => (
        <MDBCol md="4" key={paquete.id} className="mb-4">
          <MDBCard style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <MDBCardImage
              position="top"
              alt={paquete.nombre}
              src={paquete.imagenURL}
              style={{ height: '200px', objectFit: 'cover' }}
            />
            <MDBCardBody style={{ flex: '1' }}>
              <MDBCardTitle>{paquete.nombre}</MDBCardTitle>
              <MDBCardText>
                {paquete.descripcion.length > 100
                  ? `${paquete.descripcion.slice(0, 100)}...`
                  : paquete.descripcion}
              </MDBCardText>
            </MDBCardBody>
            <MDBListGroup flush>
              <MDBListGroupItem>Productos:</MDBListGroupItem>
              {paquete.productos.map((productoId) => (
                <MDBListGroupItem key={productoId}>
                  {productos[productoId] ? productos[productoId].nombre : 'Nombre no encontrado'}
                </MDBListGroupItem>
              ))}
            </MDBListGroup>
            <MDBCardBody>
              <MDBCardLink href="paquetes">Ver detalles</MDBCardLink>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      ))}
    </MDBRow>
  );
}

export default PaquetesAleatorios;
