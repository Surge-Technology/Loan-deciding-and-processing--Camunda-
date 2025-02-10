/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CFormCheck } from '@coreui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 
const LoanDisbursementForm = () => {
  const navigate=useNavigate();
  const URL = import.meta.env.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    disbursementAmount: '',
    disbursementDate: '',
    disbursementMethod: 'bankTransfer',
    disbursementStatus: 'completed',
    interestRate: '',
    repaymentStartDate: '',
    loanTerm: '',
    repaymentFrequency: 'monthly',
    processingFees: '',
    receiptConfirmation: 'confirmed',
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [finalDecision, setFinalDecision] = useState("");

  useEffect(() => {
    // Retrieve the stored value from session storage
    const storedDecision = sessionStorage.getItem("finalDecision");
    console.log("print",storedDecision);
    
    if (storedDecision) {
      setFinalDecision(storedDecision);
    }
  }, []);
  // const handleSubmit =async (e) => {
    
  //   e.preventDefault();
  //   const payload = {
     
  //     finalDecision: finalDecision, 
  //   };  
  //   console.log("67890",payload);
      
  //   try {
  //           const response = await axios.post(`${URL}/loanApproval`, payload);
  //     console.log("API Response:", response);

  //     navigate("/taskInbox");
  //   } catch (error) {
  //     console.error("Error during API submission:", error);
  //   }
  //   console.log(formData);
  // };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const emailResponse = await axios.get(`${URL}/getEmail`);
      let emailId = emailResponse.data; 
  
      console.log("Fetched Email ID:", emailId);
  
      const disbursementResponse = await axios.post(`${URL}/saveDisbursementDetails/${emailId}`, formData);
      console.log("Disbursement API Response:", disbursementResponse.data);
  
      const payload = {
        finalDecision: finalDecision, 
      };
      console.log("Loan Approval Payload:", payload);
  
      const loanApprovalResponse = await axios.post(`${URL}/loanApproval`, payload);
      console.log("Loan Approval API Response:", loanApprovalResponse.data);
  
      navigate("/taskInbox");
  
    } catch (error) {
      console.error("Error during API calls:", error);
    }
  };
  
  return (
    <div className="container mb-5 mt-5 card p-4">
      <h2 className="text-center mb-4">Loan Disbursement Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="disbursementAmount" className="form-label"
            >Disbursement Amount</label>
            <input
              type="number"
              className="form-control"
              id="disbursementAmount"
              name="disbursementAmount"
              value={formData.disbursementAmount}
              onChange={handleChange}
              placeholder="Enter disbursement amount"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="disbursementDate" className="form-label">Disbursement Date</label>
            <input
              type="date"
              className="form-control"
              id="disbursementDate"
              name="disbursementDate"
              value={formData.disbursementDate}
              onChange={handleChange}
            />
          </div>
        </div>
 
        <div className="row mt-3">
          <div className='col-md-6'>
            <label className="form-label">Disbursement Method</label>
            <div>
              <CFormCheck
                inline
                type="radio"
                name="disbursementMethod"
                id="bankTransfer"
                value="bankTransfer"
                label="Bank Transfer"
                checked={formData.disbursementMethod === "bankTransfer"}
                onChange={handleChange}
              />
              <CFormCheck
                inline
                type="radio"
                name="disbursementMethod"
                id="check"
                value="check"
                label="Cheque"
                checked={formData.disbursementMethod === "check"}
                onChange={handleChange}
              />
              <CFormCheck
                inline
                type="radio"
                name="disbursementMethod"
                id="cash"
                value="cash"
                label="Cash"
                checked={formData.disbursementMethod === "cash"}
                onChange={handleChange}
              />
 
            </div>
 
          </div>
 
          <div className="col-md-6">
            <label htmlFor="disbursementStatus" className="form-label">Disbursement Status</label>
            <div>
              <CFormCheck
                inline
                type="radio"
                name="disbursementStatus"
                id="pending"
                value="pending"
                label="Pending"
                checked={formData.disbursementStatus === "pending"}
                onChange={handleChange}
              />
              <CFormCheck
                inline
                type="radio"
                name="disbursementStatus"
                id="completed"
                value="completed"
                label="Completed"
                checked={formData.disbursementStatus === "completed"}
                onChange={handleChange}
              />
              <CFormCheck
                inline
                type="radio"
                name="disbursementStatus"
                id="failed"
                value="failed"
                label="Failed"
                checked={formData.disbursementStatus === "failed"}
                onChange={handleChange}
              />
 
            </div>
          </div>
        </div>
 
        <div className="row mt-3">
          <div className='col-md-6'>
            <label htmlFor="interestRate" className="form-label">Interest Rate (%)</label>
            <input
              type="number"
              className="form-control"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              placeholder="Enter interest rate"
            />
          </div>
 
          <div className="col-md-6">
            <label htmlFor="repaymentStartDate" className="form-label">Repayment Start Date</label>
            <input
              type="date"
              className="form-control"
              id="repaymentStartDate"
              name="repaymentStartDate"
              value={formData.repaymentStartDate}
              onChange={handleChange}
            />
          </div>
        </div>
 
        <div className="row mt-3">
        <div className='col-md-6'>
            <label htmlFor="loanTerm" className="form-label">Loan Term (in years)</label>
            <input
              type="number"
              className="form-control"
              id="loanTerm"
              name="loanTerm"
              value={formData.loanTerm}
              onChange={handleChange}
              placeholder="Enter loan term"
            />
          </div>
          <div className='col-md-6'>
            <label htmlFor="processingFees" className="form-label">Processing Fees (Admin/Legal, etc.)</label>
            <input
              type="number"
              className="form-control"
              id="processingFees"
              name="processingFees"
              value={formData.processingFees}
              onChange={handleChange}
              placeholder="Enter processing fees"
            />
          </div>
 
 
        </div>
 
        <div className="row mt-3">
 
          <div className="col-md-6">
            <label htmlFor="repaymentFrequency" className="form-label">Repayment Frequency</label>
            <div>
              <CFormCheck
                inline
                type="radio"
                name="repaymentFrequency"
                id="monthly"
                value="monthly"
                label="Monthly"
                checked={formData.repaymentFrequency === "monthly"}
                onChange={handleChange}
              />
              <CFormCheck
                inline
                type="radio"
                name="repaymentFrequency"
                id="quarterly"
                value="quarterly"
                label="Quarterly"
                checked={formData.repaymentFrequency === "quarterly"}
                onChange={handleChange}
              />
              <CFormCheck
                inline
                type="radio"
                name="repaymentFrequency"
                id="annually"
                value="annually"
                label="Annually"
                checked={formData.repaymentFrequency === "annually"}
                onChange={handleChange}
              />
 
            </div>
          </div>
 
          <div className="col-md-6">
            <label htmlFor="receiptConfirmation">Customer Confirming the Receipt of Funds</label>
            <div>
              <CFormCheck
                inline
                type="radio"
                name="receiptConfirmation"
                id="confirmed"
                value="confirmed"
                label="Confirmed"
                checked={formData.receiptConfirmation === "confirmed"}
                onChange={handleChange}
              />
              <CFormCheck
                inline
                type="radio"
                name="receiptConfirmation"
                id="notConfirmed"
                value="notConfirmed"
                label="Not Confirmed"
                checked={formData.receiptConfirmation === "notConfirmed"}
                onChange={handleChange}
              />
 
            </div>
          </div>
        </div>
 
        <div className="form-group text-center mt-4">
          <button type="submit" className="btn btn-primary submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
 
export default LoanDisbursementForm;