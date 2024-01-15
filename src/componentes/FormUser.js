import React, { useState, useEffect } from "react";
import { auth, database, storage } from "../firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, push, set, get } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

function FormUser() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [numeroTelefono, setNumeroTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(""); // Para almacenar la URL de la foto
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [photoChanged, setPhotoChanged] = useState(false); // Nuevo estado para rastrear cambios en la foto

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
    const userUid = user.uid;
    const userRef = ref(database, "users/" + userUid);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setNombre(userData.nombre || "");
        setApellido(userData.apellido || "");
        setNumeroTelefono(userData.numeroTelefono || "");
        setDireccion(userData.direccion || "");
        // ...otros campos...
        setPhotoURL(userData.photoURL || ""); // Cargar la URL de la foto si está disponible
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

        // Guardar datos del usuario
        await set(userRef, {
          nombre,
          apellido,
          numeroTelefono,
          direccion,
          photoURL: photoChanged ? photoURL : "", // Guardar la URL de la foto en la base de datos solo si ha cambiado
        });

        // Subir la foto al Storage si ha cambiado
        if (photoChanged && photoFile) {
          const photoRef = storageRef(storage, `user-profiles/${userUid}/photo.jpg`);
          await uploadBytes(photoRef, photoFile);
        }
      } else {
        await updateProfile(auth.currentUser, {
          displayName: nombre,
        });

        const userUid = auth.currentUser.uid;
        const userRef = ref(database, "users/" + userUid);

        // Actualizar datos del usuario
        await set(userRef, {
          nombre,
          apellido,
          numeroTelefono,
          direccion,
          photoURL: photoChanged ? photoURL : "", // Guardar la URL de la foto en la base de datos solo si ha cambiado
        });

        // Subir la foto al Storage si ha cambiado
        if (photoChanged && photoFile) {
          const photoRef = storageRef(storage, `user-profiles/${userUid}/photo.jpg`);
          await uploadBytes(photoRef, photoFile);
        }
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setPhotoChanged(true); // Marcar que la foto ha cambiado
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="form-control">
        {userProfile && (
          <div>
            <button onClick={handleSignOut}>Cerrar Sesión</button>
          </div>
        )}
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Número de Teléfono"
            value={numeroTelefono}
            onChange={(e) => setNumeroTelefono(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="form-control"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="form-control"
          />
          {photoURL && (
            <img src={photoURL} alt="Foto de perfil" />
          )}
          <button onClick={handleRegistration} className="btn btn-primary btn-block">
            {userProfile ? "Actualizar perfil" : "Registrarse"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormUser;
