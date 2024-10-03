import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,

} from 'mdb-react-ui-kit';

const CardVideo = () =>{
    return(
        <div>
            <MDBContainer>
        
        <MDBRow className='g-0'>
        <MDBCol md='6'>
          <MDBCard style={{ maxWidth: '540px', margin: '20px 0' }}> {/* Tarjeta de imagen */}
            <MDBRow className='g-0'>
              <MDBCol md='6'> {/* Aumenta el ancho de la columna de la imagen */}
                <MDBCardImage 
                  src='https://mdbootstrap.com/wp-content/uploads/2020/06/vertical.webp' 
                  alt='...' 
                  fluid 
                  style={{ height: '100%', objectFit: 'cover' }} // Asegúrate de que la imagen llene el espacio
                />
              </MDBCol>
              <MDBCol md='6'> {/* Aumenta el ancho de la columna del contenido */}
                <MDBCardBody>
                  <MDBCardTitle>Card title</MDBCardTitle>
                  <MDBCardText>
                    This is a wider card with supporting text below as a natural lead-in to additional content. This
                    content is a little bit longer.
                  </MDBCardText>
                  <MDBCardText>
                    <small className='text-muted'>Last updated 3 mins ago</small>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      
          <MDBCol md='6'>
            <MDBCard style={{ maxWidth: '540px', margin: '20px 0' }}> {/* Tarjeta de video */}
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe 
                  src="https://www.youtube.com/embed/HSa_mJmPOXw" 
                  title="YouTube Video" 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: '0'
                  }} 
                  allowFullScreen
                ></iframe>
              </div>
              <MDBCardBody>
                <MDBCardTitle>Video Card Title</MDBCardTitle>
                <MDBCardText>
                  <small className='text-muted'>Last updated 5 mins ago</small>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
        </div>
    )
}
export default CardVideo;