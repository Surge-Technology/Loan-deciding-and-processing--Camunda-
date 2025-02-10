/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { FaUpload, FaUndo, FaArrowLeft } from "react-icons/fa";
import { CButton } from "@coreui/react";
import "../css/customerForm.css";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";

const Liabilities = () => {
  const location = useLocation();
  const [isCustomerDataAvailable, setIsCustomerDataAvailable] = useState(false);
const navigate =useNavigate();
  // Extract data passed in the state of the location object
  const { personalData, employmentData, bankDetails, assetsDetail, houseHold } =
    location.state || {};
  console.log("Full Data from Assets:", personalData);
  console.log("Received Employment Data:", employmentData);
  console.log("Received Bank Details:", bankDetails);
  console.log("Received Assets Detail:", assetsDetail);
  console.log("Received Household Detail:", houseHold);

  const formik = useFormik({
    initialValues: {
      bank: "",
      loanType: "",
      borrowerName: "",
      amountOwed: "",
      interestMonthly: "",
      currentLoanLimit: "",
      currentLoanBalance: "",
      creditCardBank: "",
      primaryCardHolder: "",
      creditCardLimit: "",
      balanceOnCard: "",
      otherLoan: false,
      otherloanType: "",
    },
    onSubmit: async (liabilitiesValue) => {
      if (formAction === "next") {
        // No navigation or alerts, process the form for 'Next'
        navigate('/document',{ state: { personalData, employmentData , bankDetails,assetsDetail,houseHold,liabilities:liabilitiesValue} });
        console.log("Next action triggered with values:", liabilitiesValue);
      } else if (formAction === "submit") {
        // No navigation or alerts, process the form for 'Submit'

        
        console.log("Submit action triggered with values:", liabilitiesValue);
      }
      // event.preventDefault();
      // if (formAction === "next") {
      //   // Navigate to the next page
      //   const cleanedState = JSON.parse(
      //     JSON.stringify({
      //       personalData,
      //       employmentData,
      //       bankDetails,
      //       assetsDetail,
      //       houseHold,
      //       liabilitiesValue: values,
      //     })
      //   );
      //   navigate("/document", { state: cleanedState });
      //   console.log("Navigating to the next page with values:", values);
      // } else if (formAction === "submit") {
      //   // Show an alert
      //   alert("Form Submitted Successfully!");
      //   console.log("Form submitted:", values);
      // }
    },
  });
  const [formAction, setFormAction] = useState("");
  useEffect(() => {
    const fetchedData = JSON.parse(sessionStorage.getItem('customerData'));
    setIsCustomerDataAvailable(!!fetchedData);

    if (fetchedData) {
      console.log('Fetched customer data:', fetchedData);

    // When the component mounts, populate the form with loan data
    formik.setValues({
      amountOwed: fetchedData.
      liabilities
      .amountOwed,
      balanceOnCard:fetchedData. 
      liabilities
      .balanceOnCard,
      bank: fetchedData.
      liabilities
      .bank,
      borrowerName: fetchedData.liabilities.borrowerName,
      creditCardBank: fetchedData.liabilities.creditCardBank,
      creditCardLimit: fetchedData.liabilities.creditCardLimit,
      currentLoanBalance: fetchedData.liabilities.currentLoanBalance,
      currentLoanLimit: fetchedData.liabilities.currentLoanLimit,
      interestMonthly: fetchedData.liabilities.interestMonthly,
      loanType: fetchedData.liabilities.loanType,
      otherLoan: fetchedData.liabilities.otherLoan,
      otherloanType: fetchedData.liabilities.otherloanType,
      primaryCardHolder: fetchedData.liabilities.primaryCardHolder,
    });
  } else {
    console.log('No customer data found in localStorage');
  }
}, []);

  const handleLoadData = () => {
    const jsonData = {
      loans: {
        bank: "XYZ Bank",
        loanType: "Home Loan",
        borrowerName: "Kaney",
        amountOwed: "50000",
        interestMonthly: "1500",
        currentLoanLimit: "100000",
        currentLoanBalance: "30000",
      },
      cards: {
        creditCardBank: "ABC Bank",
        primaryCardHolder: "Johny",
        creditCardLimit: "50000",
        balanceOnCard: "10000",
      },
      others: {
        otherLoan: true,
        otherloanType: "Jewel Loan",
      },
    };

    formik.setValues({
      ...formik.values,
      bank: jsonData.loans.bank,
      loanType: jsonData.loans.loanType,
      borrowerName: jsonData.loans.borrowerName,
      amountOwed: jsonData.loans.amountOwed,
      interestMonthly: jsonData.loans.interestMonthly,
      currentLoanLimit: jsonData.loans.currentLoanLimit,
      currentLoanBalance: jsonData.loans.currentLoanBalance,
      creditCardBank: jsonData.cards.creditCardBank,
      primaryCardHolder: jsonData.cards.primaryCardHolder,
      creditCardLimit: jsonData.cards.creditCardLimit,
      balanceOnCard: jsonData.cards.balanceOnCard,
      otherLoan: jsonData.others.otherLoan,
      otherloanType: jsonData.others.otherloanType,
    });
  };


  const handleNext = (liabilitiesValue) => {
          // navigate('/document',{ state: { personalData, employmentData , bankDetails,assetsDetail,houseHold ,liabilities:liabilitiesValue } })

    // navigate("/document"); 
  };
  const handleReset = () => {
    formik.resetForm();
  };
  const handlePrevious = () => {
    navigate(-1);
  };
  return (
    <div className="container mt-4">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
      <CButton
      color="success"
      onClick={handlePrevious}  // Navigate to the previous page
      title="Go Back"
    >
      <FaArrowLeft /> 
      </CButton></div>
          <h2 className="form-title mb-4 mx-auto text-center">Liabilities Form</h2>
          <div className="d-flex">
          {!isCustomerDataAvailable && (
            <>
              {/* Show Load Data button */}
              <CButton
                color="info"
                className="me-2"
                onClick={handleLoadData}
                title="Load Data"
              >
                <FaUpload />
              </CButton>
        
              {/* Show Reset Form button */}
              <CButton
                color="danger"
                onClick={handleReset}
                title="Reset Form"
              >
                <FaUndo /> 
              </CButton>
            </>
          )}
        </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Loan Details */}
          <div className="form-section mt-4">
            <h5 className="section-title">Loan Information</h5>
            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="bank" className="form-label">
                  Bank
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bank"
                  name="bank"
                  value={formik.values.bank}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="loanType" className="form-label">
                  Loan Type
                </label>
                <select
                  className="form-select"
                  id="loanType"
                  name="loanType"
                  value={formik.values.loanType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select Loan Type</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Educational Loan">Educational Loan</option>
                  <option value="Credit Loan">Credit Loan</option>
                </select>
              </div>
              <div className="col-md-6 mt-3">
                <label htmlFor="borrowerName" className="form-label">
                  Borrower Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="borrowerName"
                  name="borrowerName"
                  value={formik.values.borrowerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label htmlFor="amountOwed" className="form-label">
                  Amount Owed
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="amountOwed"
                  name="amountOwed"
                  value={formik.values.amountOwed}
                  min={0}
                  step={0}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label htmlFor="interestMonthly" className="form-label">
                  Monthly Interest
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="interestMonthly"
                  name="interestMonthly"
                  min={0}
                  step={0}
                  value={formik.values.interestMonthly}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label htmlFor="currentLoanLimit" className="form-label">
                  Loan Limit
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="currentLoanLimit"
                  name="currentLoanLimit"
                  min={0}
                  step={0}
                  value={formik.values.currentLoanLimit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label htmlFor="currentLoanBalance" className="form-label">
                  Loan Balance
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="currentLoanBalance"
                  name="currentLoanBalance"
                  min={0}
                  step={0}
                  value={formik.values.currentLoanBalance}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </div>

          {/* Credit Card Details */}
          <div className="form-section mt-4">
            <h5 className="section-title">Credit Card Details</h5>
            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="creditCardBank" className="form-label">
                  Credit Card Bank
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="creditCardBank"
                  name="creditCardBank"
                  value={formik.values.creditCardBank}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="primaryCardHolder" className="form-label">
                  Primary Card Holder
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="primaryCardHolder"
                  name="primaryCardHolder"
                  value={formik.values.primaryCardHolder}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label htmlFor="creditCardLimit" className="form-label">
                  Credit Card Limit
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="creditCardLimit"
                  name="creditCardLimit"
                  min={0}
                  step={0}
                  value={formik.values.creditCardLimit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label htmlFor="balanceOnCard" className="form-label">
                  Balance on Card
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="balanceOnCard"
                  name="balanceOnCard"
                  min={0}
                  step={0}
                  value={formik.values.balanceOnCard}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </div>

          {/* Other Loans */}
          <div className="form-section mt-4">
            <h5 className="section-title">Other Loans</h5>
            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="otherLoan" className="form-label">
                  Have Other Loans?
                </label>
                <input
                  type="checkbox"
                  id="otherLoan"
                  name="otherLoan"
                  checked={formik.values.otherLoan}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="otherloanType" className="form-label">
                  Other Loan Type
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otherloanType"
                  name="otherloanType"
                  value={formik.values.otherloanType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </div>

        <div>
        {isCustomerDataAvailable ? (
          <div className="d-md-flex justify-content-md-end mt-3">
            <CButton
              type="button"
              color="primary"
              onClick={() => {
                setFormAction("submit");
                formik.handleSubmit(); // Trigger form submission
              }}
            >
              Submit
            </CButton>
          </div>
        ) : (
          <div className="d-md-flex justify-content-md-end mt-3">
            <CButton
              type="button"
              color="primary"
              onClick={() => {
                setFormAction("next");
                formik.handleSubmit(); // Trigger form submission
              }}
            >
              Next
            </CButton>
          </div>
        )}
      </div>
        </form>
      </div>
    </div>
  );
};

export default Liabilities;
