import React from 'react';
import {
  MDBCarousel, MDBCarouselItem, MDBCarouselCaption
} from 'mdb-react-ui-kit';


const Carrusel = () =>{
    return(
        <div>
            <div style={styles.hero}>
      <MDBCarousel showIndicators showControls fade>
      <MDBCarouselItem itemId={1}>
        <img src='https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg' className='d-block w-100' alt='...' />
        <MDBCarouselCaption>
          <h5>First slide label</h5>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </MDBCarouselCaption>
      </MDBCarouselItem>

      <MDBCarouselItem itemId={2}>
        <img src='https://mdbootstrap.com/img/Photos/Slides/img%20(22).jpg' className='d-block w-100' alt='...' />
        <MDBCarouselCaption>
          <h5>Second slide label</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </MDBCarouselCaption>
      </MDBCarouselItem>

      <MDBCarouselItem itemId={3}>
        <img src='https://mdbootstrap.com/img/Photos/Slides/img%20(23).jpg' className='d-block w-100' alt='...' />
        <MDBCarouselCaption>
          <h5>Third slide label</h5>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </MDBCarouselCaption>
      </MDBCarouselItem>
    </MDBCarousel>
      </div>

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
export default Carrusel;