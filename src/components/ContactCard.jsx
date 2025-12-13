import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { DeleteModal } from "./DeleteModal";

export const ContactCard = ({ contact }) => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
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
        payload: contact.id
      });

      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar el contacto");
    }
  };

  return (
    <>
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{contact.name}</h5>
          <p className="card-text">
            <i className="fas fa-envelope"></i> {contact.email}
          </p>
          {contact.phone && (
            <p className="card-text">
              <i className="fas fa-phone"></i> {contact.phone}
            </p>
          )}
          {contact.address && (
            <p className="card-text">
              <i className="fas fa-map-marker-alt"></i> {contact.address}
            </p>
          )}
        </div>
        <div className="card-footer bg-white d-flex gap-2 justify-content-end">
          <button
            className="btn btn-sm btn-warning"
            onClick={() => navigate(`/edit/${contact.id}`)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-trash"></i>
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
