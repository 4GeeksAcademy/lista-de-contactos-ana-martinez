import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { DeleteModal } from "./DeleteModal";

export const ContactCard = ({ contact }) => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Función para obtener iniciales del nombre
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Función para obtener color aleatorio basado en el nombre
  const getAvatarColor = (name) => {
    const colors = 6;
    const charCode = name?.charCodeAt(0) || 0;
    return `avatar-color-${(charCode % colors) + 1}`;
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `https://playground.4geeks.com/contact/agendas/ana_martinez/contacts/${contact.id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }

      dispatch({
        type: "delete_contact",
        payload: { id: contact.id, name: contact.name }
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar el contacto");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="card contact-card">
        <div className="contact-card-header">
          <div
            className={`contact-avatar-initials ${getAvatarColor(contact.name)}`}
          >
            {getInitials(contact.name)}
          </div>
        </div>
        <div className="card-body contact-card-body">
          <h5 className="card-title text-center mb-3">{contact.name}</h5>

          <div className="contact-info-item">
            <i className="fas fa-envelope"></i>
            <span>{contact.email}</span>
          </div>

          {contact.phone && (
            <div className="contact-info-item">
              <i className="fas fa-phone"></i>
              <span>{contact.phone}</span>
            </div>
          )}

          {contact.address && (
            <div className="contact-info-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{contact.address}</span>
            </div>
          )}
        </div>
        <div className="card-footer bg-white d-flex gap-2 justify-content-end">
          <button
            className="btn btn-sm btn-warning"
            onClick={() => navigate(`/edit/${contact.id}`)}
            title="Editar contacto"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => setShowModal(true)}
            disabled={deleting}
            title="Eliminar contacto"
          >
            {deleting ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <i className="fas fa-trash"></i>
            )}
          </button>
        </div>
      </div>

      {showModal && (
        <DeleteModal
          contactName={contact.name}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};
