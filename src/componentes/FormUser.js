import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onValue, ref, getDatabase, push, update, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../firebase';
import "../estilos/ProductDetails.css";

const ProductDetails = ({ producto, onClose, currentUser }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);
  const userId = currentUser ? currentUser.uid : null; // Obtener el UID del usuario actual

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

    const checkUserRating = async () => {
      if (userId) { // Verificar si hay un usuario autenticado
        const ratingsRef = ref(database, `productos/${id}/calificaciones`);
        const userRatingQuery = query(ratingsRef, orderByChild('userId'), equalTo(userId));
        const snapshot = await get(userRatingQuery);
        if (snapshot.exists()) {
          const userRatingData = snapshot.val();
          setUserRating(userRatingData.rating);
          setUserHasRated(true);
        }
      }
    };

    checkUserRating();

    return () => {
      productListener();
    };
  }, [id, userId]);

  const handleRatingChange = (stars) => {
    if (!userHasRated && userId) {
      setUserRating(stars);

      const ratingsRef = ref(database, `productos/${id}/calificaciones`);
      const newRatingRef = push(ratingsRef);
      update(newRatingRef, { rating: stars, userId: userId });
      setUserHasRated(true);
    }
  };

  if (!product) {
    return <p>Cargando...</p>;
  }
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
                        color: star <= userRating ? 'gold' : 'gray',
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

    </>
  );

};

export default ProductDetails;
