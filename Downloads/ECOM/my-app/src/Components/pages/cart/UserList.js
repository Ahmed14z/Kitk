import React from "react";
import "./UserList.css";

function UserList(props) {
  if (!props.users || !props.users.user || !props.users.user.email) {
    return <div>No user data available.</div>;
  }

  const calculateTotalPrice = (purchase) => {
    return purchase.product_price * purchase.quantity;
  };

  return (
    <div>
      <div className="container">
        <h2>Email: {props.users.user.email}</h2>
        <hr />
        <h3>Purchases:</h3>
        {props.users.user.purchases.map((purchase) => (
          <div key={purchase.id} className="purchase-container">
            <h4>Product Name: {purchase.product_name}</h4>
            <p>Product Price: ${purchase.product_price}</p>
            <p>Quantity: {purchase.quantity}</p>
            <p>Total Price: ${calculateTotalPrice(purchase)}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
