import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProductsPage.css";
import { Navbar } from "../navbar";

const AddProductsPage = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("productImage", productImage);

    try {
      await axios.post(
        `https://${process.env.REACT_APP_BACKEND_HOST}/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product added successfully");
      navigate("/shop"); // Navigate to /shop after successful product addition
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  return (
    <>
      <Navbar />
      <div className="add-products-page">
        <h1>Add Products Page</h1>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label>Product Name:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label>Product Image:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>
    </>
  );
};

export default AddProductsPage;
