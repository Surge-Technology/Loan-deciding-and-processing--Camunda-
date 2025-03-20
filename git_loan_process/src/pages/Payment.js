/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2'
import { useLocation,useNavigation ,useNavigate} from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const location = useLocation();
  const nav = useLocation();
  // const nav =useNavigate()
  const payload = location.state?.payload;
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
  };

  const validateFields = () => {
    let isValid = true;
    let newErrors = { cardNumber: "", expiry: "", cvv: "" };

    if (paymentMethod === "card") {
      if (!/^\d{16}$/.test(cardDetails.cardNumber)) {
        newErrors.cardNumber = "Card number must be 16 digits";
        isValid = false;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = "Expiry must be in MM/YY format";
        isValid = false;
      }

      if (!/^\d{3}$/.test(cardDetails.cvv)) {
        newErrors.cvv = "CVV must be 3 digits";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePayment = () => {
    console.log(payload,"payload from payment");
    
    if (validateFields()) {
      axios.post(`http://localhost:8080/start-payment`,payload)
        .then((res) => {
          //   alert("Payment Processed Successfully!");
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `${res.data}`,
            showConfirmButton: true,
          })
        })
        nav('/applicantdashboard')
    } 
    
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", margin: "auto" }}>
        <h3 className="text-center mb-4">Payment Screen</h3>

        <div className="mb-3">
          <label className="form-label">Select Payment Method</label>
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="netbanking">Net Banking</option>
          </select>
        </div>

        {paymentMethod === "card" && (
          <>
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                type="text"
                className={`form-control ${errors.cardNumber && "is-invalid"}`}
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
              />
              <div className="invalid-feedback">{errors.cardNumber}</div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  className={`form-control ${errors.expiry && "is-invalid"}`}
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                />
                <div className="invalid-feedback">{errors.expiry}</div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">CVV</label>
                <input
                  type="password"
                  className={`form-control ${errors.cvv && "is-invalid"}`}
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                />
                <div className="invalid-feedback">{errors.cvv}</div>
              </div>
            </div>
          </>
        )}

        {paymentMethod !== "card" && (
          <div className="alert alert-info">Selected payment method: {paymentMethod}</div>
        )}

        <button className="btn btn-primary w-100 mt-3" onClick={handlePayment}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;
