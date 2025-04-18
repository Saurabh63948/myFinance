import { useState, useRef } from "react";
import axios from "axios";

const AddPersonForm = ({ onAddPerson }) => {
  const [name, setName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhaarPhoto, setAadhaarPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAadhaarPhoto(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (
      !name || !loanAmount || !percentage || !startDate || !endDate ||
      !aadhaar || !mobile || !aadhaarPhoto || isNaN(days) || days <= 0
    ) {
      alert("Please fill all fields correctly!");
      return;
    }

    const totalRepayable = parseFloat(loanAmount) + (parseFloat(loanAmount) * percentage) / 100;
    const dailyRepayment = parseFloat((totalRepayable / days).toFixed(2));

    const newPerson = {
      name,
      loanAmount: parseFloat(loanAmount),
      interestRatePercent: parseFloat(percentage),
      totalPayableAmount: totalRepayable,
      remainingAmount: totalRepayable,
      paidAmount: 0,
      aadhaarNumber: aadhaar,
      mobileNumber: mobile,
      aadhaarPhotoUrl: aadhaarPhoto,
      loanStartDate: startDate,
      durationInDays: days,
      passbook: [],
      lateFees: [],
      isHost: false, // 👈 added explicitly
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://myfinacebackend.onrender.com/api/customers", newPerson, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Customer added successfully!");
      if (onAddPerson) onAddPerson(res.data);

      // Reset form
      setName("");
      setLoanAmount("");
      setPercentage("");
      setStartDate("");
      setEndDate("");
      setAadhaar("");
      setMobile("");
      setAadhaarPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error(err);
      alert("Failed to add customer. Please try again.");
    }
  };

  // Calculated repayment value
  const calculateDailyRepayment = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (!loanAmount || !percentage || isNaN(days) || days <= 0) return "";
    const totalRepayable = parseFloat(loanAmount) + (parseFloat(loanAmount) * percentage) / 100;
    return (totalRepayable / days).toFixed(2);
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="card shadow-sm p-4 rounded-4 border-0 bg-light">
        <h3 className="mb-4 text-center text-primary fw-bold">Add New Customer</h3>
        <form onSubmit={handleSubmit} className="row g-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Customer Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Loan Amount</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter amount (₹)"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Interest (%)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 10"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Aadhaar Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="1234 5678 9012"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Mobile Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="10-digit number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Aadhaar Card Photo</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handlePhotoUpload}
              ref={fileInputRef}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Daily Repayment (₹)</label>
            <input
              type="text"
              className="form-control"
              value={calculateDailyRepayment()}
              disabled
            />
          </div>

          <div className="col-12 text-center mt-2">
            <button type="submit" className="btn btn-primary px-5 py-2 fw-semibold shadow-sm">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonForm;
