import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import PaqueteDetails from './PaqueteDetails';

function PaquetesList() {
  const [paquetes, setPaquetes] = useState([]);
  
  const [selectedPaquete, setSelectedPaquete] = useState(null);

  useEffect(() => {
    const paquetesListRef = ref(database, `paquetes`);
    const unsubscribe = onValue(paquetesListRef, (snapshot) => {
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
    return () => {
      unsubscribe();
    };
    
  }, []);

  const openPaqueteDetails = (paquete) => {
    setSelectedPaquete(paquete);
    console.log(paquete)
  };

  const closePaqueteDetails = () => {
    setSelectedPaquete(null);
  };

  return (
    <div className="container">
      <h3 className="mt-4 mb-4">Lista de paquetes</h3>
      <div className="row">
        {paquetes.map((paquete) => (
          <div key={paquete.id} className="col-md-4 mb-4">
            <div className="card" style={{ width: '100%' }}>
                <img
                  className="card-img-top"
                  src={paquete.imagenURL}
                  alt="paquete"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{paquete.nombre}</h5>
                  <p className="card-text">{paquete.descripcion}</p>
                  <p className="card-text">{paquete.productos.join(', ')}</p>
                  <button className="btn btn-primary" onClick={() => openPaqueteDetails(paquete)} data-bs-toggle="modal" data-bs-target="#paquetesModal" >Ver detalles</button>
                </div>
               
            </div>
          </div>
        ))}
      </div>
      
      <div className="modal " tabIndex="-1" id="paquetesModal" >
        <div className="modal-dialog  ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>Paquetes</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedPaquete && (
                <div className="product-details-modal">
                  <PaqueteDetails paquete={selectedPaquete} onClose={closePaqueteDetails} />
                </div>
              )}
            </div>
            <div className="modal-footer ">
            <button type='button' className='btn btn-primary'>Agregar al carrito</button>
              <button type="button" className="btn btn-danger  " onClick={closePaqueteDetails} data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default PaquetesList;
