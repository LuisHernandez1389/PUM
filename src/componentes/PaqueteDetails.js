import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa los estilos

function PaqueteDetails() {
  const { id } = useParams();
  const [paquete, setPaquete] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [productos, setProductos] = useState({});
  const [expandedDescription, setExpandedDescription] = useState(false); // Estado para manejar la descripción
  const [expandedProducts, setExpandedProducts] = useState(false); // Estado para manejar los nombres de los productos
  const [activeItem, setActiveItem] = useState(0); // Estado para el item activo
  
  useEffect(() => {
    const paqueteRef = ref(database, `paquetes/${id}`);
    const paqueteUnsubscribe = onValue(paqueteRef, (snapshot) => {
      if (snapshot.exists()) {
        setPaquete({ id, ...snapshot.val() });
      } else {
        setPaquete(null);
      }
    });

    const productosRef = ref(database, 'productos');
    const productosUnsubscribe = onValue(productosRef, (snapshot) => {
      if (snapshot.exists()) {
        setProductos(snapshot.val());
      }
    });

    return () => {
      paqueteUnsubscribe();
      productosUnsubscribe();
    };
  }, [id]);

   // Efecto para cambiar automáticamente las imágenes del carrusel
   useEffect(() => {
    const interval = setInterval(() => {
      if (paquete && paquete.productos) {
        setActiveItem((prevActiveItem) => (prevActiveItem + 1) % paquete.productos.length);
      }
    }, 3000); // Cambia de imagen cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [paquete]);

  const handleRatingChange = (rating) => {
    setUserRating(rating);
  };

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('facebook.com/watch')) {
      const videoId = url.split('v=')[1];
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/${videoId}/`;
    } else if (url.includes('drive.google.com')) {
      return url.replace('/view', '/preview');
    }
    return url;
  };

  const toggleDescription = () => {
    setExpandedDescription(!expandedDescription);
  };

  const toggleProducts = () => {
    setExpandedProducts(!expandedProducts);
  };

  if (!paquete) return <div>Cargando...</div>;

  return (
    <div className="container card product-general mt-5">
    <div className="row">
      <div className="col-12 col-md-8">
        {/* Carrusel con react-responsive-carousel */}
        <Carousel
          selectedItem={activeItem}
          onChange={(index) => setActiveItem(index)}
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          infiniteLoop
          autoPlay
          interval={3000}
          transitionTime={500}
        >
          {/* Mostrar primero la imagen del paquete */}
          <div key="paquete">
            <img
              src={paquete.imagenURL}  // Imagen del paquete
              alt={paquete.nombre}      // Nombre del paquete
              className="d-block w-100"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>

          {/* Mostrar las imágenes de los productos */}
          {paquete.productos && paquete.productos.map((productoId, index) => {
            const producto = productos[productoId];
            return (
              producto && (
                <div key={index}>
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className="d-block w-100"
                    style={{ height: '400px', objectFit: 'cover' }}
                  />
                </div>
              )
            );
          })}
        </Carousel>

        {/* Imágenes pequeñas para la navegación manual */}
<div
  className="small-images-container"
  style={{
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
    overflowX: 'auto', // Hacer que el contenedor sea desplazable en dispositivos móviles
    paddingBottom: '10px', // Espacio inferior para evitar cortar imágenes
  }}
>
  {/* Miniatura de la imagen del paquete */}
  <img
    key="paquete-thumb"
    src={paquete.imagenURL}
    alt={paquete.nombre}
    onClick={() => setActiveItem(0)} // La imagen del paquete es el primer item
    style={{
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '4px',
      cursor: 'pointer',
      border: activeItem === 0 ? '2px solid blue' : 'none',
      // Hacer que el tamaño cambie según el ancho de la pantalla
      width: window.innerWidth < 768 ? '50px' : '60px',
      height: window.innerWidth < 768 ? '50px' : '60px',
    }}
  />

  {/* Miniaturas de las imágenes de los productos */}
  {paquete.productos &&
    paquete.productos.map((productoId, index) => {
      const producto = productos[productoId];
      return (
        producto && (
          <img
            key={index}
            src={producto.imagenUrl}
            alt={producto.nombre}
            onClick={() => setActiveItem(index + 1)} // +1 porque el primer item es la imagen del paquete
            style={{
              objectFit: 'cover',
              borderRadius: '4px',
              cursor: 'pointer',
              border: activeItem === index + 1 ? '2px solid blue' : 'none',
              // Cambiar tamaño de las miniaturas en pantallas más pequeñas
              width: window.innerWidth < 768 ? '50px' : '60px',
              height: window.innerWidth < 768 ? '50px' : '60px',
            }}
          />
        )
      );
    })}
</div>


        </div>

        

        <div className="col-12 col-md-4 container-details" style={{ padding: '1%' }}>
          <div
            className="product-details-display form-control"
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <h2 className="mb-3">{paquete.nombre}</h2>

            <div className="star d-flex justify-content-center small text-warning mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  style={{
                    cursor: 'pointer',
                    color: star <= userRating ? 'gold' : 'gray',
                    fontSize: '24px',
                  }}
                >
                  &#9733;
                </span>
              ))}
            </div>

            <hr className="w-100" />
            <h4>$ {paquete.precio}</h4>
            <hr className="w-100" />
            <p>{expandedDescription ? paquete.descripcion : `${paquete.descripcion.substring(0, 100)}...`}</p>
            <button onClick={toggleDescription} className="btn btn-link">
              {expandedDescription ? 'Ver menos' : 'Ver más'}
            </button>
            <hr className="w-100" />

            <div className="package-items-list" style={{ textAlign: 'left', width: '100%' }}>
              <h5>Productos:</h5>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {paquete.productos && (
                  <>
                    {paquete.productos.slice(0, expandedProducts ? paquete.productos.length : 3).map((productoId, index) => {
                      const producto = productos[productoId];
                      return (
                        <li key={index}>{producto ? producto.nombre : 'Producto no encontrado'}</li>
                      );
                    })}
                    {paquete.productos.length > 3 && (
                      <button onClick={toggleProducts} className="btn btn-link">
                        {expandedProducts ? 'Ver menos' : `Ver más (${paquete.productos.length - 3} más)`}
                      </button>
                    )}
                  </>
                )}
              </ul>
            </div>

            <hr className="w-100" />

            <div className="button-add" style={{ width: '100%' }}>
              <button
                className="btn btn-primary d-flex align-items-center justify-content-center m-2"
                onClick={() => {
                  console.log('Añadir al carrito');
                }}
                style={{ borderRadius: '0', width: '100%' }}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      <br />

      {paquete.video && (
        <div className="container card video" style={{ alignItems: 'center', padding: '0' }}>
          <div
            style={{
              position: 'relative',
              width: '70%',
              paddingBottom: '56.25%',
              margin: '0 auto',
            }}
          >
            <iframe
              className="video-product"
              title="video"
              src={getEmbedUrl(paquete.video)}
              frameBorder="0"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '70%',
                borderRadius: '5px',
              }}
            ></iframe>
          </div>
        </div>
      )}

      <br />
    </div>
  );
}

export default PaqueteDetails;
