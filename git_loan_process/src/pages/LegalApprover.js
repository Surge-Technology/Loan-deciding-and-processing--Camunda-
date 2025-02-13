/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton, CFormSelect, CFormTextarea } from '@coreui/react'
import { FaArrowLeft } from 'react-icons/fa'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { RadialGauge } from 'react-canvas-gauges' // Using a semi-circle gauge
const URL = import.meta.env.VITE_BASE_URL

const LegalApprover = () => {
  const [incomeStatus, setIncomeStatus] = useState('') // Income Verification
  const [collateralStatus, setCollateralStatus] = useState('') // Collateral
  const [legalReviewStatus, setLegalReviewStatus] = useState('') // Legal Review
  const [files, setFiles] = useState([]) // Files List
  const [loading, setLoading] = useState(true)
  const URL = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()
  const [creditScore, setCreditScore] = useState(null)
  const[downloadMessage,setDownloadMessage]=useState("");
  const [clarification,setClarification] = useState('')
  const [downloadFiles,setDownloadedfiles] = useState([]);

  const storedUser = localStorage.getItem('username')

  const globalToast = (message) => { toast.error(message)}
  const successToast = () => { toast.success("Files Downloaded Sucessfully")}
  const processInstance = localStorage.getItem('processId');
  console.log("process Instance id retrived",processInstance);
  
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
              loanAmount: loanData.loanAmount,
            })),
          )

          if (formattedLoans.length > 0) {
            console.log('Loan Details Extracted:', formattedLoans[0])
            setLoanDetails(formattedLoans[0]) // Store the first loan record
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

  const [loanDetails, setLoanDetails] = useState(null)

  const handleDownload = (fileName) => {
    axios
      .get(`${URL}/downloadFile/${fileName}`, {
        responseType: 'blob',
      })
      .then((response) => {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([response.data]))
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch((error) => {
        console.error('Error downloading file:', error)
      })
  }

  const handleDownloadDocs = () => {
    setDownloadMessage("");
    axios
      .get(`${URL}/download-all-Files`, {
        responseType: 'blob', // Important for file downloads
      })
      .then((response) => {
       
        console.log("Response...", response);
        setDownloadMessage("Files downloaded successfully.");
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Files downloaded sucessfully `,
            showConfirmButton: false,
            timer: 1500,
          })
        console.log("File downloaded successfully", response.data);
      
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
    if (!incomeStatus || !collateralStatus || !legalReviewStatus) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all the fields!',
        confirmButtonColor: '#d33',
      })
      return
    }

    const requestPayload = {   
      incomeVerificationStatus: incomeStatus,
      collateralStatus: collateralStatus,
      LegalApprover: legalReviewStatus,
   
      // [storedUser]:
      //  {
      //   incomeVerificationStatus: incomeStatus,
      //   collateralStatus: collateralStatus,
      //   LegalApprover: legalReviewStatus,
      // },
    }

    try {
      const response = await axios.post(`${URL}/${storedUser}?processInstanceId=${processInstance}`, requestPayload)
      console.log('API Response:', response.data)
      if(response.data === "Loan approval process completed successfully."){
        axios.post(`${URL}/CustomerMail`)
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Legal review submitted successfully!',
        confirmButtonColor: '#28a745',
      }).then(() => {
        if (legalReviewStatus === "Pending") {
          sendClarificationEmail();
        }
        navigate('/loanApproverDashboard');
      });
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
      alert('Clarification content cannot be empty.');
      return;
    }

    const emailData = {
    //   to: 'recipient@example.com',  // Replace with actual recipient email
    //   subject: 'Clarification Request',
      clarificationDetails: clarification,
    };

    console.log(emailData);

    // try {
    //   const response = await axios.post(`${API_URL}/send-email`, emailData, {
    //     headers: { 'Content-Type': 'application/json' },
    //   });

    //   if (response.status === 200) {
    //     alert('Email sent successfully!');
    //     setClarification(''); // Clear the textarea after successful submission
    //   } else {
    //     alert('Failed to send email.');
    //   }
    // } catch (error) {
    //   console.error('Error sending email:', error);
    //   alert('Error sending email. Please try again.');
    // }
  };

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
          {/* Income Verification Status */}
          <CCol md="6">
            <CCard className="shadow-sm p-3">
              <CCardHeader className="bg-light">
                <strong>Income Verification Status</strong>
              </CCardHeader>
              <CCardBody>
                <CFormSelect value={incomeStatus} onChange={(e) => setIncomeStatus(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="Verified">✅ Verified</option>
                  <option value="Pending">⌛ Pending</option>
                  <option value="Rejected">❌ Rejected</option>
                </CFormSelect>
              </CCardBody>
            </CCard>
          </CCol>
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
          
        </CRow>

        <CRow className="mb-4">
          {/* Legal Review Status */}
         

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
                          <CFormTextarea name="clarification" rows="3" placeholder="Enter clarification here..." 
                          onChange={(e) => setClarification(e.target.value)}/>
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
                  <CloudDownloadIcon className="me-2"  />
                  Download Files
                </CButton>
                    {downloadMessage && <p className="mt-2 text-muted">{downloadMessage}</p>}

              </CCol>
            </CRow>
          {/*   <div style={{ marginTop: "12px",marginRight:'50px' }}>
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
          </div>  */}
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
