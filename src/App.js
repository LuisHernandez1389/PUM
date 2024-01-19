import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from "./firebase";
import Navbar from './componentes/navbar';
import LoadingPlaceholder from './componentes/LoadingPlaceholder'; // Componente de indicador de carga
import "./App.css";



// Componentes que deseas cargar de forma diferida
const Home = lazy(() => import('./componentes/Home'));
const Eventos = lazy(() => import('./componentes/Eventos'));
const Paquetes = lazy(() => import('./componentes/Paquetes'));
const Conctato = lazy(() => import('./componentes/Conctato'));
const Productos = lazy(() => import('./componentes/Productos'));
const Micarrito = lazy(() => import('./componentes/Micarrito'));
const Mispedidos = lazy(() => import('./componentes/Mispedidos'));
const Recomendaciones = lazy(() => import('./componentes/Recomendaciones'));
const FormUser = lazy(() => import('./componentes/UserView'));
const Login = lazy(() => import('./componentes/Login'));
const Register = lazy(() => import('./componentes/Register'));
const PaqueteDetails = lazy(()=> import('./componentes/PaqueteDetails'))
const BusquedaPage = lazy(() => import('./vistas/BusquedaPage'))
const App = (selectedProduct) => {
  const [user, setUser] = useState(null); // Supongamos que también tienes información del usuario
  const [photoURL, setPhotoURL] = useState('');

  const handlePhotoChange = (newPhotoURL) => {
    setPhotoURL(newPhotoURL); // Función para actualizar la foto de perfil
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>

      <BrowserRouter>

      <Navbar selectedProduct={selectedProduct} user={user} photoURL={photoURL} />
        <Suspense fallback={<LoadingPlaceholder />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/detalles-paquetes' element={<PaqueteDetails/>} />
            <Route path="/navbar" element={<Navbar/>}/>

            <Route path="/eventos" element={<Eventos />} />
            <Route path="/paquetes" element={<Paquetes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/contacto" element={<Conctato />} />
            <Route path="/micuenta" element={user ? <FormUser onPhotoChange={handlePhotoChange} /> : <Navigate to="/login" />} />
            <Route path="/micarrito" element={user ? <Micarrito /> : <Navigate to="/login" />} />
            <Route path="/mispedidos" element={user ? <Mispedidos /> : <Navigate to="/login" />} />
            <Route path="/recomendaciones" element={user ? <Recomendaciones /> : <Navigate to="/login" />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route path="/busqueda" component={BusquedaPage} />
          </Routes>
        </Suspense>

      </BrowserRouter>
    </div>
  );
}

export default App;
