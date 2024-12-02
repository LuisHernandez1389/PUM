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
  MDBBtn
} from 'mdb-react-ui-kit';

const CardVideo = () => {
  return (
    <MDBContainer className="mt-5">
      <MDBRow className="g-4">
        {/* Card for Image */}
        <MDBCol md="6">
          <MDBCard className="shadow-0 border-radius-10">
            <MDBRow className="g-0">
              {/* Image Section */}
              <MDBCol md="6">
                <MDBCardImage 
                  src="https://mdbootstrap.com/wp-content/uploads/2020/06/vertical.webp" 
                  alt="Image"
                  fluid
                  className="rounded-start"
                />
              </MDBCol>

              {/* Text Section */}
              <MDBCol md="6">
                <MDBCardBody>
                  <MDBCardTitle className="h5">Card Title</MDBCardTitle>
                  <MDBCardText>
                    This is a wider card with supporting text below as a natural lead-in to additional content. This
                    content is a little bit longer.
                  </MDBCardText>
                  <MDBCardText>
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </MDBCardText>
                  <MDBBtn color="primary" href="#">
                    Read More
                  </MDBBtn>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>

        {/* Card for Video */}
        <MDBCol md="6">
          <MDBCard className="shadow-0 border-radius-10">
            <div className="position-relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe 
                src="https://firebasestorage.googleapis.com/v0/b/pirotecniacq.appspot.com/o/2618032-uhd_3840_2160_24fps.mp4?alt=media&token=2cccffed-56a7-4c3f-b364-e2335748ee8a" 
                title="Video"
                className="position-absolute top-0 left-0 w-100 h-100 border-0"
                allowFullScreen
              ></iframe>
            </div>
            <MDBCardBody>
              <MDBCardTitle className="h5">Video Card Title</MDBCardTitle>
              <MDBCardText>
                <small className="text-muted">Last updated 5 mins ago</small>
              </MDBCardText>
              <MDBBtn color="primary" href="#">
                Watch Now
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default CardVideo;
