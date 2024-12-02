import React from 'react';
import { MDBContainer, MDBTypography } from 'mdb-react-ui-kit';
import PaquetesAleatorios from './PaquetesAleatorios'; 

const HPaquetes = () => {
  return (
    <div>
      <MDBContainer className='mt-5'>
        <MDBTypography tag="h2" className="text-center mb-4" style={styles.sectionTitle}>
          Paquetes 
        </MDBTypography>
        {/* Mostrar 3 paquetes aleatorios */}
        <PaquetesAleatorios />
      </MDBContainer>
    </div>
  );
};

// Estilos personalizados
const styles = {
  sectionTitle: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#343a40',
    textTransform: 'uppercase',
  },
};

export default HPaquetes;
