// src/pages/HomePage.jsx
import React from "react";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Welcome to MyFinanceApp</h1>
          <p className="lead mt-3">
            Smart Loan Tracking & Daily Repayment Management – built for real people.
          </p>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="mb-4">Who We Are</h2>
          <p className="lead mx-auto" style={{ maxWidth: "800px" }}>
            We are a micro-finance solution built for small business owners and individuals who want to manage their loans simply, transparently, and quickly. Our platform tracks loans, interest, daily collections, and repayment history so that nothing falls through the cracks.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Us?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow h-100 text-center p-4">
                <h5 className="card-title">Daily Tracking</h5>
                <p className="card-text">Get automatic breakdown of daily payment amounts and schedule reminders.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow h-100 text-center p-4">
                <h5 className="card-title">Fine Management</h5>
                <p className="card-text">Track overdue payments and apply additional charges automatically if needed.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card shadow h-100 text-center p-4">
                <h5 className="card-title">Simple Dashboard</h5>
                <p className="card-text">A clean view for admins and users to see repayment history and remaining balance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">© 2025 MyFinanceApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
