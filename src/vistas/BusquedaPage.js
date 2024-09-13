// BúsquedaPage.js
import React, { useState, useEffect } from 'react';
import { database } from '../firebase'; // Asegúrate de importar tu instancia de Firebase

const BusquedaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const productsRef = database.ref('productos'); // Reemplaza 'productos' con la referencia a tu colección en Firebase
        const snapshot = await productsRef.orderByChild('nombre').equalTo(searchTerm).once('value');

        if (snapshot.exists()) {
          const data = snapshot.val();
          const results = Object.values(data);
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error al buscar:', error);
      }
    }

    fetchData();
  }, [searchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      
      <div>
        {/* Mostrar los resultados de la búsqueda */}
        {searchResults.map((product) => (
          <div key={product.id}>
            <h3>{product.nombre}</h3>
            <p>{product.descripcion}</p>
            {/* Agrega aquí el resto de la información que deseas mostrar */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusquedaPage;
