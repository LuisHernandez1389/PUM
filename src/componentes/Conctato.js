import React from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardHeader,
  MDBCol,
  MDBCardBody,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
  MDBTabsContent,
  MDBIcon,
  MDBCheckbox,
  MDBInput,
  MDBBtn,
  MDBTextArea,
} from 'mdb-react-ui-kit';

function Contacto () {
  return (
    <MDBContainer fluid className='mt-5'>
      <section className='text-center'>
        <div
          className='p-5 bg-image'
          style={{ backgroundImage: "url('https://mdbootstrap.com/img/new/textures/full/171.jpg')", height: '300px' }}
        ></div>

        <div
          className='card mx-4 mx-md-5 shadow-5-strong'
          style={{ marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' }}
        >
          <div className='card-body py-5 px-md-5'>
            <MDBRow className='mb-5'>
              <MDBCol lg='3' md='6' className='mb-5 mb-lg-0 position-relative'>
                <MDBIcon icon='globe-americas' size='3x' className='text-primary mb-4' />
                <h6 className='fw-normal mb-0'>Unites States</h6>
                <div className='vr vr-blurry position-absolute my-0 h-100 d-none d-md-block top-0 end-0'></div>
              </MDBCol>

              <MDBCol lg='3' md='6' className='mb-5 mb-lg-0 position-relative'>
                <MDBIcon icon='map-marker-alt' size='3x' className='text-primary mb-4' />
                <h6 className='fw-normal mb-0'>New York, 94126</h6>
                <div className='vr vr-blurry position-absolute my-0 h-100 d-none d-md-block top-0 end-0'></div>
              </MDBCol>

              <MDBCol lg='3' md='6' className='mb-4 mb-lg-0 position-relative'>
                <MDBIcon icon='phone' size='3x' className='text-primary mb-4' />
                <h6 className='fw-normal mb-0'>+ 01 234 567 89</h6>
                <div className='vr vr-blurry position-absolute my-0 h-100 d-none d-md-block top-0 end-0'></div>
              </MDBCol>

              <MDBCol lg='3' md='6' className='mb-4 mb-lg-0 position-relative'>
                <MDBIcon icon='hand-holding-usd' size='3x' className='text-primary mb-4' />
                <h6 className='fw-normal mb-0'>Tax ID: 273 384</h6>
              </MDBCol>
            </MDBRow>

            <MDBRow class='d-flex justify-content-center'>
              <MDBCol lg='6' class='col-lg-6'>
                <form>
                  <MDBInput className='mb-4' id='password2' label='Name' />
                  <MDBInput className='mb-4' type='email' id='email2' label='Email address' />
                  <MDBTextArea label='Message' rows={4} className='mb-4' />

                  <MDBRow className='mb-4 justify-content-center'>
                    <MDBCol md='6' className='d-flex justify-content-center'>
                      <MDBCheckbox className=' mb-3 mb-md-0' defaultChecked label=' Send me a copy of this message' />
                    </MDBCol>
                  </MDBRow>

                  <MDBBtn type='submit' block className='mb-4'>
                    Send
                  </MDBBtn>
                </form>
              </MDBCol>
            </MDBRow>
          </div>
        </div>
      </section>
    </MDBContainer>
  );
}

export default Contacto;
