import React from 'react';
import ProductDetails from '../componentes/ProductDetails';

const Modal = ({ isOpen, onClose, selectedProduct }) => {
  if (!isOpen) {

    return null;
  }
  console.log('Modal isOpen:', isOpen);
  console.log('Modal selectedProduct:', selectedProduct);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          Cerrar
        </button>
        <ProductDetails producto={selectedProduct} onClose={onClose} />
      </div>
    </div>
  );
};

export default Modal;
