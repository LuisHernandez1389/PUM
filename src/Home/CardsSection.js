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
  const navigate = useNavigate(); // Hook de React Router para navegar

  const handleCardClick = (category) => {
    navigate(`/${category}`); // Redirige a la página específica según la categoría
  };

  return (
    <div>
      <MDBContainer className="mt-5">
        <MDBTypography tag="h2" className="text-center mb-4" style={styles.sectionTitle}>
          Explora las categorias
        </MDBTypography>
        <MDBRow>
          <MDBCol md="4">
            <MDBCard 
              onClick={() => handleCardClick('luz')} 
              style={styles.card} 
              data-mdb-animation-show-on-load="false" // Agrega la animación aquí
            >
              <MDBCardImage
                src="https://images.pexels.com/photos/19118865/pexels-photo-19118865/free-photo-of-noche-oscuro-explosion-colorido.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="..."
                position="top"
                style={styles.cardImage}
              />
              <MDBCardBody>
                <MDBCardTitle>Luz</MDBCardTitle>
                <MDBCardText>This is yet another card with supporting text.</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard 
              onClick={() => handleCardClick('trueno')} 
              style={styles.card} 
              data-mdb-animation-show-on-load="false" // Agrega la animación aquí
            >
              <MDBCardImage
                src="https://images.pexels.com/photos/13086763/pexels-photo-13086763.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                alt="..."
                position="top"
                style={styles.cardImage}
              />
              <MDBCardBody>
                <MDBCardTitle>Trueno</MDBCardTitle>
                <MDBCardText>This is another wider card with supporting text.</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard 
              onClick={() => handleCardClick('baterias')} 
              style={styles.card} 
              data-mdb-animation-show-on-load="false" // Agrega la animación aquí
            >
              <MDBCardImage
                src="https://images.pexels.com/photos/15512817/pexels-photo-15512817/free-photo-of-reflejo-reflexion-ceremonia-fuegos-artificiales.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="..."
                position="top"
                style={styles.cardImage}
              />
              <MDBCardBody>
                <MDBCardTitle>Baterias</MDBCardTitle>
                <MDBCardText>This is yet another card with supporting text.</MDBCardText>
              </MDBCardBody>
            </MDBCard>
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
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Añade transición suave
    height: '700px', // Altura de la tarjeta
    cursor: 'pointer', // Cambia el cursor al pasar por la tarjeta para indicar que es clicable
    '&:hover': {
      transform: 'scale(1.05)', // Aumenta ligeramente el tamaño de la tarjeta al pasar el ratón
      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)', // Incrementa la sombra al pasar el ratón
    }
  },
  cardImage: {
    height: '550px', // Aumenta la altura de la imagen para que ocupe más espacio
    objectFit: 'cover', // Las imágenes se adaptarán sin perder proporción
    width: '100%', // Asegura que la imagen ocupe todo el ancho del contenedor
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px',
  },
};

export default CardsSection;
