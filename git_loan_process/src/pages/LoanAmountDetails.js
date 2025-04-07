/* eslint-disable prettier/prettier */
import { CFormLabel, CFormSelect } from '@coreui/react'
import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const LoanAmountDetails = (props) => {
  const URL = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()

  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const [loanData, setLoanData] = useState(null)
  useEffect(() => {
    axios
      .get(`${URL}/calculateTenureInterest`)
      .then((response) => {
        setLoanData(response.data)
        if (response.data.taskIds && response.data.taskIds.length > 0) {
          const idTask = response.data.taskIds[0]
          // console.log(idTask, "idTask");
          localStorage.setItem('id', idTask)
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const formik = useFormik({
    enableReinitialize: true, // Allows updating initial values dynamically
    initialValues: {
      loanType: loanData?.customerReply?.loanType || 'Home Loan',
      loanAmount: loanData?.loanAmount || '',
      loanAccountNumber: loanData?.loanAccountNumber || '',
      applicantName: loanData?.applicantName || '',
      repayLoan: '4 month',
      emiAmount: '6000',
      intrestRate: loanData?.interestRate || '',
      expectedDate: loanData?.billDate|| '2025-05-10',
      repayDuration: loanData?.tenure || '',
      taskId: loanData?.taskIds[0],
    },
    onSubmit: (values) => {
      console.log('Submitted Data:', values)
    },
  })
 
  const processInstance = localStorage.getItem('id')
  console.log('process Instance id retrived', processInstance)
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!processInstance) {
      console.error("Task ID is missing.");
      setLoading(false);
      return;
    }
    const updatedLoanTerm = formik.values.repayDuration;
    const updatedLoanData = { 
      ...loanData, 
      tenure: updatedLoanTerm
    }
    const payload = {
      OldData: loanData,
      NewData: updatedLoanData,
      customer: status,
    };
  console.log("payload---------------",payload);
  
    try {
      const response = await axios.post(
        `${URL}/customerAcknowledgement/${processInstance}`,
        payload
      );
  
      console.log("Handle Approve Response:", response.data);
  
      // Check if status is "Accept" (Use correct string comparison)
      if (status === "Accept") {
        Swal.fire({
          icon: "success",
          title: "Accepted",
          confirmButtonColor: "#28a745",
        });
      }
  
      // Navigate to home after success
      navigate("/home");
    } catch (error) {
      console.error("Error approving task:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };
  
 

  return (
    <div className="container mt-5 mb-5">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="form-title mb-4 mx-auto text-center">Loan Acknowledgement</h2>
        </div>

        <form onSubmit={handleSubmit} id="myForm">
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
                  <option value="homeLoan">Home Loan</option>
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
              <label htmlFor="repayDuration" className="form-label">Loan Term</label>
              <input
                type="text"
                className={`form-control ${formik.touched.repayDuration && formik.errors.repayDuration ? 'is-invalid' : ''}`}
                id="Repay_Duration"
                name="repayDuration"
                value={formik.values.repayDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={status !== "modify"}  // Enable only if "modify" is selected
              />
              {formik.touched.repayDuration && formik.errors.repayDuration && (
                <div className="invalid-feedback">{formik.errors.repayDuration}</div>
              )}
            </div>
            

              <div className="col-md-4">
              <label htmlFor="repayDuration" className="form-label">
                Decision
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="form-control"
              >
                <option value="">Select</option>
                <option value="Approved">Accept</option>
                <option value="modify">Modification Needed</option>
                <option value="reject">Reject</option>
              </select>
            </div>
            </div>
           


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

            <div
              className="mt-4"
              style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}
            >
            <button  className="btn btn-primary "
            type="submit">Submit</button>

            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoanAmountDetails
