import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ContactCard } from "../components/ContactCard";
import { Link } from "react-router-dom";

const AGENDA_SLUG = "ana_martinez";

export const Contact = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts`
        );

        // Si es 404, la agenda no existe, la creamos
        if (response.status === 404) {
          const createResponse = await fetch(
            `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({})
            }
          );

          if (!createResponse.ok) {
            throw new Error("No se pudo crear la agenda");
          }

          // Después de crear, obtener contactos vacíos
          dispatch({
            type: "load_contacts",
            payload: []
          });
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Error al cargar contactos");
        }

        const data = await response.json();
        dispatch({
          type: "load_contacts",
          payload: data.contacts || []
        });
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar contactos: " + error.message);
        setLoading(false);
      }
    };

    fetchContacts();
  }, [dispatch]);

  if (loading) {
    return <div className="container mt-5"><h3>Cargando contactos...</h3></div>;
  }

  if (error) {
    return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Contactos</h1>
        <Link to="/add" className="btn btn-success">
          <i className="fas fa-plus"></i> Agregar Contacto
        </Link>
      </div>

      {store.message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {store.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => dispatch({ type: "clear_message" })}
          ></button>
        </div>
      )}

      <div className="row">
        {store.contacts && store.contacts.length > 0 ? (
          store.contacts.map(contact => (
            <div key={contact.id} className="col-md-6 col-lg-4 mb-4">
              <ContactCard contact={contact} />
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">No hay contactos. <Link to="/add">Crea uno</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};
