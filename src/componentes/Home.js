import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker  } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const successCallback = (position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const errorCallback = (error) => {
      console.error('Error getting location:', error.message);
      if (error.code === 1) {
        setPermissionDenied(true);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (map) {
      setIsMapLoaded(true);
    }
  }, [map]);

  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const defaultCenter = {
    lat: 0,
    lng: 0,
  };

  const onLoad = (map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  return (
<div class="p-5 text-center bg-body-tertiary rounded-3">
    <svg class="bi mt-4 mb-3"  width="100" height="100"><use></use></svg>
    <h1 class="text-body-emphasis">Descubre más al iniciar sesión</h1>
    <p class="col-lg-8 mx-auto fs-5 text-muted">
    Accede a tu cuenta para continuar tu experiencia personalizada.
    </p>
    <div class="d-inline-flex gap-2 mb-5">
      <Link to='/login' class="d-inline-flex align-items-center btn btn-primary btn-lg px-4 rounded-pill" type="button">
        Iniciar Sesion
        <svg class="bi ms-2" width="24" height="24"><use></use></svg>
      </Link>
      <Link to='/register' class="btn btn-outline-secondary btn-lg px-4 rounded-pill" type="button">
        Registrar
      </Link>
    </div>
  </div>
  );
};

export default Home;
