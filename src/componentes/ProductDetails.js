import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onValue, ref, getDatabase, update } from 'firebase/database';
import { database, auth } from '../firebase';
import { logEvent } from 'firebase/analytics'; 
import { analytics } from '../firebase'; 
import ReactGA from 'react-ga'; 


const ProductDetails = ({ producto, onClose }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userId, setUserId] = useState(null);
  const [, setUserTotalRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [carrito, setCarrito] = useState([]);
  const pesoMaximo = 9000;
  const [, setCarritoPeso] = useState(0);
  const [productosDatabase, setProductosDatabase] = useState([]);

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

  useEffect(() => {
    const getProductDetails = (snapshot) => {
      try {
        if (snapshot.exists()) {
          const productData = snapshot.val();
          setProduct(productData);
        } else {
          console.error('Datos del producto no encontrados');
        }
      } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
      }
    };

    const databaseInstance = getDatabase();
    const productDatabaseRef = ref(databaseInstance, `productos/${id}`);
    const productListener = onValue(productDatabaseRef, getProductDetails);

    return () => {
      productListener();
    };
  }, [id]);

  // Manejo de VideoUrl por medio de iframe
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch')) {
      return url.replace('watch?v=', 'embed/');
    } else if (url.includes('facebook.com/watch')) {
      const videoId = url.split('v=')[1];
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/facebook/videos/${videoId}/`;
    } else if (url.includes('drive.google.com')) {
      return url.replace('/view', '/preview');
    }
    return url; // Retorna la URL sin cambios si no es de esos servicios
  };
 
  // Efecto para cargar productos y carrito desde localStorage y la base de datos
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    const pesoGuardado = JSON.parse(localStorage.getItem('carritoPeso')) || 0;
    setCarrito(carritoGuardado);
    setCarritoPeso(pesoGuardado);

    const databaseRef = ref(database, 'productos');
    onValue(databaseRef, (snapshot) => {
      const productos = [];
      snapshot.forEach((childSnapshot) => {
        const producto = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        productos.push(producto);
      });
      setProductosDatabase(productos);
    });

  }, []);
// Función para guardar el carrito en localStorage
const guardarCarritoEnLocalStorage = (carrito) => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

// Función para calcular el peso actual del carrito
const pesoActualCarrito = carrito.reduce((totalPeso, itemId) => {
  const itemCarrito = productosDatabase.find((item) => item.id === itemId);

  if (itemCarrito) {
    return totalPeso + itemCarrito.peso;
  } else {
    return totalPeso;
  }
}, 0);
 // Función para agregar un producto al carrito
 const anyadirProductoAlCarrito = (productoId, pesoProducto) => {
  const pesoEnGramos = pesoProducto;

  if (pesoActualCarrito + pesoEnGramos <= pesoMaximo) {
    const nuevoCarrito = [...carrito, productoId];
    setCarrito(nuevoCarrito);
    guardarCarritoEnLocalStorage(nuevoCarrito);

    const pesoCarritoActualizado = pesoActualCarrito + pesoEnGramos;
    setCarritoPeso(pesoCarritoActualizado);
    localStorage.setItem('carritoPeso', JSON.stringify(pesoCarritoActualizado));
    logEvent(analytics, 'agregar_al_carrito', {
      productoId,
    });
    ReactGA.event({
      category: 'Interacción',
      action: 'Agregar al Carrito',
      label: 'Producto: ' + productoId,
    });
    showToast(); // Mostrar toast después de añadir al carrito
  } else {
    alert('Has alcanzado el límite de peso en el carrito (9000 gramos)');
  }
};
  // Función para mostrar el toast
  const showToast = () => {
    const toastElement = document.getElementById('myToast');
    if (toastElement) {
      const bootstrapToast = new window.bootstrap.Toast(toastElement);
      bootstrapToast.show();
    } else {
      console.error("El elemento 'myToast' no existe en el DOM");
    }
  };

  return (
    <>
      <div className="container card product-general mt-5">
        <div className="row">
          <div className="col-12 col-md-8">
            <div
              className="photo-product-details"
              style={{
                width: '100%',
                height: '400px', // Mantener altura para computadoras
                overflow: 'hidden',
                borderRadius: '1%',
              }}
            >
              <img
                src={product?.imagenUrl}
                alt={product?.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
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
              <h2 className="mb-3">{product?.nombre}</h2>

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
              <h4>$ {product?.precio}</h4>
              <hr className="w-100" />
              <p>{product?.descripcion}</p>
              <hr className="w-100" />

              <div className='button-add' style={{ width: '100%' }}>
              <button
    className="btn btn-primary d-flex align-items-center justify-content-center m-2"
    onClick={() => {
      anyadirProductoAlCarrito(product?.id, product?.peso); // Aquí debes usar "product" en lugar de "info"
      showToast();
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
        <div className='container card video' style={{ alignItems: 'center', padding: '0' }}>
          {product?.video && (
            <div style={{ position: 'relative', width: '70%', paddingBottom: '56.25%', margin: '0 auto' /* Centra el contenedor */ }}>
              <iframe
                className='video-product'
                title="video"
                src={getEmbedUrl(product?.video)}
                frameBorder="0"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '70%',
                  borderRadius: '5px', // Bordes redondeados
                }}
              ></iframe>
            </div>
          )}
        </div>
        <br />
        <div className='container'>
          <div className="card text-center">
            <div className="card-header">
              <ul className="nav nav-pills card-header-pills">
                <li className="nav-item">
                  <button className="nav-link bg-primary" href="#">Active</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link bg-primary" href="#">Link</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link bg-primary" aria-disabled="true">Disabled</button>
                </li>
              </ul>
            </div>
            <div className="card-body text-dark">
              <h5 className="card-title">Special title treatment</h5>
              <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>

              <div className="row">
                <div className="col-sm">
                  <h1>{averageRating}</h1>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= averageRating ? 'gold' : 'gray',
                          fontSize: '24px',
                        }}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-sm">
                  <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar w-75"></div>
                  </div>
                </div>
                <div className="col-sm">col-sm</div>
              </div>
            </div>
          </div>
        </div>
         {/* Toast Notification */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="myToast" className="toast fade" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Producto añadido</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            El producto se ha añadido al carrito correctamente.
          </div>
          </div>
          </div>
      </div>
    </>
  );

};

export default ProductDetails;
