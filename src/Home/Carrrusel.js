import React from "react";
import {
  MDBCarousel,
  MDBCarouselItem,
  MDBCarouselCaption,
} from "mdb-react-ui-kit";

import "../estilos/Carrusel.css";

const Carrusel = () => {
  return (
    <div className="carousel-container">
      <MDBCarousel showIndicators showControls fade>
        <MDBCarouselItem itemId={1}>
          <img
            src="https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg"
            className="carousel-image"
            alt="..."
          />
          <MDBCarouselCaption>
            <h5 className="carousel-title">First slide label</h5>
            <p className="carousel-text">
              Nulla vitae elit libero, a pharetra augue mollis interdum.
            </p>
          </MDBCarouselCaption>
        </MDBCarouselItem>

        <MDBCarouselItem itemId={2}>
          <img
            src="https://mdbootstrap.com/img/Photos/Slides/img%20(22).jpg"
            className="carousel-image"
            alt="..."
          />
          <MDBCarouselCaption>
            <h5 className="carousel-title">Second slide label</h5>
            <p className="carousel-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </MDBCarouselCaption>
        </MDBCarouselItem>

        <MDBCarouselItem itemId={3}>
          <img
            src="https://mdbootstrap.com/img/Photos/Slides/img%20(23).jpg"
            className="carousel-image"
            alt="..."
          />
          <MDBCarouselCaption>
            <h5 className="carousel-title">Third slide label</h5>
            <p className="carousel-text">
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </MDBCarouselCaption>
        </MDBCarouselItem>
      </MDBCarousel>
    </div>
  );
};

export default Carrusel;
