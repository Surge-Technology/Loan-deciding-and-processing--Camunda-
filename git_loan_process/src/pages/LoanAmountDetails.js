/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import { CButton, CFormLabel, CFormSelect, CRow } from '@coreui/react';
import { useFormik } from 'formik';
import { Button } from 'bootstrap';
import axios from "axios";
import { FaArrowLeft, FaUpload } from 'react-icons/fa6';
import { FaUndo } from 'react-icons/fa';
import { Select } from '@mui/material';
import Swal from 'sweetalert2';
 
 
const LoanAmountDetails = (props) => {
    const history = useNavigate();
    const [responses, setResponses] = useState([]);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [selectedAction, setSelectedAction] = useState('');
    const [query, setQuery] = useState('');
    const [showQueryBox, setShowQueryBox] = useState(false);
    const [message, setMessage] = useState('');
 
    const { userId } = useParams();
    const [storedUserId, setStoredUserId] = useState('');
 
    const userIdFromStorage = sessionStorage.getItem('email');
    const URL = import.meta.env.VITE_BASE_URL;

 
    // useEffect(() => {
 
    //     axios.get(
    //         `http://localhost:8080/getJsonDataByEmail?emailId=${userIdFromStorage}`
    //       );
    //       const data = response.data; // Get the data from the response
 
    //       setResponses(data); // Update the state with the fetched data
    //       console.log("Response:-------------------", data);
 
    //       // Set the form values with fetched data using formik.setValues
    //       formik.setValues({
    //         firstName: data.personalData.personalInfo.firstName || "",
    //         lastName: data.personalData.personalInfo.lastName || "",
    //         legalFullName: data.personalData.personalInfo.legalFullName || "",
    //         birthDate: data.personalData.personalInfo.dob || "",
    //         maritalStatus: data.personalData.personalInfo.maritalStatus || "",
    //         spouseName: data.personalData.personalInfo.spouseName || "",
    //         gender: data.personalData.personalInfo.gender || "",
    //         email: data.personalData.contactInfo.email || "",
    //         phone: data.personalData.contactInfo.phone || "",
    //         streetAddress: data.personalData.addressInfo.streetLine1 || "",
    //         streetAddress2: data.personalData.addressInfo.streetLine2 || "",
    //         city: data.personalData.addressInfo.city || "",
    //         state: data.personalData.addressInfo.state || "",
    //         zipCode: data.personalData.addressInfo.zip || "",
    //         howLongAtAddress: data.personalData.addressInfo.yearsAtAddress || "",
    //       });
 
    //       // Set the userId in the component's state
    //       setStoredUserId(userIdFromStorage);
    //     } catch (error) {
    //       console.error("Error fetching user data:", error);
    //     }
 
    // }, []);
 
    const formik = useFormik({
        initialValues: {
            loanType: "homeLoan",
                loanAmount: '4000000',
            priority: "high",
            currency: "INR",
            repayLoan: "6 months",
            intrestRate: '10%',
            expectedDate: "2027-10-19",
            emiAmount: '6000',
            // otherComments: '10-11-2030',
            repayDuration: '4years',
            purposeofLoan: '',
        },
    })
 
    const handleActionChange = (event) => {
        setSelectedAction(event.target.value);
 
        // If the selected action is 'NeedClarification', set query field to be displayed
        if (event.target.value === 'NeedClarification') {
            setQuery('');
        }
    };
 
    const [isAcknowledged, setIsAcknowledged] = useState(false);
    const handleSubmit = async () => {
        if (!isAcknowledged) {
          alert("Please acknowledge before submitting!");
          return;
        }
    
        const payload = { Customer: "Approved" };
    
        try {
          const response = await axios.post(`${URL}/customerAcknowledgement`, payload);
          console.log("Submit API Response:", response.data);
          //alert("Your Loan is Approved");
          window.close();
          if (response) {
           Swal.fire({
                   position: 'center',
                   icon: 'success',
                   title: `Thanks`,
                   confirmButtonText: "OK",
                   showConfirmButton: true,
                   timer: 1500,
                 }).then(() => {
                window.close();
            });
      
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to submit application. Please try again.",
              icon: "error",
              confirmButtonText: "Retry",
            });
          }
        //   alert("Form submitted successfully!");
        } catch (error) {
          console.error("Error during submission:", error);
        //   alert("Submission failed. Please try again.");

        }
      };
    
      // Handle Cancel Action
      const handleCancel = async () => {
        const payload = { customer: "rejected" };
    
        try {
          const response = await axios.post(`${URL}/customerApproval`, payload);
          console.log("Cancel API Response:", response.data);
          alert("Your Loan Process is cancelled");
          window.close();
        //   if (response) {
        //     Swal({
        //       text: "Your Loan Process is cancelled",
             
        //       confirmButtonText: "OK",
        //     }).then(() => {
        //         window.close();
        //     });
      
        //   }
        //  alert("Form canceled successfully!");
        } catch (error) {
        //   console.error("Error during cancellation:", error);
        //   alert("Cancellation failed. Please try again.");
        }
      };
    
 
 
 
    const handleLoadData = () => {
        const jsonData = {
            loanType: "Home Loan",
            loanAmount: "4,00,000",
            priority: "high",
            currency: "INR",
            repayLoan: "6months",
            intrestRate: "9%",
            expectedDate: "20/12/28",
            emiAmount: "50000",
            otherComments: "NA",
            repayDuration: "4years",
            purposeofLoan: "construction",
 
        };
 
        formik.setValues({
            ...formik.values,
            loanType: jsonData.loanType,
            loanAmount: jsonData.loanAmount,
            priority: jsonData.priority,
            currency: jsonData.currency,
            repayLoan: jsonData.repayLoan,
            intrestRate: jsonData.intrestRate,
            expectedDate: jsonData.expectedDate,
            emiAmount: jsonData.emiAmount,
            repayDuration: jsonData.repayDuration,
            purposeofLoan: jsonData.purposeofLoan,
        });
    };
 
 
 
    
 
    return (
        <div className="container mt-5 mb-5">
            <div className="card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  
                    <h2 className="form-title mb-4 mx-auto text-center">Loan Acknowledgement</h2>
                   
                </div>
 
 
                <form onSubmit={formik.handleSubmit} id='myForm'>
                    <div className="form-section">
                        {/* <h5 className="section-title">Loan Details</h5> */}
                        <div className="row mt-2">
                            {/*Loan Type*/}
                            <div className="col-md-6">
                                <CFormLabel htmlFor="loanType">Loan Type </CFormLabel>
                                <CFormSelect
                                    // id="loanType"
                                    name="loanType"
                                    value={formik.values.loanType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-label="Loan Type"
                                    disabled
                                >
                                    <option value="" disabled>
                                        Select Loan Type
                                    </option>
                                    <option value="homeLoan" >Home Loan</option>
                                    <option value="personalLoan">Personal Loan</option>
                                    <option value="vehicleLoan">Vehicle Loan</option>
                                    <option value="educationalLoan">Educational Loan</option>
                                    
                                </CFormSelect>
 
                                {formik.touched.loanType && formik.errors.loanType && (
                                    <div className="invalid-feedback">{formik.errors.loanType}</div>
                                )}
                            </div>
                            {/* Loan Amount */}
                            <div className="col-md-6">
                                <label htmlFor="loanAmount" className="form-label">
                                    Loan Amount
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${formik.touched.loanAmount && formik.errors.loanAmount ? 'is-invalid' : ''}`}
                                    id="loanAmount"
                                    disabled
                                    name="loanAmount"
                                    value={formik.values.loanAmount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.loanAmount && formik.errors.loanAmount && (
                                    <div className="invalid-feedback">{formik.errors.loanAmount}</div>
                                )}
                            </div>
                        </div>
                        {/* <div className="form-section mt-2"> */}
                            {/* RepayLoan, IntrestRate and Emi-Amount*/}
                           
                                <div className="row mt-3">
                                    {/* Repay loan */}
                                    <div className="col-md-6">
                                        <label htmlFor="repayLoan" className="form-label">
                                        Repay Loan
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.repayLoan && formik.errors.repayLoan ? 'is-invalid' : ''}`}
                                            id="repayLoan"
                                            name="repayLoan"
                                            disabled
                                            value={formik.values.repayLoan}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.repayLoan && formik.errors.repayLoan && (
                                            <div className="invalid-feedback">{formik.errors.repayLoan}</div>
                                        )}
                                    </div>
 
 
 
                                    {/* Emi Amount*/}
                                    <div className="col-md-6">
                                        <label htmlFor="emiAmount" className="form-label">
                                            EMI Amount 
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.emiAmount && formik.errors.emiAmount ? 'is-invalid' : ''}`}
                                            id="emiAmount"
                                            name="emiAmount"
                                            disabled
                                            value={formik.values.emiAmount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.emiAmount && formik.errors.emiAmount && (
                                            <div className="invalid-feedback">{formik.errors.emiAmount}</div>
                                        )}
                                    </div>
                                </div>
 
                            <div className="row mt-3">
                                {/* intrest Rate*/}
                                <div className="col-md-4">
                                    <label htmlFor="intrestRate" className="form-label">
                                        Interest Rate 
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.intrestRate && formik.errors.intrestRate ? 'is-invalid' : ''}`}
                                        id="phone"
                                        name="phone"
                                        disabled
                                        value={formik.values.intrestRate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.intrestRate && formik.errors.intrestRate && (
                                        <div className="invalid-feedback">{formik.errors.intrestRate}</div>
                                    )}
                                </div>
 
 
                                <div className="col-md-4">
                                    <label htmlFor="expectedDate" className="form-label">
                                        Expected Date 
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-control ${formik.touched.expectedDate && formik.errors.expectedDate ? 'is-invalid' : ''}`}
                                        id="expectedDate"
                                        name="expectedDate"
                                        disabled
                                        value={formik.values.expectedDate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.expectedDate && formik.errors.expectedDate && (
                                        <div className="invalid-feedback">{formik.errors.expectedDate}</div>
                                    )}
                                </div>
 
                                <div className="col-md-4">
                                    <label htmlFor="repayDuration" className="form-label">
                                        Loan Term
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formik.touched.repayDuration && formik.errors.repayDuration ? 'is-invalid' : ''}`}
                                        id="Repay_Duration"
                                        disabled
                                        name="Repay_Duration"
                                        value={formik.values.repayDuration}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        min="1"
                                    />
                                    {formik.touched.repayDuration && formik.errors.repayDuration && (
                                        <div className="invalid-feedback">{formik.errors.repayDuration}</div>
                                    )}
                                </div>
                            </div>
                        {/* </div> */}
 
                        <div className="form-group mt-3">
                        <input
                          type="checkbox"
                          id="acknowledge"
                          checked={isAcknowledged}
                          onChange={(e) => setIsAcknowledged(e.target.checked)}
                        />
                        <label htmlFor="acknowledge" className="ms-2">
                          I acknowledge that I have reviewed the terms and conditions.
                        </label>
                      </div>
 
                       
                      <div className="mt-4" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <button
          className="btn btn-primary "
          onClick={handleSubmit}
        //   disabled={!isAcknowledged} // Disable button if not acknowledged
        >
          Submit
        </button>
        <button className="btn btn-danger" onClick={handleCancel}>
          Cancel
        </button>
      </div>
                    </div>
                </form>
            </div>
        </div >
    )
 
}
 
 
 
export default LoanAmountDetails;