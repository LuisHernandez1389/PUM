import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, onValue } from "firebase/database";
export function UserProfilePicture() {
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = () => { };

    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        try {
          const userData = snapshot.val();
          if (userData) {
            setPhotoURL(userData.photoURL || "");
          }
          setLoading(false);
        } catch (error) {
          console.error("Error al procesar datos del usuario:", error);
          setLoading(false);
        }
      }, (error) => {
        console.error("Error al obtener datos del usuario:", error);
        setLoading(false);
      });

      return () => {
        unsubscribe(); // Limpia el listener cuando el componente se desmonta
      };
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <div className="container mt-5">
      {loading && <div>Cargando foto de perfil...</div>}
      {!loading && photoURL && (
        <div className="mb-3 text-center">
          <img
            src={photoURL}
            alt="Foto de perfil"
            className="foto rounded-circle"
            style={{ maxWidth: "150px" }}
          />
        </div>
      )}
    </div>
  );
}

export default UserProfilePicture;
