import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../navbar";
import APIService from "../APIService";
import { UserContext } from "./UserContext";
import UserList from "./cart/UserList";

export const Contact = () => {
  const { userId } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await APIService.getUser(userId);
        setUser(response);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="content">
        {user ? (
          <UserList users={user} /> // Wrap the user object in an array
        ) : (
          <div>No user data available.</div>
        )}
      </div>
    </>
  );
};
