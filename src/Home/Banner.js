import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdb-react-ui-kit";

const Banner = () => {
  return (
    <MDBContainer className="py-5">
      <MDBRow className="align-items-center">
        {/* Texto del lado izquierdo */}
        <MDBCol md="6" className="text-start">
          <h1 className="fw-bold">Hot Drop</h1>
          <p className="lead mb-4">Fresh delivery of sneakers</p>
          <p>
            Discover new items from Adidas, Nike, Converse and more.
          </p>
          <MDBBtn color="dark" outline>
            DISCOVER NOW &rarr;
          </MDBBtn>
        </MDBCol>

        {/* Imagen del lado derecho */}
        <MDBCol md="6">
          <img
            src="https://via.placeholder.com/600x400" // Reemplaza con la URL de tu imagen
            alt="Hot Drop Sneakers"
            className="img-fluid rounded"
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Banner;
