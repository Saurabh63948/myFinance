import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const CustomerLoginPage = ({ setLoggedInCustomer }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!name || !mobile.match(/^\d{10}$/)) {
      setError("Please enter a valid name and 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://myfinacebackend.onrender.com/api/auth/request-otp", {
        name,
        mobileNumber: mobile,
      });

      // Use backend-generated OTP (for dev)
      setGeneratedOtp(res.data.otp);
      setStep(2);
      alert(`🔐 OTP sent to ${mobile}: ${res.data.otp}`);
    } catch (err) {
      setError("User not found. Please check your name and mobile.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp !== generatedOtp) {
      setError("Invalid OTP. Try again.");
      return;
    }

    try {
      const res = await axios.post("https://myfinacebackend.onrender.com/api/auth/verify-otp", {
        name,
        mobileNumber: mobile,
        otp,
      });

      setLoggedInCustomer(res.data.customer);
      navigate(`/user/${res.data.customer.aadhaar}`);
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Customer Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      {step === 1 && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your 10-digit mobile"
              required
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </Form>
      )}

      {step === 2 && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              required
            />
          </Form.Group>

          <Button variant="success" onClick={handleVerifyOtp}>
            Verify OTP & Login
          </Button>
        </Form>
      )}
    </div>
  );
};

export default CustomerLoginPage;
