import React from 'react';

const SearchProductDetails = ({ producto, onClose }) => {
  return (
    <div className="product-details text-center d-flex flex-column align-items-center">
      <img style={{width:"150px", height:"150px"  }} src={producto.imagenUrl} alt={producto.nombre} />
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: {producto.precio} $</p>

    </div>
  );
};

export default SearchProductDetails;