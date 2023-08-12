import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./sim.jpg";
import "./LoginPage.css";
import { UserContext } from "./UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const logInUser = () => {
    if (email.length === 0) {
      alert("Email has been left blank!");
    } else if (password.length === 0) {
      alert("Password has been left blank!");
    } else {
      axios
        .post(`https://${process.env.REACT_APP_BACKEND_HOST}/login`, {
          email: email,
          password: password,
        })
        .then(function (response) {
          const userData = response.data;
          const userId = userData.id;

          updateUser({ id: userId, ...userData });

          navigate("/shop");
        })
        .catch(function (error) {
          console.log(error, "error");
          if (error.response.status === 401) {
            alert("Invalid credentials");
          }
        });
    }
  };

  return (
    <div className="container h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-md-6">
          <img src={logo} alt="sim" className="img-fluid" />
        </div>
        <div className="col-md-6">
          <form>
            <div className="title-container">
              <h2 className="title">Log Into Your Account</h2>
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="form3Example3">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="form3Example3"
                className="form-control form-control-lg"
                placeholder="Enter a valid email address"
              />
            </div>

            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="form3Example4">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="form3Example4"
                className="form-control form-control-lg"
                placeholder="Enter password"
              />
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="form-check mb-0">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  value=""
                  id="form2Example3"
                />
                <label className="form-check-label" htmlFor="form2Example3">
                  Remember me
                </label>
              </div>
              <a href="#!" className="text-body">
                Forgot password?
              </a>
            </div>

            <div className="text-center text-lg-start mt-4 pt-2">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={logInUser}
              >
                Login
              </button>
              <p className="small fw-bold mt-2 pt-1 mb-0">
                Don't have an account?{" "}
                <a href="/register" className="link-danger">
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
