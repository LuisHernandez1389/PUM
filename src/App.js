import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from "./firebase";
import Navbar from './componentes/navbar';
import LoadingPlaceholder from './componentes/LoadingPlaceholder'; // Componente de indicador de carga

import ProductDetails from './componentes/ProductDetails';
import PaqueteDetails from './componentes/PaqueteDetails';
import SearchPage from './componentes/SearchPage';
import MisFavoritos from './componentes/Misfavoritos';
import Footer from './componentes/Footer';

import PBaterias from './Productos/PBaterias';
import PTrueno from './Productos/PTrueno';
import PLuz from './Productos/PLuz';

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Componentes que deseas cargar de forma diferida
const Home = lazy(() => import('./componentes/Home'));
const Eventos = lazy(() => import('./componentes/Eventos'));
const Paquetes = lazy(() => import('./componentes/Paquetes'));
const Conctato = lazy(() => import('./componentes/Conctato'));
const Productos = lazy(() => import('./componentes/Productos'));
const Micarrito = lazy(() => import('./componentes/Micarrito'));
const Miscompras = lazy(() => import('./componentes/Miscompras'));
const FormUser = lazy(() => import('./componentes/UserView'));
const Login = lazy(() => import('./componentes/Login'));
const Register = lazy(() => import('./componentes/Register'));

const App = (selectedProduct, selectedPaquete ) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false); 
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  if (loading) {
    return <LoadingPlaceholder />;
  }
  return (
    <div>
      <BrowserRouter>
        <Navbar
          user={user}
        />
        <ToastContainer /> 
        <Suspense fallback={<LoadingPlaceholder />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/paquete/:id" element={<PaqueteDetails selectedPaquete={selectedPaquete} />} />
            <Route path="/producto/:id" element={<ProductDetails selectedProduct={selectedProduct} />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/paquetes" element={<Paquetes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/contacto" element={<Conctato />} />
            <Route path="/micuenta" element={user ? <FormUser  /> : <Navigate to="/login" />} />
            <Route path="/micarrito" element={user ? <Micarrito /> : <Navigate to="/login" />} />
            <Route path="/miscompras" element={user ? <Miscompras /> : <Navigate to="/login" />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route path="/misfavoritos" element={user ? <MisFavoritos /> : <Navigate to="/login" />} />
            <Route path="/baterias" element={<PBaterias/>} />
            <Route path="/trueno" element={<PTrueno />} />
            <Route path="/luz" element={<PLuz />} />
            <Route path="/search-page" element={<SearchPage/>} />
          </Routes>
        </Suspense>
        <Footer></Footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
