/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const LegalApprover = () => {
  const [incomeStatus, setIncomeStatus] = useState('') // Income Verification
  const [collateralStatus, setCollateralStatus] = useState('') // Collateral
  const [legalReviewStatus, setLegalReviewStatus] = useState('') // Legal Review
  const [files, setFiles] = useState([]) // Files List
  const [loading, setLoading] = useState(true)
  const URL = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()
  const [creditScore, setCreditScore] = useState(null)
  const [downloadMessage, setDownloadMessage] = useState('')
  const [clarification, setClarification] = useState('')
  const [downloadFiles, setDownloadedfiles] = useState([])

  const storedUser = localStorage.getItem('username')
  const [loanLoading, setLoanLoading] = useState(true)

  const globalToast = (message) => {
    toast.error(message)
  }
  const successToast = () => {
    toast.success('Files Downloaded Sucessfully')
  }
  const processInstance = localStorage.getItem('processId')
  console.log('process Instance id retrived', processInstance)

  useEffect(() => {
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

              if (!loan) return null // Skip if no loan details

              return {
                loanAccountNumber: loan.loanAccountNumber,
                applicantName: loan.applicantName,
                loanType: loan.loanType,
                loanStatus: loan.loanStatus,
                loanAmount: loan.loanAmount,
                emailId: loan.emailId,
              }
            })
            .filter(Boolean) // Remove null entries

          if (formattedLoans.length > 0) {
            console.log('Loan Details Extracted:', formattedLoans[0])
            setLoanDetails(formattedLoans[0]) // Store the first loan record
            setEmailId(formattedLoans[0].emailId) // Store email in state
            console.log(formattedLoans[0].emailId, '234')
            console.log(emailId, '234')
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

  const [loanDetails, setLoanDetails] = useState(null)
  const [emailId, setEmailId] = useState('')

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

  const handleSubmit = async () => {
    if ( !collateralStatus || !legalReviewStatus) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all the fields!',
        confirmButtonColor: '#d33',
      })
      return
    }

    const requestPayload = {
      Decision: legalReviewStatus,
    }
    // setLoadingAction(true)
    const loanId = localStorage.getItem('selectedLoanId')
    const taskId = localStorage.getItem(`taskId_${loanId}`)

    console.log(taskId, '***********taskIds------')

    try {
      const response = await axios.post(
        `${URL}/${storedUser}?processInstanceId=${processInstance}&id=${taskId}`,
        requestPayload,
      )

      console.log('API Response:', response.data)

      Swal.fire({
        icon: 'success',
        title: 'Submitted',
        text: 'Legal review submitted successfully!',
        confirmButtonColor: '#28a745',
      }).then(async () => {
        if (response.status === 200) {
          if (storedUser === 'LegalApprover' && legalReviewStatus.toLowerCase() === 'approved') {
            try {
              const statusUpdateResponse = await axios.get(`${URL}/updateStatusApproved`)
              console.log('Status updated:', statusUpdateResponse.data)
            } catch (statusUpdateError) {
              console.error('Error updating status for LegalApprover:', statusUpdateError)
            }
          }
        } else {
          console.error(`Legal review action failed`)
        }

        navigate('/loanApproverDashboard')
      })
    } catch (error) {
      console.error('Error submitting legal review:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to process request. Try again!',
        confirmButtonColor: '#d33',
      })
    } 
   
  }

  const handlePrevious = () => {
    navigate(-1)
  }

  // Function to send email content to API
  const sendClarificationEmail = async () => {
    if (!clarification.trim()) {
      alert('Clarification content cannot be empty.')
      return
    }

    const emailData = {
    
      clarificationDetails: clarification,
    }

    console.log(emailData)

    
  }

  return (
    <CCard className="shadow-lg mt-4">
      <CCardHeader
        style={{ backgroundColor: '#33bbff', color: 'white' }}
        className="d-flex justify-content-between align-items-center"
      >
        <CButton color="success" onClick={handlePrevious} title="Go Back">
          <FaArrowLeft /> Back
        </CButton>
        <h5>Legal Approver Form</h5>
        <div></div>
      </CCardHeader>

      <CCardBody>
        <CRow className="mb-4">
         
          <CCol md="6">
            <CCard className="shadow-sm p-3">
              <CCardHeader className="bg-light">
                <strong>Legal Approver</strong>
              </CCardHeader>
              <CCardBody>
                <CFormSelect
                  value={legalReviewStatus}
                  onChange={(e) => setLegalReviewStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Reject">Reject</option>
                  <option value="needClarification">Need Clarification</option>
                </CFormSelect>
              </CCardBody>
            </CCard>
          </CCol>
     

      
         

          {/* Collateral Status */}
          <CCol md="6">
            <CCard className="shadow-sm p-3">
              <CCardHeader className="bg-light">
                <strong>Collateral Status</strong>
              </CCardHeader>
              <CCardBody>
                <CFormSelect
                  value={collateralStatus}
                  onChange={(e) => setCollateralStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Sufficient">✅ Sufficient</option>
                  <option value="Insufficient">⚠️ Insufficient</option>
                  <option value="Not Provided">🚫 Not Provided</option>
                </CFormSelect>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {legalReviewStatus === 'Pending' ? (
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

        {/* Files to Download */}
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
                {downloadMessage && <p className="mt-2 text-muted">{downloadMessage}</p>}
              </CCol>
            </CRow>
          
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

export default LegalApprover
