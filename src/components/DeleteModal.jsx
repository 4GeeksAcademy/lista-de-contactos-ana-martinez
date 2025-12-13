export const DeleteModal = ({ contactName, onConfirm, onCancel }) => {
  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eliminar Contacto</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body">
            ¿Estás segura de que quieres eliminar a <strong>{contactName}</strong>?
            Esta acción no se puede deshacer.
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
