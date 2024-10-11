import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

const Nav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/"); 
    window.location.reload(); 
  };

  return (
    <>
      {authService.isLoggedIn() ? (
        <nav>
          <span>
            <Link to="/dashboard">
              <i className="ph ph-brackets-angle"></i> LIMINAL
            </Link>
          </span>
          <ul>
            <li>
              <Link to="/profile">Account</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      ) : (
        <nav>
          <span>
            <Link to="/">
              <i className="ph ph-brackets-angle"></i> LIMINAL
            </Link>
          </span>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Nav;
