  import React, { useState, useEffect } from 'react';
  import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBTypography,
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBCardText,
    MDBCarousel, 
    MDBCarouselItem,
    MDBBtn
  } from 'mdb-react-ui-kit';
  import { getDatabase, ref, get } from 'firebase/database';

  const MasVendido = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
      const fetchProductos = async () => {
        const db = getDatabase();
        const productosRef = ref(db, 'productos');
        const snapshot = await get(productosRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const productosArray = Object.values(data);
          const productosAleatorios = productosArray.sort(() => 0.5 - Math.random()).slice(0, 8);
          setProductos(productosAleatorios);
        }
      };

      fetchProductos();
    }, []);

    return (
      <div style={styles.pageWrapper}>
        <MDBContainer className='mt-5'>
          <MDBTypography tag="h2" className="text-center mb-4" style={styles.sectionTitle}>
            Más Vendido
          </MDBTypography>

          {/* Quitar las flechas del carrusel */}
          <MDBCarousel showIndicators>
            {Array.from({ length: Math.ceil(productos.length / 4) }, (_, i) => (
              <MDBCarouselItem className={i === 0 ? 'active' : ''} key={i}>
                <MDBRow className='justify-content-center'>
                  {productos.slice(i * 4, i * 4 + 4).map((producto, index) => (
                    <MDBCol md='3' key={index} className='mb-4'>
                      <MDBCard style={styles.card} className="hover-shadow">
                        <MDBCardImage
                          src={producto.imagenUrl}
                          alt={producto.nombre}
                          position='top'
                          style={styles.cardImage}
                        />
                        <MDBCardBody>
                          <MDBCardText className='text-center'>
                            {producto.nombre}
                          </MDBCardText>
                          <div className='text-center'>
                            <MDBBtn 
                              style={styles.cardButton}
                              href={`producto/${producto.id}`}>
                              Comprar
                            </MDBBtn>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  ))}
                </MDBRow>
              </MDBCarouselItem>
            ))}
          </MDBCarousel>
        </MDBContainer>
      </div>
    );
  };

  const styles = {
    pageWrapper: {
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif',
      paddingBottom: '50px'
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
      height: '200px',
      objectFit: 'cover',
    },
    cardButton: {
      backgroundColor: '#007bff',
      color: 'white',
      borderRadius: '30px',
    }
  };

  export default MasVendido;
