import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-address-book"></i> Contact Manager
        </Link>
      </div>
    </nav>
  );
};
