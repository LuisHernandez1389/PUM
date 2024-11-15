import React, { useEffect } from 'react';
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
import '../estilos/CardsSection.css';

const CardsSection = () => {
  const navigate = useNavigate();

  const handleCardClick = (category) => {
    navigate(`/${category}`);
  };

  // Usamos IntersectionObserver para las animaciones basadas en el scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          } else {
            entry.target.classList.remove('show');
          }
        });
      },
      { threshold: 0.1 } // Animación cuando el 10% del elemento sea visible
    );

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="hidden section">
      <MDBContainer className="mt-5">
        <MDBTypography tag="h2" className=" sectionTitle text-center mb-4">
          Explora las categorias
        </MDBTypography>
        <MDBRow>
          <MDBCol md="4">
            <div
            className="cardContainer"
              onClick={() => handleCardClick('luz')}
            >
              <MDBCard className="card">
                <MDBCardImage
                  src="https://images.pexels.com/photos/19118865/pexels-photo-19118865/free-photo-of-noche-oscuro-explosion-colorido.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Luz"
                  position="top"
                  className="cardImage"
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
            className="cardContainer"
              onClick={() => handleCardClick('trueno')}
            >
              <MDBCard className="card">
                <MDBCardImage
                  src="https://images.pexels.com/photos/13086763/pexels-photo-13086763.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                  alt="Trueno"
                  position="top"
                  className="cardImage"
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
            className="cardContainer"
              onClick={() => handleCardClick('baterias')}
            >
              <MDBCard className="card">
                <MDBCardImage
                  src="https://images.pexels.com/photos/15512817/pexels-photo-15512817/free-photo-of-reflejo-reflexion-ceremonia-fuegos-artificiales.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Baterias"
                  position="top"
                  className="cardImage"
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

export default CardsSection;
