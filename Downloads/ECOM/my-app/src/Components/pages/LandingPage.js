import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div>
        <div className="row justify-content-center align-items-center">
          <div className="col-12 text-center">
            <h1 className="landing-title">Welcome to my Shop</h1>
            <div className="button-container">
              <Link to="/login" className="landing-btn">
                Login
              </Link>
              <Link to="/register" className="landing-btn">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
