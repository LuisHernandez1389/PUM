import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onValue, ref, getDatabase, update } from 'firebase/database';
import { database, auth } from '../firebase';

const ProductDetails = ({ producto, onClose }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userId, setUserId] = useState(null);
  const [userTotalRating, setUserTotalRating] = useState(0);
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

  useEffect(() => {
    const productRef = ref(database, `productos/${id}`);

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

  ///////////////////////////////////////////////
  //Manejo de VideoUrl por medio de iframe
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
  

  return (
    <>
      <div className="container card product-general mt-5">
        <div className="row">
          <div className="col-md-8">
            <div 
              className="photo-product-details col-md-6" 
              style={{ width: '100%', height: '400px', overflow: 'hidden', borderRadius: '1%' }} // Aumenta la altura aquí
            >
              <img 
                src={product?.imagenUrl} 
                alt={product?.nombre} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </div>
          <div className="col-md-4 container-details" style={{ padding: '1%' }}>
  <div className="product-details-display form-control" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <h2 className="mb-3">{product?.nombre}</h2>

    <div className="star d-flex justify-content-center small text-warning mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRatingChange(star)}
          style={{
            cursor: 'pointer',
            color: (star <= userRating) ? 'gold' : 'gray',
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
      <button className='btn btn-primary w-100 mb-2'>
        Agregar al carrito
      </button>
    </div>
  </div>
</div>
        </div>
      </div>
      <br />
      <div className='container card video' style={{ alignItems: 'center' }}>
        {product?.video && (
          <div>
            <iframe 
              className='video-product' 
              title="video" 
              src={getEmbedUrl(product?.video)} 
              frameBorder="0" 
              allowFullScreen
              style={{ width: '600px', height: '290px', padding: '2%' }} 
            >
            </iframe>
          </div>
        )}
      </div>
  
      <br />
      <div className='container'>
        <div className="card text-center ">
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
                        color: (star <= averageRating) ? 'gold' : 'gray',
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
    </>
  );
  };
  
  export default ProductDetails;
  