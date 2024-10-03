import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTypography,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
  MDBCarousel, MDBCarouselItem,
} from 'mdb-react-ui-kit';

const MasVendido = () =>{
    return(
        <div>
             <MDBContainer className='mt-5'>
  <MDBTypography tag="h2" className="text-center mb-4" style={styles.sectionTitle}>
    Mas vendido
  </MDBTypography>
  
  <MDBCarousel showControls showIndicators>
    <MDBCarouselItem className='active'>
      <MDBRow className='justify-content-center'>
        {/* Tarjeta 1 */}
        <MDBCol md='3'>
          <MDBCard>
            <MDBCardImage 
              src='https://mdbootstrap.com/img/new/standard/nature/182.webp' 
              alt='...' 
              position='top' 
              style={{ height: '200px', objectFit: 'cover' }}  
            />
            <MDBCardBody>
              <MDBCardText>
                Some quick example text to build on the card title.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Tarjeta 2 */}
        <MDBCol md='3'>
          <MDBCard>
            <MDBCardImage 
              src='https://mdbootstrap.com/img/new/standard/nature/183.webp' 
              alt='...' 
              position='top' 
              style={{ height: '200px', objectFit: 'cover' }} 
            />
            <MDBCardBody>
              <MDBCardText>
                Another example text to make up the bulk of the.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Tarjeta 3 */}
        <MDBCol md='3'>
          <MDBCard>
            <MDBCardImage 
              src='https://mdbootstrap.com/img/new/standard/nature/184.webp' 
              alt='...' 
              position='top' 
              style={{ height: '200px', objectFit: 'cover' }} 
            />
            <MDBCardBody>
              <MDBCardText>
                A third example text for the bulk of the card's content.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Tarjeta 4 */}
        <MDBCol md='3'>
          <MDBCard>
            <MDBCardImage 
              src='https://mdbootstrap.com/img/new/standard/nature/185.webp' 
              alt='...' 
              position='top' 
              style={{ height: '200px', objectFit: 'cover' }} 
            />
            <MDBCardBody>
              <MDBCardText>
                Fourth card example text for bulk content.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBCarouselItem>

    <MDBCarouselItem>
      <MDBRow className='justify-content-center'>
        {/* Tarjeta 5 */}
        <MDBCol md='3'>
          <MDBCard>
            <MDBCardImage 
              src='https://mdbootstrap.com/img/new/standard/nature/186.webp' 
              alt='...' 
              position='top' 
              style={{ height: '200px', objectFit: 'cover' }} 
            />
            <MDBCardBody>
              <MDBCardText>
                Fifth card example text for bulk content.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Tarjeta 6 */}
        <MDBCol md='3'>
          <MDBCard>
            <MDBCardImage 
              src='https://mdbootstrap.com/img/new/standard/nature/187.webp' 
              alt='...' 
              position='top' 
              style={{ height: '200px', objectFit: 'cover' }} 
            />
            <MDBCardBody>
              <MDBCardText>
                Sixth card example text for bulk content.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Tarjeta 7 */}
        <MDBCol md='3'>
          <MDBCard>
            <MDBCardImage 
              src='https://mdbootstrap.com/img/new/standard/nature/188.webp' 
              alt='...' 
              position='top' 
              style={{ height: '200px', objectFit: 'cover' }} 
            />
            <MDBCardBody>
              <MDBCardText>
                Seventh card example text for bulk content.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Tarjeta 8 */}
        <MDBCol md='3'>
          <MDBCard>
            <MDBCardImage 
              src='https://mdbootstrap.com/img/new/standard/nature/189.webp' 
              alt='...' 
              position='top' 
              style={{ height: '200px', objectFit: 'cover' }} 
            />
            <MDBCardBody>
              <MDBCardText>
                Eighth card example text for bulk content.
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBCarouselItem>
  </MDBCarousel>
</MDBContainer>
        </div>
    )
}
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
export default MasVendido;