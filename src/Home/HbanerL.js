import React from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

const HbannerL = () => {
  return (
    <MDBContainer fluid className="bg-light py-5" style={styles.bannerContainer}>
      <MDBRow className="justify-content-center align-items-center">
        <MDBCol size="auto">
          {/* Logo en el centro */}
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/pirotecniacq.appspot.com/o/Noche_de_amor_1706133687956-removebg-preview.png?alt=media&token=2b8c1968-44ee-486b-869d-2b2ad289bf40" // Reemplaza con la URL de tu logo
            alt="Logo"
            style={styles.logo}
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

const styles = {
  bannerContainer: {
    backgroundColor: '#f8f9fa', // Color de fondo del banner
    height: '250px',            // Altura del banner
    textAlign: 'center'
  },
  logo: {
    width: '250px',             // Tamaño del logo aumentado a 250px
    height: 'auto'              // Mantener la proporción
  }
};

export default HbannerL;
