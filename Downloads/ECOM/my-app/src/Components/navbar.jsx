import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "phosphor-react";
import "./navbar.css";
import { UserContext } from "./pages/UserContext";
import DefaultNavbar from "./DefaultNavbar";
import MKButton from "Components/MKButton";
import MKBox from "Components/MKBox";

export const Navbar = (props) => {
  const { user, updateUser } = useContext(UserContext);

  const handleLogout = () => {
    // Reset the user ID to 0
    updateUser({ id: 0 });
  };

  const routes = [
    { name: "Shop", route: "/shop" },
    { name: "Profile", route: "/contact" },
    { name: "Cart", route: "/cart" },
  ];

  return (
    <div className="navbar-container">
      <DefaultNavbar
        brand="Ecom-Bunnyshell"
        routes={routes}
        action={{
          type: "internal",
          route: "/add-products",
          color: "primary",
          label: "Add Product",
        }}
        center
      >
        <MKBox className="buttons" display="flex" alignItems="center">
          {user && user.id && user.id !== 0 ? (
            <MKButton
              component={Link}
              to="/"
              variant="contained"
              color="danger"
              className="logout-btn"
              onClick={handleLogout}
            >
              Log Out
            </MKButton>
          ) : (
            <MKButton
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              className="login-btn"
            >
              Login/Register
            </MKButton>
          )}
        </MKBox>
        <MKBox className="buttons" display="flex" alignItems="center">
          <MKBox mr={1}>
            <MKButton
              component={Link}
              to="/add-products"
              variant="contained"
              color="primary"
              className="add-product-btn"
            >
              Add Product
            </MKButton>
          </MKBox>
        </MKBox>
      </DefaultNavbar>
    </div>
  );
};
