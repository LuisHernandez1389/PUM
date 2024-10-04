import React from 'react';
import {MDBBtn } from 'mdb-react-ui-kit';

const Banner = () => {
  return (
    <div style={{
      backgroundImage: `url('https://images.pexels.com/photos/6745040/pexels-photo-6745040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '300px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      margin: '40px 0'
    }}>
      <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>¡Semana de Descuentos!</h2>
      <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Hasta 50% de descuento en productos seleccionados.</p>
      <MDBBtn color="danger" size="lg">Aprovechar Descuentos</MDBBtn>
    </div>
  );
};
export default Banner;
