/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormCheck,
  CButton,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import Swal from 'sweetalert2'
import { RadialGauge } from 'react-canvas-gauges' // Using a semi-circle gauge
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Input } from '@mui/material'
const UnderwriterForm = () => {
  //   const [creditScore] = useState(720); // Static value (Fetch dynamically if needed)
  const [riskFactors, setRiskFactors] = useState([])
  const [decision, setDecision] = useState('')
  const [clarification, setClarification] = useState('')
  const [legalReview, setLegalReview] = useState('')
  const URL = import.meta.env.VITE_BASE_URL
  const [creditScore, setCreditScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loanDetails, setLoanDetails] = useState(null)

  const [downloadFiles, setDownloadedfiles] = useState([])

  const navigate = useNavigate()
  //   useEffect(() => {
  //     const fetchLoanDetails = async () => {
  //       try {
  //         const email = localStorage.getItem("emailId");
  //         console.log("Fetching details for email:", email);

  //         const response = await axios.get(`${URL}/getApplicantData/${email}`);

  //         if (response.data) {
  //             console.log("response".response.data);

  //           setLoanDetails(response.data);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching loan details:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };    fetchLoanDetails();
  // }, []);
  const storedUser = localStorage.getItem('username')

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const storedUser = localStorage.getItem('username') // Get logged-in user role
        console.log('Fetching loan details for:', storedUser)

        const response = await axios.get(`${URL}/getTaskBasedOnUser?user=${storedUser}`)

        if (response.data.length > 0) {
          // Extract the first relevant loan application
          const formattedLoans = response.data.flatMap((task) =>
            Object.values(task.rootNode).map((loanData) => ({
              loanAccountNumber: loanData.loanAccountNumber,
              applicantName: loanData.applicantName,
              loanType: loanData.loanType,
              loanStatus: loanData.loanStatus,
              loanAmount: loanData.loanAmount,
            })),
          )
          if (formattedLoans.length > 0) {
            console.log('Loan Details Extracted:', formattedLoans[0])
            setLoanDetails(formattedLoans[0]) // Store the first loan record
            //setDecision(formattedLoans[0].loanStatus) // Set the loan status in the dropdown
          } else {
            console.warn('No loans found for this user.')
          }
        } else {
          console.warn('No response data found.')
        }
      } catch (error) {
        console.error('Error fetching loan details:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchCreditScore = async () => {
      try {
        const response = await axios.get(`${URL}/calculateCibilScore`)
        console.log('CIBIL Score API Response:', response.data)

        if (response.data && response.data) {
          setCreditScore(Number(response.data)) // Ensure it's a number
        } else {
          console.warn('Invalid CIBIL Score response:', response.data)
        }
      } catch (error) {
        console.error('Error fetching credit score:', error)
      }
    }

    fetchLoanDetails()
    fetchCreditScore()
  }, [])

  const handleRiskChange = (event) => {
    const { value, checked } = event.target
    setRiskFactors((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
  }
  const handleDownload = async () => {
    try {
      // First API Call: Get the email ID
      const emailResponse = await fetch(`${URL}/getEmail`, {
        method: 'GET',
      })

      if (!emailResponse.ok) {
        console.error('Failed to fetch email:', emailResponse.statusText)
        return
      }

      const emailId = await emailResponse.text() // Assuming the response is plain text
      console.log('Email ID:', emailId)

      // Second API Call: Use email ID as a parameter
      const downloadResponse = await fetch(`${URL}/downloadEmail?emailId=${emailId}`, {
        method: 'GET',
      })
      if (downloadFiles) {
        setTimeout(() => {
          setMessage('Files downloaded') // Update the message after download
        }, 1000)

        // Using Axios to make the file metadata request
        try {
          const metadataResponse = await axios.get(`${URL}/fileMetadata?emailId=${emailId}`, {
            headers: {
              'Content-Type': 'multipart/form-data', // Set the header for multipart/form-data
            },
          })

          // Check if the response is successful
          if (metadataResponse.status === 200) {
            const metadata = metadataResponse.data // Assuming the response is JSON
            setFileMetadata(metadata) // Store file metadata to render
          } else {
            console.error('Failed to fetch file metadata:', metadataResponse.statusText)
          }
        } catch (error) {
          console.error('Error fetching file metadata:', error)
        }
      } else {
        console.error('Failed to download file:', downloadResponse.statusText)
        return
      }
    } catch (error) {
      console.error('Error in API calls:', error)
    }
  }

  const handleFileDownload = async (fileId) => {
    try {
      const response = await axios.get(`${URL}/download/${fileId}`, {
        responseType: 'blob', // Important to handle binary file responses
      })

      // Extract the file name from the response or metadata if necessary
      const fileName = `file_${fileId}.png` // This can be dynamic, use the response or metadata to set it

      // Use saveAs function to trigger download
      saveAs(response.data, fileName)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Failed to download the file')
    }
  }
  const handleSubmit = async () => {
    if (!decision) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select an Underwriter Decision!',
        confirmButtonColor: '#d33',
      })
      return
    }

    if (decision === 'needClarification' && !clarification.trim()) {
      alert('Clarification content cannot be empty.')
      return
    }

    const storedUser = localStorage.getItem('username')
    // Construct requestPayload as a local variable
    const requestPayload = {
      [storedUser]: decision,
      ...(decision === 'needClarification' && { clarificationDetails: clarification }), // Add only if needed
    }

    try {
      const response = await axios.post(`${URL}/${storedUser}`, requestPayload)
      console.log('API Response:', response.data)

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Loan has been ${decision}!`,
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
    }
  }

  const handlePrevious = () => {
    navigate(-1)
  }
  const handleApprove = async (loanId) => {
    const approve = {
      [storedUser]: 'Approved', // Use an appropriate key for the backend
      // approver: storedUser // Store the approver’s username
    }

    try {
      const response = await axios.post(`${URL}/${storedUser}`, approve)
      console.log('Handle Approve Response:', response.data)
      //toast.success(`Loan ID ${loanId} has been Approved ✅`, { position: "top-right" });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Loan has been Approved `,
        showConfirmButton: false,
        timer: 1500,
      })
      navigate('/loanApproverDashboard')
    } catch (error) {
      console.error('Error approving task:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error approving Task!',
        confirmButtonColor: '#d33',
      })
    }

    // alert(`Loan ID ${loanId} has been Approved`);
  }

  const handleReject = (loanId) => {
    const reject = {
      [storedUser]: 'Reject',
      // approver: storedUser
    }

    const response = axios.post(` ${URL}/${storedUser}`, reject)
    console.log('handle reject', response)
    //toast.success(`Loan has been Rejected ❌`, { position: 'top-right' })
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: `Loan has been Rejected`,
      showConfirmButton: false,
      timer: 1500,
    })
    navigate('/loanApproverDashboard')
    // alert(`Loan ID ${loanId} has been Rejected`);
  }

  const handleDownloadDocs = () => {
    axios
      .get(`${URL}/download-all-Files`, {
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
          /*  if (response.status === 200) {
          axios
            .get(`${URL}/fileMetadata?emailId=camerongre1@gmail.com`)
            .then((response) => {
              console.log('Metadata Response:', response.data)
              setDownloadedfiles(response.data)
              // successToast('Files downloaded successfully!'); // Notify user of success
            })
            .catch((error) => {
              console.error('Error fetching file metadata:', error.message)
              //globalToast('Failed to fetch file metadata. Please try again later.')
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to process request. Try again!',
                confirmButtonColor: '#d33',
              })
            })
        }  */
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

  // Function to send email content to API
  const sendClarificationEmail = async () => {
    if (!clarification.trim()) {
      alert('Clarification content cannot be empty.')
      return
    }

    const emailData = {
      //   to: 'recipient@example.com',  // Replace with actual recipient email
      //   subject: 'Clarification Request',
      clarificationDetails: clarification,
    }

    console.log(emailData)

    try {
      const response = await axios.post(`${API_URL}/emailSenderClarification`, emailData, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.status === 200) {
        alert('Email sent successfully!')
        setClarification('') // Clear the textarea after successful submission
      } else {
        alert('Failed to send email.')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email. Please try again.')
    }
  }

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
                {loading ? (
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

          {/* Right - Credit Score Gauge */}
          <CCol md="6" className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <h6>
                <strong>Credit Score</strong>
              </h6>
              {creditScore !== null ? (
                <RadialGauge
                  width={250}
                  height={150} // Semi-circle shape
                  minValue={300}
                  maxValue={850}
                  value={creditScore} // Ensure this is a number
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
              ) : (
                <p>Loading CIBIL Score...</p> // Show loading text while fetching data
              )}
            </div>
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
                <CFormSelect value={decision} onChange={(e) => setDecision(e.target.value)}>
                  <option value="">Select Decision</option>
                  <option value="Approved">Approve</option>
                  <option value="needClarification">Pending</option>
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

        {decision === 'needClarification' ? (
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
          <CButton className="m-4" color="primary" type="submit" onClick={handleSubmit}>
            Submit
          </CButton>

          <CButton color="danger" type="submit" onClick={handlePrevious}>
            Cancel
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default UnderwriterForm
