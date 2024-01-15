// BusquedaContext.js
import React, { createContext, useState, useContext } from 'react';
import { database } from '../firebase'; // Importa tu instancia de Firebase

const BusquedaContext = createContext();

export const useBusqueda = () => {
  return useContext(BusquedaContext);
};

export const BusquedaProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term) => {
    setLoading(true);
    try {
      const productsRef = database.ref('/productos'); // Reemplaza 'productos' con la referencia a tu colección en Firebase
      productsRef.orderByChild('nombre').equalTo(term).on('value', (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const results = Object.values(data);
          setSearchResults(results);
          setLoading(false);
        } else {
          setSearchResults([]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error al buscar:', error);
      setLoading(false);
    }
  };

  return (
    <BusquedaContext.Provider value={{ searchTerm, setSearchTerm, searchResults, loading, handleSearch }}>
      {children}
    </BusquedaContext.Provider>
  );
};
