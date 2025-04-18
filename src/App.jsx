// App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import AddPersonPage from "./components/pages/AddPersonPage";
import DashboardPage from "./components/pages/DashboardPage";
import NavBar from "./components/pages/NavBar";
import HomePage from "./components/pages/HomePage";
import UserDetailsPage from "./components/pages/UserDetailsPage";
import CustomerLoginPage from "./components/pages/CustomerLoginPage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [people, setPeople] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [isHost, setIsHost] = useState(() => localStorage.getItem("isHost") === "true");
  const [loggedInCustomer, setLoggedInCustomer] = useState(() => {
    const stored = localStorage.getItem("loggedInCustomer");
    return stored ? JSON.parse(stored) : null;
  });
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPeople(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  useEffect(() => {
    const storedIsHost = localStorage.getItem("isHost") === "true";
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsHost(storedIsHost);
    setIsLoggedIn(storedIsLoggedIn);

    if (storedIsLoggedIn && storedIsHost) {
      fetchCustomers();
    }
  }, []);

  const handleLoginToggle = () => {
    setIsLoggedIn(false);
    setIsHost(false);
    setLoggedInCustomer(null);
    localStorage.clear();
    navigate("/");
  };

  const handleCustomerLogin = (customer) => {
    setIsLoggedIn(true);
    setIsHost(customer.isHost);
    setLoggedInCustomer(customer);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isHost", customer.isHost);
    localStorage.setItem("loggedInCustomer", JSON.stringify(customer));
    localStorage.setItem("token", customer.token);
    if (customer.isHost) {
      fetchCustomers();
      navigate("/dashboard");
    } else {
      navigate(`/user/${customer._id}`);
    }
  };

  return (
    <>
      <NavBar
        isLoggedIn={isLoggedIn}
        isHost={isHost}
        toggleLogin={handleLoginToggle}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div style={{ paddingTop: "70px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<CustomerLoginPage setLoggedInCustomer={handleCustomerLogin} />}
          />
          <Route
            path="/add"
            element={
              isLoggedIn && isHost ? <AddPersonPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn && isHost ? (
                <DashboardPage
                  people={people}
                  setPeople={setPeople}
                  isHost={isHost}
                  searchText={searchText}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/user/:id"
            element={
              isLoggedIn && !isHost && loggedInCustomer ? (
                <UserDetailsPage
                  people={[loggedInCustomer]}
                  setPeople={setPeople}
                  isHost={false}
                  loggedInCustomer={loggedInCustomer}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<div className="text-center mt-5">404 - Page not found</div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
