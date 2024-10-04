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
  MDBCardLink,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';

const HPaquetes = () =>{
    return(
        <div>
              <MDBContainer className='mt-5'>
<MDBTypography tag="h2" className="text-center mb-4" style={styles.sectionTitle}>Paquetes</MDBTypography>
  <MDBRow className='g-4'>
    <MDBCol md='4'>
      <MDBCard>
        <MDBCardImage position='top' alt='...' src='https://mdbootstrap.com/img/new/standard/city/062.webp' />
        <MDBCardBody>
          <MDBCardTitle>Card title 1</MDBCardTitle>
          <MDBCardText>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </MDBCardText>
        </MDBCardBody>
        <MDBListGroup flush>
          <MDBListGroupItem>Cras justo odio</MDBListGroupItem>
          <MDBListGroupItem>Dapibus ac facilisis in</MDBListGroupItem>
          <MDBListGroupItem>Vestibulum at eros</MDBListGroupItem>
        </MDBListGroup>
        <MDBCardBody>
          <MDBCardLink href='/'>Card link</MDBCardLink>
          <MDBCardLink href='/'>Card link</MDBCardLink>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>

    <MDBCol md='4'>
      <MDBCard>
        <MDBCardImage position='top' alt='...' src='https://mdbootstrap.com/img/new/standard/city/062.webp' />
        <MDBCardBody>
          <MDBCardTitle>Card title 2</MDBCardTitle>
          <MDBCardText>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </MDBCardText>
        </MDBCardBody>
        <MDBListGroup flush>
          <MDBListGroupItem>Cras justo odio</MDBListGroupItem>
          <MDBListGroupItem>Dapibus ac facilisis in</MDBListGroupItem>
          <MDBListGroupItem>Vestibulum at eros</MDBListGroupItem>
        </MDBListGroup>
        <MDBCardBody>
          <MDBCardLink href='/'>Card link</MDBCardLink>
          <MDBCardLink href='/'>Card link</MDBCardLink>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>

    <MDBCol md='4'>
      <MDBCard>
        <MDBCardImage position='top' alt='...' src='https://mdbootstrap.com/img/new/standard/city/062.webp' />
        <MDBCardBody>
          <MDBCardTitle>Card title 3</MDBCardTitle>
          <MDBCardText>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </MDBCardText>
        </MDBCardBody>
        <MDBListGroup flush>
          <MDBListGroupItem>Cras justo odio</MDBListGroupItem>
          <MDBListGroupItem>Dapibus ac facilisis in</MDBListGroupItem>
          <MDBListGroupItem>Vestibulum at eros</MDBListGroupItem>
        </MDBListGroup>
        <MDBCardBody>
          <MDBCardLink href='/'>Card link</MDBCardLink>
          <MDBCardLink href='/'>Card link</MDBCardLink>
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
export default HPaquetes;