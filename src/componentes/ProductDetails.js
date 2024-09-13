import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onValue, ref, getDatabase, update } from 'firebase/database';
import { database, auth } from '../firebase';
import "../estilos/ProductDetails.css";
import { Link } from 'react-router-dom';

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

  return (
    <>
      <div className="container card product-general">
        <div className="row">
          <div className="col-md-8">
            <div className="photo-product-details col-md-6">
              <img src={product?.imagenUrl} alt={product?.nombre} />
            </div>
          </div>
          <div className="col-md-4 container-details">
            <div className="product-details-display form-control">
              <h2>{product?.nombre}</h2>

              <div className="star d-flex justify-content-center small text-warning mb-2">
                <div>
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
              </div>

              <div>
                <hr />
                <h4>$ {product?.precio}</h4>
                <hr />
                {product?.descripcion}
                <hr />
              </div>
              <div className='button-add'>
                <button className='btn btn-primary'>Agregar al carrito</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className='container card video'>
        {product?.video && (
          <div>
            <iframe className='video-product' title="video" src={product?.video} frameBorder="0" allowFullScreen></iframe>
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

            <div class="row">
              <div class="col-sm"> <h1>{averageRating} </h1>          <div>
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
              </div></div>
              <div class="col-sm"><div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar w-75"></div>
              </div></div>
              <div class="col-sm">col-sm</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
