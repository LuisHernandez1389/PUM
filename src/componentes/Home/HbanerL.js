import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';

const HbannerL = () => {
  return (
    <MDBContainer fluid className="bg-light py-5" style={styles.bannerContainer}>
      <MDBRow className="justify-content-center align-items-center">
        <MDBCol size="auto">
          {/* Logo en el centro */}
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/pirotecniacq.appspot.com/o/productos%2Fsadasd_1705947808901.jpg?alt=media&token=f3e0bdef-282d-4dfc-9cff-622e69f66bef" // Reemplaza con la URL de tu logo
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
