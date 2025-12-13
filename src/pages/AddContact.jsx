import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AddContact = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!contactId;

  useEffect(() => {
    if (isEditing && store.contacts) {
      const contact = store.contacts.find(c => c.id === parseInt(contactId));
      if (contact) {
        setFormData({
          name: contact.name || "",
          email: contact.email || "",
          phone: contact.phone || "",
          address: contact.address || ""
        });
      }
    }
  }, [contactId, isEditing, store.contacts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `https://playground.4geeks.com/contact/agendas/ana_martinez/contacts/${contactId}`
        : "https://playground.4geeks.com/contact/agendas/ana_martinez/contacts";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error al guardar el contacto");
      }

      const data = await response.json();

      if (isEditing) {
        dispatch({
          type: "update_contact",
          payload: data.result
        });
      } else {
        dispatch({
          type: "add_contact",
          payload: data.result
        });
      }

      setFormData({ name: "", email: "", phone: "", address: "" });
      navigate("/contact");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar el contacto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>{isEditing ? "Editar Contacto" : "Agregar Nuevo Contacto"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/contact")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
