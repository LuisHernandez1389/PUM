import React from 'react';

const ProductDetails = ({ producto, onClose }) => {
  // Verificar si producto existe y tiene la propiedad imagenUrl
  const imageUrl = producto?.imagenUrl;

  return (
    <div className="product-details text-center d-flex flex-column align-items-center">
      {/* Usar imageUrl en lugar de producto.imagenUrl */}
      <img style={{ width: "150px", height: "150px" }} src={imageUrl} alt={producto?.nombre} />
      <h2>{producto?.nombre}</h2>
      <p>{producto?.descripcion}</p>
      <p>Precio: {producto?.precio} $</p>
      <p className="card-text">Cantidad Disponible: {producto?.cantidad || 'N/A'}</p>

    </div>
  );
};

export default ProductDetails;
