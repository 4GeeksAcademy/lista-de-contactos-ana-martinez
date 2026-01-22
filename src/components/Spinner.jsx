export const Spinner = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "spinner-sm",
        md: "spinner-md",
        lg: "spinner-lg"
    };

    return (
        <div className={`spinner ${sizeClasses[size]} ${className}`}>
            <div className="spinner-circle"></div>
        </div>
    );
};

export const ButtonSpinner = () => {
    return (
        <span className="button-spinner">
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Guardando...
        </span>
    );
};

export const PageSpinner = ({ message = "Cargando..." }) => {
    return (
        <div className="page-spinner">
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">{message}</p>
        </div>
    );
};
