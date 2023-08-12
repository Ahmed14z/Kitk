import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./sim.jpg";
import "./RegisterPage.css";
import { UserContext } from "./UserContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const registerUser = () => {
    axios
      .post(`https://${process.env.REACT_APP_BACKEND_HOST}/signup`, {
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
        if (error.response && error.response.status === 409) {
          alert("User already exists!"); // Display a notification
        } else {
          console.log(error, "error");
          // console.log(`${REACT_APP_BACKEND_HOST}`);
          alert("Registration failed. Please try again."); // Display a general error message
        }
      });
  };

  return (
    <div className="container h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-md-6">
          <form>
            <div className="title-container">
              <h2 className="title">Create Your Account</h2>
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
                onClick={registerUser}
              >
                Sign Up
              </button>
              <p className="small fw-bold mt-2 pt-1 mb-0">
                Login to your account{" "}
                <a href="/login" className="link-danger">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <img src={logo} alt="sim" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}
