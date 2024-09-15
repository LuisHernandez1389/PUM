import React, { useState } from "react";
import { database } from "../firebase";
import { ref, push, serverTimestamp } from "firebase/database";

function Eventos() {
  // Estado para los campos del formulario
  const [nombreEvento, setNombreEvento] = useState("");
  const [correoEvento, setCorreoEvento] = useState("");
  const [telefonoEvento, setTelefonoEvento] = useState("");
  const [fechaEvento, setFechaEvento] = useState("");
  const [horaEvento, setHoraEvento] = useState(""); // Nuevo estado para la hora del evento
  const [descripcionEvento, setDescripcionEvento] = useState("");

  // Función para manejar el registro del evento
  const handleRegister = async (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

    try {
      // Obtener una referencia a la colección de eventos en Firestore Realtime Database
      const eventosRef = ref(database, "eventos");

      // Crear un nuevo objeto de evento con los datos recopilados del formulario
      const nuevoEvento = {
        nombre: nombreEvento,
        correo: correoEvento,
        telefono: telefonoEvento,
        fecha: fechaEvento,
        hora: horaEvento, // Agregar la hora al objeto de evento
        descripcion: descripcionEvento,
        fechaRegistro: serverTimestamp(),
      };

      // Agregar el nuevo evento a la colección
      await push(eventosRef, nuevoEvento);

      console.log("Evento registrado exitosamente");

      // Limpiar los campos del formulario después de agregar el evento
      setNombreEvento("");
      setCorreoEvento("");
      setTelefonoEvento("");
      setFechaEvento("");
      setHoraEvento("");
      setDescripcionEvento("");
    } catch (error) {
      console.error("Error al registrar el evento:", error.message);
    }
  };

  // Renderización del formulario
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Registro de Evento</h2>
              <form onSubmit={handleRegister}>
                {/* Campo para el nombre del evento */}
                <div className="mb-3">
                  <label htmlFor="nombreEvento" className="form-label">
                    Nombre del Evento
                  </label>
                  <input
                    className="form-control"
                    id="nombreEvento"
                    placeholder="Nombre del Evento"
                    value={nombreEvento}
                    onChange={(e) => setNombreEvento(e.target.value)}
                  />
                </div>
                {/* Campo para el nombre del evento */}
                <div className="mb-3">
                  <label htmlFor="correoEvento" className="form-label">
                    Correo del Evento
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="correoEvento"
                    placeholder="Correo del Evento"
                    value={correoEvento}
                    onChange={(e) => setCorreoEvento(e.target.value)}
                  />
                </div>
                {/* Campo para el nombre del evento */}
                <div className="mb-3">
                  <label htmlFor="telefonoEvento" className="form-label">
                    Telefono del Evento
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="telefonoEvento"
                    placeholder="Telefono del Evento"
                    value={telefonoEvento}
                    onChange={(e) => setTelefonoEvento(e.target.value)}
                  />
                </div>
                {/* Campo para la fecha del evento */}
                <div className="mb-3">
                  <label htmlFor="fechaEvento" className="form-label">
                    Fecha del Evento
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaEvento"
                    value={fechaEvento}
                    onChange={(e) => setFechaEvento(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="horaEvento" className="form-label">
                    Hora del Evento
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="horaEvento"
                    value={horaEvento}
                    onChange={(e) => setHoraEvento(e.target.value)}
                  />
                </div>
                {/* Campo para la descripción del evento */}
                <div className="mb-3">
                  <label htmlFor="descripcionEvento" className="form-label">
                    Descripción del Evento
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcionEvento"
                    rows="4"
                    placeholder="Descripción del Evento"
                    value={descripcionEvento}
                    onChange={(e) => setDescripcionEvento(e.target.value)}
                  ></textarea>
                </div>
                {/* Botón para registrar el evento */}
                <button type="submit" className="btn btn-primary btn-block">
                  Registrar Evento
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Eventos;
