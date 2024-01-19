import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Home = () => {
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
    console.log(map);
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
    <LoadScript
      googleMapsApiKey="AIzaSyDUuTL2YmUKq9uIr9DB7kDBw95auNhK6Us"
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        center={currentPosition || defaultCenter}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {currentPosition && (
          <Marker position={currentPosition} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Home;
