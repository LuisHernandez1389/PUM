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
const CardsSection = () =>{
    return(
        <div>
            <MDBContainer className='mt-5'>
       <MDBTypography tag="h2" className="text-center mb-4" style={styles.sectionTitle}>Explora las categorias</MDBTypography>
        <MDBRow>
          <MDBCol md='4'>
            <MDBCard>
              <MDBCardImage src='https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp' alt='...' position='top' />
              <MDBCardBody>
                <MDBCardTitle>Card title 1</MDBCardTitle>
                <MDBCardText>This is yet another card with supporting text.</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md='4'>
            <MDBCard>
              <MDBCardImage src='https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp' alt='...' position='top' />
              <MDBCardBody>
                <MDBCardTitle>Card title 2</MDBCardTitle>
                <MDBCardText>This is another wider card with supporting text.</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md='4'>
            <MDBCard>
              <MDBCardImage src='https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp' alt='...' position='top' />
              <MDBCardBody>
                <MDBCardTitle>Card title 3</MDBCardTitle>
                <MDBCardText>This is yet another card with supporting text.</MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
        </div>
    )
}
// Estilos personalizados para darle un diseño más moderno y elegante
const styles = {
    pageWrapper: {
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif',
    },
    sectionTitle: {
      fontSize: '36px',
      fontWeight: '600',
      color: '#343a40',
      textTransform: 'uppercase',
    },
    card: {
      borderRadius: '15px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s',
    },
    cardImage: {
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
    },
    cardButton: {
      backgroundColor: '#ff4500',
      borderRadius: '30px',
    },
   
  };
export default CardsSection;