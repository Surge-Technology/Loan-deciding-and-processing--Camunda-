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
const navigate=useNavigate();
 
 
   
    const [isAcknowledged, setIsAcknowledged] = useState(false);
  const[loanData,setLoanData]=useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8080/calculateTenureInterest")
      .then((response) => {
        setLoanData(response.data); // Store API response
        if (response.data.taskIds && response.data.taskIds.length > 0) {
          const idTask = response.data.taskIds[0];
          console.log(idTask, "idTask");
          localStorage.setItem("id", idTask); // Store in localStorage
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
}, []);

    
      const formik = useFormik({
        enableReinitialize: true, // Allows updating initial values dynamically
        initialValues: {
          loanType: loanData?.customerReply?.loanType || "",
          loanAmount: loanData?.loanAmount || "",
          loanAccountNumber:loanData?.loanAccountNumber||"",
          applicantName:loanData?.applicantName||"",
          repayLoan: "4 month",
          emiAmount: "6000",
          intrestRate: loanData?.interestRate || "",
          expectedDate: "2027-10-19",
          repayDuration: loanData?.tenure || "",
          taskId:loanData?.taskIds[0]
        },
        onSubmit: (values) => {
          console.log("Submitted Data:", values);
        //   axios
        //     .post("http://localhost:8080/customerAcknowledgement/${loanData.taskIds[0]}", values)
        //     .then((response) => console.log("Response:", response.data))
        //     .catch((error) => console.error("Error submitting form:", error));
        },
      });
    
    //   useEffect(() => {
    //     if (loanData?.taskIds?.[0]) {
    //         localStorage.setItem("taskId", loanData.taskIds[0]);
    //     }
    // }, [loanData]);
 
 
    const processInstance = localStorage.getItem('processId');
    console.log("process Instance id retrived",processInstance);
    
 
    const handleApprove = async (loanId) => {
        const getTaskId = localStorage.getItem("id");
        console.log(getTaskId);
        alert("getTaskId",getTaskId)
        
    if (!getTaskId) {
        console.error("Task ID is missing.");
        return;
    }
        // const taskId = localStorage.getItem("taskId");
        const approve = {
          customer: 'Approved', // Use an appropriate key for the backend
          // approver: storedUser // Store the approver’s username
        }
    
        try {
          const response = await axios.post(`${URL}/customerAcknowledgement/${getTaskId}`, approve)
          console.log('Handle Approve Response:', response.data)
          // toast.success(`Loan ID ${loanId} has been Approved ✅`, { position: "top-right" });
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Approved',
            // text: `Loan has been Approved`,
            confirmButtonColor: '#28a745',
          })
          navigate('/home')
        } catch (error) {
          console.error('Error approving task:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Loan ID has been Approved`,
            confirmButtonColor: '#d33',
          })
        }
    
        // alert(`Loan ID ${loanId} has been Approved`);
      }
    
      const handleReject = (loanId) => {
        const taskId = localStorage.getItem("taskId");
        
        const reject = {
         Customer: 'Reject',
          // approver: storedUser
        }
    
        const response = axios.post(` ${URL}/customerAcknowledgement/${taskId}`, reject)
        console.log('handle reject', response)
        // toast.success(`Loan ID ${loanId} has been Rejected ❌`, { position: "top-right" });
        navigate('/home')
        // alert(`Loan ID ${loanId} has been Rejected`);
      }
    
 
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
            <label htmlFor="loanAmount">Loan Amount</label>
            <input
              type="text"
              className="form-control"
              id="loanAmount"
              disabled
              name="loanAmount"
              value={formik.values.loanAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
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
        //   type='submit'
        onClick={() => handleApprove()}
        //   onClick={handleApprove(loanData?.loanId)}
        //   disabled={!isAcknowledged} // Disable button if not acknowledged
        >
          Approve
        </button>
        <button className="btn btn-danger"
        // type='submit'
      onClick={() => handleReject()}

        //  onClick={handleReject(loanData?.loanId)}
        >
          Reject
        </button>
      </div>
                    </div>
                </form>
            </div>
        </div >
    )
 
}
 
 
 
export default LoanAmountDetails;