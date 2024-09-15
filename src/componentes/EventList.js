import { ref, onValue, set, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { database } from '../firebase';
import '../estilos/EventList.css';

function EventList() {
    const [eventos, setEventos] = useState([]);
    const [eventosAtendidos, setEventosAtendidos] = useState([]);

    useEffect(() => {
        const eventListRef = ref(database, 'eventos');

        const unsubscribe = onValue(eventListRef, (snapshot) => {
            const eventList = [];
            const eventosAtendidos = [];

            snapshot.forEach((childSnapshot) => {
                const event = {
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                };

                if (event.atendido) {
                    eventosAtendidos.push(event);
                } else {
                    eventList.push(event);
                }
            });

            // Ordenar eventos no atendidos por fecha de evento de forma descendente (más reciente primero)
            eventList.sort((a, b) => new Date(b.fechaEvento + ' ' + b.horaEvento) - new Date(a.fechaEvento + ' ' + a.horaEvento));

            setEventos(eventList);
            setEventosAtendidos(eventosAtendidos);
        });

        return () => {
            unsubscribe();
        };
    }, [eventos]);

    const moverAAtendidos = (evento) => {
        // Actualizar el campo 'atendido' en la base de datos
        const eventoRef = ref(database, `eventos/${evento.id}`);
        set(eventoRef, { ...evento, atendido: true });
    };
    const moverADesatendidos = (evento) => {
        // Actualizar el campo 'atendido' en la base de datos
        const eventoRef = ref(database, `eventos/${evento.id}`);
        set(eventoRef, { ...evento, atendido: false });
    };
    const eliminarEvento = (evento) => {
        // Eliminar el evento de la lista de eventos atendidos y de la base de datos
        const eventoRef = ref(database, `eventos/${evento.id}`);
        remove(eventoRef);

        // Actualizar el estado para que se refleje el cambio
        const nuevosEventosAtendidos = eventosAtendidos.filter((e) => e.id !== evento.id);
        setEventosAtendidos(nuevosEventosAtendidos);
    };

    return (
        <div className="container">
            <h1 className="mt-5 mb-4">Lista de Eventos</h1>
            <div className="row">
                <div className="col-md-6 scroll-container" id='eventcontainer' >
                    <h2>Eventos no Atendidos</h2>
                    <div className="list-group custom-list-group " style={{ maxWidth: "100%" }}>
                        {eventos.map((evento) => (
                            <div className="list-group-item list-group-item-action" key={evento.id}>
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">{evento.nombre}</h5>
                                    Registro: {new Date(evento.fechaRegistro).toLocaleString()}
                                </div>
                                <small className="text-muted">Evento: {evento.fecha}</small>
                                {/* Mostrar el atributo de fecha adicional */}
                                <small className="text-muted">    Hora: {evento.hora}</small>
                                <p className="mb-1"><strong>Correo:</strong> {evento.correo}</p>
                                <p className="mb-1"><strong>Descripción:</strong> {evento.descripcion}</p>
                                <p className="mb-1"><strong>Teléfono:</strong> {evento.telefono}</p>
                                <button
                                    className="btn btn-primary "
                                    onClick={() => moverAAtendidos(evento)}
                                >
                                    Atender
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-6 scroll-container">
                    <h2>Eventos Atendidos</h2>
                    <div className="list-group custom-list-group" style={{ maxWidth: "100%" }}>
                        {eventosAtendidos.map((evento) => (
                            <div className="list-group-item list-group-item-action" key={evento.id}>
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">{evento.nombre}</h5>
                                    Registro: {new Date(evento.fechaRegistro).toLocaleString()}
                                </div>
                                <small className="text-muted">Evento: {evento.fecha}</small>
                                {/* Mostrar el atributo de fecha adicional */}
                                <small className="text-muted">    Hora: {evento.hora}</small>
                                <p className="mb-1"><strong>Correo:</strong> {evento.correo}</p>
                                <p className="mb-1"><strong>Descripción:</strong> {evento.descripcion}</p>
                                <p className="mb-1"><strong>Teléfono:</strong> {evento.telefono}</p>
                                <button
                                    className="btn btn-primary "
                                    onClick={() => moverADesatendidos(evento)}
                                >
                                    Devolver
                                </button>
                                <button
                                    className="btn btn-danger "
                                    onClick={() => eliminarEvento(evento)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventList;
