/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { CButton, CButtonGroup, CCol, CFormLabel, CFormSelect, CRow } from '@coreui/react';
import { FaUpload, FaUndo, FaArrowLeft } from 'react-icons/fa';
import '../css/customerForm.css';
import { useLocation, useNavigate } from 'react-router-dom';

const BankDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { personalData, employmentData } = location.state || {};
  console.log('Received Personal Data:', personalData);
  console.log('Received Employment Data:', employmentData);
  const [isCustomerDataAvailable, setIsCustomerDataAvailable] = useState(false);

  // Sample Data to Load into the Form
  const sampleData = {
    bankName: 'National Bank',
    accountType: 'Savings',
    accountNumber: '1234567890',
    address: '123 Bank Street, New York, NY',
    phoneNumber: '9876543210',
    loanType: 'homeLoan',
    purposeOfLoan: 'Home Renovation',
    loanAmount: '650000',
    comments: 'Building a new home',
  };
  const handlePrevious = () => {
    navigate(-1);
  };
  // Move setValues logic inside Formik
  return (
    <Formik
      initialValues={{
        bankName: '',
        accountType: '',
        accountNumber: '',
        address: '',
        phoneNumber: '',
        loanType: 'homeLoan',
        purposeOfLoan: '',
        loanAmount: '',
        comments: '',
      }}
      onSubmit={(bank) => {
        console.log('Form Submitted:', bank);
        const fullData = { ...personalData, ...employmentData, bankDetails: bank };
        console.log('Full Data:', fullData);
        navigate('/assets', { state: { personalData, employmentData, bankDetails: bank } });
      }}
    >
      {({ values, handleChange, setValues, handleReset }) => {
        useEffect(() => {
          const fetchedLoanData = JSON.parse(sessionStorage.getItem('customerData')); // Replace with the correct key
          setIsCustomerDataAvailable(!!fetchedLoanData);

          if (fetchedLoanData) {
            console.log('Fetched loan data:', fetchedLoanData);

            // Set the form values with fetched loan data
            setValues({
              accountNumber: fetchedLoanData.bankDetails.accountNumber || '',
              accountType: fetchedLoanData.bankDetails.accountType || '',
              address: fetchedLoanData.bankDetails.address || '',
              bankName: fetchedLoanData.bankDetails.bankName || '',
              comments: fetchedLoanData.bankDetails.comments || '',
              loanAmount: fetchedLoanData.bankDetails.loanAmount || '',
              loanType: fetchedLoanData.bankDetails.loanType || '',
              phoneNumber: fetchedLoanData.bankDetails.phoneNumber || '',
              purposeOfLoan:fetchedLoanData.bankDetails.purposeOfLoan || '',
            });
          }
        }, [setValues]); // Set the effect dependency to ensure it runs once when the form is mounted

        return (
          <div className="card p-4 mb-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex">
      <CButton
      color="success"
      onClick={handlePrevious}  // Navigate to the previous page
      title="Go Back"
    >
      <FaArrowLeft /> 
      </CButton></div>
              <h2 className="form-title mx-auto text-center">Customer Bank Detail</h2>
              <div className="d-flex">
              {!isCustomerDataAvailable && (
                <>
                  {/* Show Load Data button */}
                  <CButton
                    color="info"
                    className="me-2"
                    onClick={() => setValues(sampleData)}
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
            <Form>
              <div className="form-sections mt-4">
                <h5 className="section-title">Loan Detail</h5>
                {/* Loan Type Dropdown */}
                <CRow className="mb-4">
                  <CCol md={6}>
                    <label htmlFor="loanType" className="form-label">Loan Type</label>
                    <Field as="select" id="loanType" name="loanType" className="form-control" disabled>
                      <option value="">Select Loan Type</option>
                      <option value="homeLoan">Home Loan</option>
                      <option value="personalLoan">Personal Loan</option>
                      <option value="vehicleLoan">Vehicle Loan</option>
                      <option value="educationalLoan">Educational Loan</option>
                    </Field>
                  </CCol>

                  {/* Loan Amount */}
                  <CCol md={6}>
                    <label htmlFor="loanAmount" className="form-label">Loan Amount</label>
                    <Field
                      type="number"
                      id="loanAmount"
                      name="loanAmount"
                      className="form-control"
                      placeholder="Enter loan amount"
                    />
                  </CCol>
                </CRow>

                {/* Purpose of Loan - Button Group */}
                <div className="mb-3">
                  <label htmlFor="purposeOfLoan" className="form-label">Purpose of Loan</label>
                  <CButtonGroup>
                    <CButton
                      value="Home Renovation"
                      color={values.purposeOfLoan === "Home Renovation" ? "primary" : "outline-primary"}
                      onClick={() => handleChange({ target: { name: 'purposeOfLoan', value: 'Home Renovation' } })}
                    >
                      Home Renovation
                    </CButton>
                    <CButton
                      value="Medical Expenses"
                      color={values.purposeOfLoan === "Medical Expenses" ? "primary" : "outline-primary"}
                      onClick={() => handleChange({ target: { name: 'purposeOfLoan', value: 'Medical Expenses' } })}
                    >
                      Medical Expenses
                    </CButton>
                    <CButton
                      value="Education"
                      color={values.purposeOfLoan === "Education" ? "primary" : "outline-primary"}
                      onClick={() => handleChange({ target: { name: 'purposeOfLoan', value: 'Education' } })}
                    >
                      Education
                    </CButton>
                    <CButton
                      value="Business Expansion"
                      color={values.purposeOfLoan === "Business Expansion" ? "primary" : "outline-primary"}
                      onClick={() => handleChange({ target: { name: 'purposeOfLoan', value: 'Business Expansion' } })}
                    >
                      Business Expansion
                    </CButton>
                  </CButtonGroup>
                </div>

                {/* Additional Comments */}
                <div className="mb-3">
                  <label htmlFor="comments" className="form-label">Additional Comments</label>
                  <Field as="textarea" id="comments" name="comments" className="form-control" placeholder="Add any comments" />
                </div>
              </div>

              <div className="form-sections">
                <h5 className="section-title">Details</h5>
                <div className="mb-3">
                  <CRow className="mb-4">
                    <CCol md={4}>
                      <label htmlFor="bankName" className="form-label">Bank Name</label>
                      <Field type="text" id="bankName" name="bankName" className="form-control" />
                    </CCol>
                  </CRow>
                </div>

                <CRow className="mb-4">
                  <CCol md={4}>
                    <label htmlFor="accountType" className="form-label">Account Type</label>
                    <Field as="select" id="accountType" name="accountType" className="form-control">
                      <option value="">Select Account Type</option>
                      <option value="Savings">Savings</option>
                      <option value="Checking">Checking</option>
                    </Field>
                  </CCol>

                  <CCol md={4}>
                    <label htmlFor="accountNumber" className="form-label">Account Number</label>
                    <Field
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      className="form-control"
                    />
                  </CCol>
                  <CCol md={4}>
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                    <Field type="text" id="phoneNumber" name="phoneNumber" className="form-control" />
                  </CCol>
                </CRow>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <Field as="textarea" id="address" name="address" className="form-control" />
                </div>
              </div>

              <div className="d-md-flex justify-content-md-end mt-3">
                <CButton type="submit" color="primary">Next</CButton>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default BankDetailsForm;
