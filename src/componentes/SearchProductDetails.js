import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebase';
import { get, ref } from 'firebase/database';
const SearchProductDetails = ({ producto, onClose }) => {
  const { id } = useParams(); // Obtenemos el ID del producto de la URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const productRef = ref(database, `productos/${id}`);
        const snapshot = await get(productRef);
    
        if (snapshot.exists()) {
          const productData = snapshot.val();
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
      }
    };

    getProductDetails();
  }, [id]);
  return (
    <div className="product-details text-center d-flex flex-column align-items-center">
      <img style={{width:"150px", height:"150px"  }} src={producto?.imagenUrl} alt={producto?.nombre} />
      <h2>{producto?.nombre}</h2>
      <p>{producto?.descripcion}</p>
      <p>{producto?.cantidad}</p>
      <p>Precio: {producto?.precio} $</p>

    </div>
  );
};

export default SearchProductDetails;