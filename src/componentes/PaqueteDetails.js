import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, getDatabase,update } from 'firebase/database';
import { database, auth } from '../firebase';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importa los estilos
import { logEvent } from 'firebase/analytics'; 
import { analytics } from '../firebase'; 
import ReactGA from 'react-ga'; 

function PaqueteDetails({}) {
  const { id } = useParams();
  const [paquete, setPaquete] = useState(null);
  const [productos, setProductos] = useState({});
  const [expandedDescription, setExpandedDescription] = useState(false); // Estado para manejar la descripción
  const [expandedProducts, setExpandedProducts] = useState(false); // Estado para manejar los nombres de los productos
  const [activeItem, setActiveItem] = useState(0); // Estado para el item activo
  const [carrito, setCarrito] = useState([]);
  const pesoMaximo = 9000;
  const [, setCarritoPeso] = useState(0);
  const [paquetesDatabase, setPaquetesDatabase] = useState([]);

  const [userRating, setUserRating] = useState(0);
  const [userId, setUserId] = useState(null);
  const [, setUserTotalRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const ratingsRef = ref(database, `productos/${id}/calificaciones/${userId}/rating`);
      const getUserRating = () => {
        onValue(ratingsRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserRating(snapshot.val());
          } else {
            setUserRating(0);
          }
        });
      };
      getUserRating();
    }
  }, [id, userId]);

  useEffect(() => {
    const getUserTotalRating = () => {
      const ratingsRef = ref(database, `productos/${id}/calificaciones`);
      let totalRating = 0;
      let totalRatingsCount = 0;
      onValue(ratingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const calificaciones = snapshot.val();
          totalRatingsCount = Object.keys(calificaciones).length;
          totalRating = Object.values(calificaciones).reduce((acc, usuario) => {
            return acc + usuario.rating;
          }, 0);
          setUserTotalRating(totalRating);
          setAverageRating(totalRating / totalRatingsCount);
        } else {
          setUserTotalRating(0);
          setAverageRating(0);
        }
      });
    };
    getUserTotalRating();
  }, [id]);

  const handleRatingChange = async (stars) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = currentUser.uid;

      const ratingsRef = ref(database, `productos/${id}/calificaciones/${userId}`);

      try {
        await update(ratingsRef, { rating: stars });
        setUserRating(stars);
      } catch (error) {
        console.error('Error al actualizar la calificación:', error.message);
      }
    }
  };

///////
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

  /////Videos
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

  ///ver mas descripcion
  const toggleDescription = () => {
    setExpandedDescription(!expandedDescription);
  };
  ///ver mas de productos
  const toggleProducts = () => {
    setExpandedProducts(!expandedProducts);
  };


 useEffect(() => {
  const getPaqueteDetails = (snapshot) => {
    try {
      if (snapshot.exists()) {
        const paqueteData = snapshot.val();
        setPaquete(paqueteData);
      } else {
        console.error('Datos del paquete no encontrados');
      }
    } catch (error) {
      console.error('Error al obtener detalles del paquete:', error);
    }
  };

  const databaseInstance = getDatabase();
  const paqueteDatabaseRef = ref(databaseInstance, `paquetes/${id}`);
  const paqueteListener = onValue(paqueteDatabaseRef, getPaqueteDetails);

  return () => {
    paqueteListener();
  };
}, [id]);

////////////////////////////////////////////
// Efecto para cargar paquetes y carrito desde localStorage y la base de datos
useEffect(() => {
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
  const pesoGuardado = JSON.parse(localStorage.getItem('carritoPeso')) || 0;
  setCarrito(carritoGuardado);
  setCarritoPeso(pesoGuardado);

  const databaseRef = ref(database, 'paquetes'); // Cambié 'productos' a 'paquetes'
  onValue(databaseRef, (snapshot) => {
    const paquetes = [];
    snapshot.forEach((childSnapshot) => {
      const paquete = {
        id: childSnapshot.key,
        ...childSnapshot.val(),
      };
      paquetes.push(paquete);
    });
    setPaquetesDatabase(paquetes);
  });

}, []);

// Función para guardar el carrito en localStorage
const guardarCarritoEnLocalStorage = (carrito) => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
   
  // Obtener los detalles del paquete
  const paqueteDetalles = paquete; // Asumiendo que 'paquete' tiene los datos que necesitas

  // Mostrar los detalles en la consola
  if (paqueteDetalles) {
    console.log('Detalles del paquete guardado en localStorage:');
    console.log('Nombre:', paqueteDetalles.nombre);
    console.log('Precio:', paqueteDetalles.precio);
    console.log('Peso:', paqueteDetalles.peso);
    console.log('ID:', paqueteDetalles.id);
    console.log('Productos:', paqueteDetalles.productos);
  }
  console.log('Carrito guardado en localStorage:', JSON.parse(localStorage.getItem('carrito')));
};

const calcularPesoActualCarrito = () => {
  const totalPeso = carrito.reduce((totalPeso, itemId) => {
    const itemCarrito = paquetesDatabase.find((item) => item.id === itemId);
    const peso = itemCarrito ? Number(itemCarrito.peso) : 0; // Convertir a número
    console.log('ID del paquete:', itemId, 'Peso:', peso);
    return totalPeso + peso;
  }, 0);
  console.log('Peso total del carrito:', totalPeso);
  return totalPeso;
};

const anyadirPaqueteAlCarrito = (paqueteid, pesoPaquete) => {
  console.log('Agregando paquete con ID:', paqueteid, 'y peso:', pesoPaquete);
  const pesoEnGramos = Number(pesoPaquete); // Asegúrate de que sea un número

  const pesoActual = calcularPesoActualCarrito();
  console.log('Peso actual:', pesoActual, 'Peso a añadir:', pesoEnGramos);
  console.log('Peso máximo permitido:', pesoMaximo);

  if (pesoActual + pesoEnGramos <= pesoMaximo) {
    const nuevoCarrito = [...carrito, paqueteid];
    setCarrito(nuevoCarrito);
    guardarCarritoEnLocalStorage(nuevoCarrito);

    const pesoCarritoActualizado = pesoActual + pesoEnGramos;
    setCarritoPeso(pesoCarritoActualizado);
    localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));

    logEvent(analytics, 'agregar_al_carrito', {
      paqueteid,
    });
    ReactGA.event({
      category: 'Interacción',
      action: 'Agregar al Carrito',
      label: 'Paquete: ' + paqueteid,
    });
  } else {
    alert('Has alcanzado el límite de peso en el carrito (9000 gramos)');
  }
};




  ///Boton del carrito

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
              src={paquete.imagenUrl}  // Imagen del paquete
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
    src={paquete.imagenUrl}
    alt={paquete.nombre}
    onClick={() => setActiveItem(0)} // La imagen del paquete es el primer item
    style={{
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
    anyadirPaqueteAlCarrito(paquete?.id, paquete?.peso); 
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
