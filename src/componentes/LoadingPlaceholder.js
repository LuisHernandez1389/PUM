import React from 'react';

function LoadingPlaceholder() {

  return (
    <div>
      <br /><br />      <div className="loading-page d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingPlaceholder;
