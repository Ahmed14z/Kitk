import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/pages/LandingPage";
import LoginPage from "./Components/pages/LoginPage";
import RegisterPage from "./Components/pages/RegisterPage";
import { Shop } from "./Components/pages/shop/shop";
import { Contact } from "./Components/pages/contact";
import Cart from "./Components/pages/cart/cart";
import { ShopContextProvider } from "./context/shop-context";
import { UserContextProvider } from "./Components/pages/UserContext";
import { ProductDetails } from "./Components/pages/shop/ProductDetails";
import AddProductsPage from "./Components/pages/AddProductsPage";
import CartPage from "./Components/pages/newCart/CartPage";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CenteredFooter from "../src/Components/pages/CenteredFooter"; // Replace "path/to/CenteredFooter" with the actual path to CenteredFooter.js

// Material Kit 2 React themes
import theme from "./assets/theme";

import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div className="row">
          <div className="col cust">
            <h1 className="custs">Ecom-Bunnyshell</h1>
          </div>
        </div>
        <UserContextProvider>
          <ShopContextProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/add-products" element={<AddProductsPage />} />
                {/* Add this line */}
              </Routes>
              <CenteredFooter />
            </Router>
          </ShopContextProvider>
        </UserContextProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
