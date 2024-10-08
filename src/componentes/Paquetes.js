import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import PaqueteDetails from './PaqueteDetails';
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

function PaquetesList() {
  const [paquetes, setPaquetes] = useState([]);
  const [selectedPaquete, setSelectedPaquete] = useState(null);
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
      setPaquetes(paqueteList);
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

  const openPaqueteDetails = (paquete) => {
    setSelectedPaquete(paquete);
  };

  const closePaqueteDetails = () => {
    setSelectedPaquete(null);
  };

  return (
    <div className="container">
      <h3 className="mt-4 mb-4">Lista de paquetes</h3>
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
                {/* Limitar descripción a 2 líneas */}
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
              <MDBCardLink
                href="#"
                onClick={() => openPaqueteDetails(paquete)}
                data-bs-toggle="modal"
                data-bs-target="#paquetesModal"
              >
                Ver detalles
              </MDBCardLink>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      ))}
    </MDBRow>

      <div className="modal" tabIndex="-1" id="paquetesModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Paquetes</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedPaquete && (
                <div className="product-details-modal">
                  <PaqueteDetails paquete={selectedPaquete} onClose={closePaqueteDetails} />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Agregar al carrito
              </button>
              <button type="button" className="btn btn-danger" onClick={closePaqueteDetails} data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaquetesList;
