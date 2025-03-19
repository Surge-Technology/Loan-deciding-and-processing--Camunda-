/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { RadialGauge } from 'react-canvas-gauges' // Using a semi-circle gauge
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
const UnderWriter = (loan) => {
  //   const [creditScore] = useState(720); // Static value (Fetch dynamically if needed)
  const [riskFactors, setRiskFactors] = useState([])
  const [Decision, setDecision] = useState('')
  const [clarification, setClarification] = useState('')
  const [legalReview, setLegalReview] = useState('')
  const URL = import.meta.env.VITE_BASE_URL
  const [creditScore, setCreditScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loanDetails, setLoanDetails] = useState(null)
  const [emailId, setEmailId] = useState('')
  const [annualIncome, setAnnualIncome] = useState('')
  const [age, setAge] = useState('')

  const [downloadFiles, setDownloadedfiles] = useState([])
  const [creditScoreLoading, setCreditScoreLoading] = useState(false)

  const navigate = useNavigate()

  const storedUser = localStorage.getItem('username')
  const processInstance = localStorage.getItem('processId')
  console.log('process Instance id retrived', processInstance)

  useEffect(() => {
    const loanId = localStorage.getItem('selectedLoanId')
    const taskId = localStorage.getItem(`taskId_${loanId}`)
    console.log(taskId, '***********taskIds------')
    const fetchLoanDetail = async () => {
      try {
        const storedUser = localStorage.getItem('username') // Get logged-in user role
        console.log('Fetching loan details for:', storedUser)

        const response = await axios.get(`${URL}/getActiveTask?user=${storedUser}`)

        if (response.data.length > 0) {
          // Extract relevant loan applications
          const formattedLoans = response.data
            .map((task) => {
              const loan = task.loanDetails // Extracting loanDetails object
              const cibilCheck = task

              if (!loan) return null // Skip if no loan details

              return {
                loanAccountNumber: loan.loanAccountNumber,
                applicantName: loan.applicantName,
                loanType: loan.loanType,
                loanStatus: loan.loanStatus,
                loanAmount: loan.loanAmount,
                emailId: loan.emailId,
                age: cibilCheck.age,
                annualIncome: cibilCheck.annualIncome,
              }
            })
            .filter(Boolean)

          if (formattedLoans.length > 0) {
            console.log('Loan Details Extracted:', formattedLoans)
            setLoanDetails(formattedLoans[0])
            setEmailId(formattedLoans[0].emailId)
            setAnnualIncome(formattedLoans[0].annualIncome)
            setAge(formattedLoans[0].age)
            console.log('check', formattedLoans[0].annualIncome)
          } else {
            console.warn('No loans found for this user.')
          }
        } else {
          console.warn('No response data found.')
        }
      } catch (error) {
        console.error('Error fetching loan details:', error)
      } finally {
        setLoanLoading(false)
      }
    }

    fetchLoanDetail()
  }, [])
  const fetchCreditScore = async () => {
    // setLoading(true); // Show spinner
    setCreditScoreLoading(true)
    setShowCreditScore(false)
    console.log(annualIncome, '234')
    console.log(age, '123456')

    try {
      const response = await axios.get(
        `${URL}/calculateCibilScore?age=${age}&annualIncome=${annualIncome}`,
      )
      console.log('CIBIL Score API Response:', response.data)

      if (response.data) {
        setTimeout(() => {
          setCreditScore(Number(response.data)) // Ensure it's a number
          setCreditScoreLoading(false)
          setShowCreditScore(true)
        }, 1000) // Delay to show spinner
      } else {
        console.warn('Invalid CIBIL Score response:', response.data)
        setCreditScoreLoading(false)
      }
    } catch (error) {
      console.error('Error fetching credit score:', error)
      setCreditScoreLoading(false)
    }
  }

  const handleRiskChange = (event) => {
    const { value, checked } = event.target
    setRiskFactors((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
  }

  const handleDownload = async () => {
    const downloadResponse = await fetch(`${URL}/downloadEmail?emailId=${emailId}`, {
      method: 'GET',
    })
    if (downloadResponse == 200) {
    }
  }
  const handleCancel = () => {
    navigate('/loanApproverDashboard')
  }
  const [loadingAction, setLoadingAction] = useState(false)
  const handleSubmit = async () => {
    if (!Decision) {
      Swal.fire({
        icon: 'warning',
        // title: 'Error',
        text: 'Please fill Underwriter Decision!',
        confirmButtonColor: '#d33',
      })
      return
    }

    if (Decision === 'needClarification' && !clarification.trim()) {
      alert('Clarification content cannot be empty.')
      return
    }

    const storedUser = localStorage.getItem('username')
    // const taskId = localStorage.getItem(`taskId_${loanId}`);
    const loanId = localStorage.getItem('selectedLoanId')
    const taskId = localStorage.getItem(`taskId_${loanId}`)
    console.log(taskId, '***********taskIds------')
    // Construct requestPayload as a local variable
    const requestPayload = {
      Decision: Decision,
      ...(Decision === 'needClarification' && { clarificationDetails: clarification }), // Add only if needed
    }
    setLoadingAction(true)
    try {
      //  const response = axios.post(` ${URL}/${storedUser}?processInstanceId=${processInstance}`
      const response = await axios.post(
        `${URL}/${storedUser}?processInstanceId=${processInstance}&id=${taskId}`,
        requestPayload,
      )
      console.log('API Response:', response.data)

      // Show success message
      Swal.fire({
        icon: 'success',
        title: `${Decision}`,
        // text: `Loan has been ${decision}!`,
        confirmButtonColor: '#28a745',
      })
      navigate('/loanApproverDashboard')
    } catch (error) {
      console.error('Error submitting decision:', error)
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Error',
      //     text: 'Failed to process request. Try again!',
      //     confirmButtonColor: '#d33',
      //   })
    } finally {
      setLoadingAction(false) // Reset loading after API call
    }
  }

  const handlePrevious = () => {
    navigate(-1)
  }

  const handleDownloadDocs = () => {
    axios
      .get(`${URL}/downloadEmail?emailId=${emailId}`, {
        responseType: 'blob', // Important for file downloads
      })
      .then((response) => {
        console.log('Response...', response)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Files downloaded sucessfully `,
          showConfirmButton: false,
          timer: 1500,
        })
        console.log('File downloaded successfully', response.data)
        {
        }
      })
      .catch((error) => {
        console.error('Error downloading file:', error.message)
        //globalToast('Failed to download files. Please try again later.')
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to download files. Please try again later!',
          confirmButtonColor: '#d33',
        })
      })
  }

  const [showCreditScore, setShowCreditScore] = useState(false)
  const [loanLoading, setLoanLoading] = useState(true)

  return (
    <CCard className="shadow-lg mt-4">
      <CCardHeader
        style={{ backgroundColor: '#33bbff', color: 'white' }}
        className="d-flex justify-content-between align-items-center"
      >
        {/* Back Button (Left Side) */}
        <CButton color="success" onClick={handlePrevious} title="Go Back">
          <FaArrowLeft /> Back
        </CButton>

        {/* Centered Title */}
        <h5>Underwriter Form</h5>
        {/* Empty Space (Right Side) to Maintain Alignment */}
        <div></div>
      </CCardHeader>

      <CCardBody>
        <CRow className="mb-4">
          {/* Left - Loan Details */}
          <CCol md="6">
            <CCard className="shadow-sm p-3">
              <CCardHeader className="bg-light">
                <strong>Loan Details</strong>
              </CCardHeader>
              <CCardBody>
                {loanLoading ? (
                  <p>Loading Loan Details...</p>
                ) : loanDetails ? (
                  <CRow>
                    <CCol md="12">
                      <strong>Loan Account Number:</strong> {loanDetails.loanAccountNumber}
                    </CCol>
                    <CCol md="12">
                      <strong>Applicant Name:</strong> {loanDetails.applicantName}
                    </CCol>
                    <CCol md="12">
                      <strong>Type of Loan:</strong> {loanDetails.loanType}
                    </CCol>
                    <CCol md="12">
                      <strong>Amount:</strong> ₹{loanDetails.loanAmount}
                    </CCol>
                  </CRow>
                ) : (
                  <p className="text-danger">No loan details available.</p>
                )}
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md="6" className="d-flex flex-column align-items-center">
            {/* Button to Get Credit Score */}
            <CButton color="primary" size="lg" className="mb-3" onClick={fetchCreditScore}>
              Get Credit Score
            </CButton>

            {/* Show Spinner While Loading Credit Score */}
            {creditScoreLoading && (
              <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
            )}

            {/* Show Credit Score Chart After Loading */}
            {showCreditScore && !creditScoreLoading && (
              <div className="text-center">
                <h6>
                  <strong>Credit Score</strong>
                </h6>
                <RadialGauge
                  width={250}
                  height={150}
                  minValue={300}
                  maxValue={850}
                  value={creditScore}
                  majorTicks={['300', '400', '500', '600', '700', '800', '850']}
                  highlights={[
                    { from: 300, to: 599, color: 'red' },
                    { from: 600, to: 699, color: 'yellow' },
                    { from: 700, to: 850, color: 'green' },
                  ]}
                  needleCircleSize={10}
                  needleCircleOuter={true}
                  needleCircleInner={false}
                  animationDuration={1500}
                />
                <h5 className="mt-3">
                  <strong>{creditScore}</strong>
                </h5>
              </div>
            )}
          </CCol>
        </CRow>

        {/* Risk Assessment */}
        <CCard className="shadow-sm p-3 mb-4">
          <CCardHeader className="bg-light">
            <strong>Risk Assessment</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              {['High Debt', 'Low Income', 'Unstable Employment', 'Poor Credit History'].map(
                (risk) => (
                  <CCol md="3" key={risk}>
                    <CFormCheck
                      label={risk}
                      value={risk}
                      onChange={handleRiskChange}
                      checked={riskFactors.includes(risk)}
                    />
                  </CCol>
                ),
              )}
            </CRow>
          </CCardBody>
        </CCard>

        {/* Underwriter Decision */}
        <CCard className="shadow-sm p-3 mb-4">
          <CCardHeader className="bg-light">
            <strong>Underwriter Decision</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol md="6">
                <CFormSelect value={Decision} onChange={(e) => setDecision(e.target.value)}>
                  <option value="">Select Decision</option>
                  <option value="Approved">Approve</option>
                  <option value="needClarification">Clarify</option>
                  <option value="Rejected">Reject</option>
                </CFormSelect>
              </CCol>

              {/*  <CCol md="6">
                <CFormSelect value={legalReview} onChange={(e) => setLegalReview(e.target.value)}>
                  <option value="">Legal Review Status</option>
                  <option value="Pending">⌛ Pending</option>
                  <option value="Completed">✅ Completed</option>
                </CFormSelect>
              </CCol>*/}
            </CRow>
          </CCardBody>
        </CCard>

        {Decision === 'needClarification' ? (
          <>
            {/* Customer clarification */}
            <CCard className="shadow-sm p-3 mb-4">
              <CCardHeader className="bg-light">
                <strong>Need Clarification</strong>
              </CCardHeader>
              <CCardBody>
                <CRow className="mb-3">
                  <CCol md="12">
                    <CFormTextarea
                      name="clarification"
                      rows="3"
                      placeholder="Enter clarification here..."
                      onChange={(e) => setClarification(e.target.value)}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </>
        ) : null}

        {/* File Downloads */}
        <CCard className="shadow-sm p-3 mb-4">
          <CCardHeader className="bg-light">
            <strong>Files to Download</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="6">
                <CButton onClick={handleDownloadDocs} color="info" variant="outline" size="sm">
                  <CloudDownloadIcon className="me-2" />
                  Download Files
                </CButton>
              </CCol>
            </CRow>
            {/*  <div style={{ marginTop: "12px",marginRight:'50px' }}>
            <h6 className="d-flex text-start">Downloaded Documents:</h6>
          {downloadedFiles && downloadedFiles.length > 0 ? (
              <ul>
                {downloadedFiles.map((fileData, index) => (
                  <li key={index}>
                    <strong>{fileData.documentCategory}:</strong>{" "}
                    {fileData.fileName}
                    <DownloadIcon
                      sx={{ fontSize: 25, color: "blue" }}
                      style={{ marginLeft: "20px" }}
                     // onClick={() => handleDownloadDocById(fileData.fileId)} // Replace `id` with the unique key in your metadataResponse
                    />
                  </li>
                ))}  
              </ul>
            ) : (
              <p>Files not uploaded yet!</p>
            )} 
          </div> */}
          </CCardBody>
        </CCard>

        {/* Submit & Cancel Buttons */}
        <div className="mt-4 text-end">
          <CButton
            className="m-4"
            color="primary"
            type="submit"
            onClick={handleSubmit}
            disabled={loadingAction}
          >
            {loadingAction ? <CSpinner size="sm" /> : 'Submit'}
          </CButton>

          <CButton color="danger" type="submit" onClick={handleCancel}>
            Cancel
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default UnderWriter
