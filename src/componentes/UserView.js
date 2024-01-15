import React, { useState, useEffect, useRef } from "react";
import { auth, database, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";
import "../estilos/UserView.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FormUser() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [numeroTelefono, setNumeroTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [position, setPosition] = useState([27.4440472, -109.93778859]);
  const [hasLocation, setHasLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapRef = useRef(null);

  const watchLocation = () => {
    return navigator.geolocation.watchPosition(
      (location) => {
        setPosition([location.coords.latitude, location.coords.longitude]);
        setHasLocation(true);
        console.log(hasLocation);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { timeout: 1000, maximumAge: 0, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    let watchId;

    if ("geolocation" in navigator) {
      watchId = watchLocation();
    } else {
      console.error("Geolocation is not supported.");
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setEmail(currentUser.email);
      setNombre("");
      setApellido("");
      setNumeroTelefono("");
      setDireccion("");
      setUserProfile(currentUser);
      loadUserData(currentUser);
    }
  }, []);

  const loadUserData = async (user) => {
    const userUid = userProfile ? userProfile.uid : auth.currentUser.uid;
    const userRef = ref(database, "users/" + userUid);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setNombre(userData.nombre || "");
        setApellido(userData.apellido || "");
        setNumeroTelefono(userData.numeroTelefono || "");
        setDireccion(userData.direccion || "");
        setPhotoURL(userData.photoURL || "");
      }
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error.message);
    }

  };

  const handleRegistration = async () => {
    try {
      if (userProfile === null) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: nombre,
        });

        const userUid = user.uid;
        const userRef = ref(database, "users/" + userUid);

        await set(userRef, {
          uid: userUid,
          nombre,
          apellido,
          numeroTelefono,
          direccion,
          photoURL: photoChanged ? photoURL : "",
        });

        if (photoChanged && photoFile) {
          const photoRef = storageRef(
            storage,
            `user-profiles/${userUid}/photo.jpg`
          );
          await uploadBytes(photoRef, photoFile);
        }
      } else {
        await updateProfile(auth.currentUser, {
          displayName: nombre,
        });

        const userUid = auth.currentUser.uid;
        const userRef = ref(database, "users/" + userUid);

        await set(userRef, {
          nombre,
          apellido,
          numeroTelefono,
          direccion,
          photoURL: photoChanged ? photoURL : "",
        });

        if (photoChanged && photoFile) {
          const photoRef = storageRef(
            storage,
            `user-profiles/${userUid}/photo.jpg`
          );
          await uploadBytes(photoRef, photoFile);
        }
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setPhotoChanged(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoURL(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleMapClick = (e) => {
    const lat = e.latlng ? e.latlng.lat : null;
    const lng = e.latlng ? e.latlng.lng : null;

    console.log("Coordenadas seleccionadas:", lat, lng);
    setSelectedLocation({ lat, lng });
    setDireccion(`${lat}, ${lng}`);
  };

  useEffect(() => {
    const map = mapRef.current;

    if (map) {
      map.on("click", handleMapClick);
    }

    return () => {
      if (map) {
        map.off("click", handleMapClick);
      }
    };
  }, [mapRef, handleMapClick]);

  return (
    <div className="container mt-5">
      <br />
      <div className="row justify-content-center">
        <div className="col-md-6">
          {photoURL && (
            <div className="mb-3 text-center">
              <img
                src={photoURL}
                alt="Foto de perfil"
                className="img-fluid rounded-circle"
                style={{ maxWidth: "150px" }}
              />
            </div>
          )}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Número de Teléfono"
              value={numeroTelefono}
              onChange={(e) => setNumeroTelefono(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>
          <div className="mb-3">
            <button
              className="btn btn-primary w-100"
              onClick={handleRegistration}
            >
              {userProfile ? "Actualizar perfil" : "Registrarse"}
            </button>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <MapContainer center={position} zoom={15} style={{ height: "500px", width: "100%" }} ref={mapRef}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={position}>
            <Popup>Tu ubicación actual</Popup>
          </Marker>
        </MapContainer>
        {selectedLocation && (
          <div>
            <h3>Ubicación seleccionada:</h3>
            <p>Latitud: {selectedLocation.lat}</p>
            <p>Longitud: {selectedLocation.lng}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormUser;