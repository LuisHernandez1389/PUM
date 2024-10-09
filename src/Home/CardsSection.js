import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTypography,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

const CardsSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (category) => {
    navigate(`/${category}`);
  };

  return (
    <div>
      <MDBContainer className="mt-5">
        <MDBTypography tag="h2" className="text-center mb-4" style={styles.sectionTitle}>
          Explora las categorias
        </MDBTypography>
        <MDBRow>
          <MDBCol md="4">
            <div
              onClick={() => handleCardClick('luz')}
              style={styles.cardContainer}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Aumenta ligeramente el tamaño al pasar el mouse
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Restaura el tamaño al salir el mouse
            >
              <MDBCard style={styles.card} data-mdb-animation-show-on-load="false">
                <MDBCardImage
                  src="https://images.pexels.com/photos/19118865/pexels-photo-19118865/free-photo-of-noche-oscuro-explosion-colorido.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="..."
                  position="top"
                  style={styles.cardImage}
                />
                <MDBCardBody>
                  <MDBCardTitle>Luz</MDBCardTitle>
                  <MDBCardText>PirotecniaLeyker.</MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </div>
          </MDBCol>
          <MDBCol md="4">
            <div
              onClick={() => handleCardClick('trueno')}
              style={styles.cardContainer}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <MDBCard style={styles.card} data-mdb-animation-show-on-load="false">
                <MDBCardImage
                  src="https://images.pexels.com/photos/13086763/pexels-photo-13086763.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                  alt="..."
                  position="top"
                  style={styles.cardImage}
                />
                <MDBCardBody>
                  <MDBCardTitle>Trueno</MDBCardTitle>
                  <MDBCardText>PirotecniaLeyker.</MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </div>
          </MDBCol>
          <MDBCol md="4">
            <div
              onClick={() => handleCardClick('baterias')}
              style={styles.cardContainer}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <MDBCard style={styles.card} data-mdb-animation-show-on-load="false">
                <MDBCardImage
                  src="https://images.pexels.com/photos/15512817/pexels-photo-15512817/free-photo-of-reflejo-reflexion-ceremonia-fuegos-artificiales.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="..."
                  position="top"
                  style={styles.cardImage}
                />
                <MDBCardBody>
                  <MDBCardTitle>Baterias</MDBCardTitle>
                  <MDBCardText>PirotecniaLeyker.</MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </div>
          </MDBCol>
        </MDBRow>
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
  card: {
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    height: '700px',
    cursor: 'pointer',
  },
  cardContainer: {
    transition: 'transform 0.2s',
    position: 'relative', // Permite el uso de transformaciones
  },
  cardImage: {
    height: '550px',
    objectFit: 'cover',
    width: '100%',
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px',
  },
};

export default CardsSection;
