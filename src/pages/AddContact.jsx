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
    address: "",
    image_url: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditing = !!contactId;

  useEffect(() => {
    if (isEditing && store.contacts) {
      const contact = store.contacts.find(c => c.id === parseInt(contactId));
      if (contact) {
        setFormData({
          name: contact.name || "",
          email: contact.email || "",
          phone: contact.phone || "",
          address: contact.address || "",
          image_url: contact.image_url || ""
        });
      }
    }
  }, [contactId, isEditing, store.contacts]);

  // Validación en tiempo real
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "El nombre es obligatorio";
        } else if (value.trim().length < 2) {
          error = "El nombre debe tener al menos 2 caracteres";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "El formato del email no es válido";
        }
        break;

      case "phone":
        if (value && !/^[\d\s\-\+\(\)]{9,15}$/.test(value)) {
          error = "El teléfono debe tener entre 9 y 15 dígitos";
        }
        break;

      case "image_url":
        // Validación flexible: acepta cualquier URL HTTP/HTTPS válida
        if (value && !/^https?:\/\/.+/i.test(value)) {
          error = "La URL debe comenzar con http:// o https://";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar solo si el campo ha sido tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      image_url: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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

      // La API devuelve el contacto directamente
      if (isEditing) {
        dispatch({
          type: "update_contact",
          payload: data
        });
      } else {
        dispatch({
          type: "add_contact",
          payload: data
        });
      }

      setFormData({ name: "", email: "", phone: "", address: "", image_url: "" });
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar el contacto");
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.values(errors).some(error => error !== "");

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mb-4">{isEditing ? "Editar Contacto" : "Agregar Nuevo Contacto"}</h2>
          <form onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${touched.name && errors.name ? 'is-invalid' : touched.name && !errors.name ? 'is-valid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {touched.name && errors.name && (
                <span className="form-error">{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className={`form-control ${touched.email && errors.email ? 'is-invalid' : touched.email && !errors.email ? 'is-valid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {touched.email && errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            {/* Teléfono */}
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Teléfono</label>
              <input
                type="tel"
                className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : touched.phone && !errors.phone && formData.phone ? 'is-valid' : ''}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+34 123 456 789"
              />
              {touched.phone && errors.phone && (
                <span className="form-error">{errors.phone}</span>
              )}
            </div>

            {/* Dirección */}
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Calle, ciudad, país"
              />
            </div>

            {/* Botones */}
            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || hasErrors}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  isEditing ? "Actualizar Contacto" : "Crear Contacto"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/")}
                disabled={loading}
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
