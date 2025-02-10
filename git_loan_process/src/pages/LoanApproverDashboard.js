/* eslint-disable prettier/prettier */
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CTableBody,
  CButton,
  CModal,
  CModalHeader,
} from '@coreui/react'
import axios from 'axios'
import { Button } from 'bootstrap'
import 'chart.js/auto'
import React, { useEffect, useState } from 'react'
import { ModalBody } from 'react-bootstrap'
import { Pie } from 'react-chartjs-2'
import { FaDownload, FaEnvelope, FaFileExport, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Swal from 'sweetalert2'
import DisbursementForm from './DisbursementForm'
const LoanApproverDashboard = () => {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState()
  const URL = import.meta.env.VITE_BASE_URL

  useEffect(() => {
    fetchLoanApplications()
  }, [])
  const storedUser = localStorage.getItem('username')

  // const fetchLoanApplications = async () => {
  //   try {
  //     const response = await axios.get(`${URL}/getTaskBasedOnUser?user=${storedUser}`);

  //     // Extracting multiple loan applications from rootNode
  //     const formattedLoans = response.data.flatMap((task) => {
  //       return Object.values(task.rootNode).map((loanData) => ({
  //         loanId: loanData.loanAccountNumber,
  //         loanType: loanData.loanType,
  //         applicantName: loanData.applicantName,
  //         loanAmount: loanData.loanAmount,
  //         loanStatus: loanData.loanStatus,
  //         emailId: loanData.emailId,
  //         loanAccountNumber: loanData.loanAccountNumber,
  //         id: loanData.id,
  //       }));
  //     });

  //     setLoans(formattedLoans);
  //   } catch (error) {
  //     console.error("Error fetching loan applications:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchLoanApplications = async () => {
    try {
      let response
      let formattedLoans = []

      if (storedUser !== 'Manager') {
        response = await axios.get(`${URL}/getTaskBasedOnUser?user=${storedUser}`)

        // Filtering tasks where assignee matches storedUser
        const validTasks = response.data.filter((task) => task.assignee === storedUser)

        // Extracting multiple loan applications from rootNode if validTasks exist
        formattedLoans = validTasks.flatMap((task) =>
          Object.values(task.rootNode).map((loanData) => ({
            loanId: loanData.loanAccountNumber,
            loanType: loanData.loanType,
            applicantName: loanData.applicantName,
            loanAmount: loanData.loanAmount,
            loanStatus: loanData.loanStatus,
            emailId: loanData.emailId,
            loanAccountNumber: loanData.loanAccountNumber,
            id: loanData.id,
          })),
        )
      } else {
        response = await axios.get(`${URL}/getApplicantDetails`)

        // Extracting multiple loan applications from the response data
        formattedLoans = response.data.map((loanData) => ({
          loanId: loanData.loanAccountNumber,
          loanType: loanData.loanType,
          applicantName: loanData.applicantName,
          loanAmount: loanData.loanAmount,
          loanStatus: loanData.loanStatus,
          emailId: loanData.emailId,
          loanAccountNumber: loanData.loanAccountNumber,
          id: loanData.id,
        }))
      }

      // Updating state
      setLoans(formattedLoans)
    } catch (error) {
      console.error('Error fetching loan applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (loanId) => {
    const storedUser = localStorage.getItem('username') // Retrieve username

    const approve = {
      [storedUser]: 'Approved', // Use an appropriate key for the backend
      // approver: storedUser // Store the approver’s username
    }

    try {
      const response = await axios.post(`${URL}/${storedUser}`, approve)
      console.log('Handle Approve Response:', response.data)
      toast.success(`Loan ID ${loanId} has been Approved ✅`, { position: 'top-right' })
    } catch (error) {
      console.error('Error approving task:', error)
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
    toast.success(`Loan ID ${loanId} has been Rejected ❌`, { position: 'top-right' })

    // alert(`Loan ID ${loanId} has been Rejected`);
  }

  // const handleView = (id) => {

  //   console.log(
  //   `Viewing Loan ID: ${id}`);
  //   localStorage.setItem('emailId',id);

  //   navigate('/initialApprover')
  // };

  // Loan Statistics

  const handleView = (id, loanStatus) => {
    console.log(`Viewing Loan ID: ${id}`)
    console.log(`LoanStatus for ${id} is ${loanStatus}`)

    // Store emailId in localStorage
    localStorage.setItem('emailId', id)

    // Retrieve stored user role
    const storedUser = localStorage.getItem('username')

    // Navigate based on user role
    if (storedUser === 'InitialApprover') {
      navigate('/initialApprover')
    } else if (storedUser === 'UnderWriter') {
      navigate('/underwriterForm')
    } else if (storedUser === 'LegalApprover') {
      navigate('/legalApprover')
    } else if (storedUser === 'Manager') {
      navigate('/mangerForm')
      // } else {
      //   navigate('/applicantDashboard')
    } else {
      //console.warn('Unknown user role, staying on the same page')
      navigate('/applicantDashboard')
    }
  }

  const totalLoans = loans.length
  const pendingLoans = loans.filter((loan) => loan.loanStatus === 'Pending').length
  const approvedLoans = loans.filter((loan) => loan.loanStatus === 'Approved').length
  const rejectedLoans = loans.filter((loan) => loan.loanStatus === 'Rejected').length

  // Pie Chart Data
  const pieData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [pendingLoans, approvedLoans, rejectedLoans],
        backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
        hoverOffset: 5,
      },
    ],
  }

  // Filter loans based on search term
  const filteredLoans = loans.filter(
    (loan) =>
      loan.loanId.toString().includes(searchTerm) ||
      loan.loanStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loanAccountNumber.toString().includes(searchTerm),
  )

  const handleExportClick = () => {
    // Swal.fire({
    //   icon: 'info',
    //   title: 'Exporting PDF Report',
    //   text: 'Your report is being generated...',
    //   confirmButtonColor: '#3085d6',
    // })
    axios
      .get(`${URL}/loans/pdf`, {
        responseType: 'blob', // specify response type as blob
      })
      .then((response) => {
        // Create a temporary URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]))
        // Create a link element
        const a = document.createElement('a')
        // Set the href attribute to the temporary URL
        a.href = url
        // Specify the filename for the downloaded file
        a.download = 'exported_file.pdf' // change the filename extension to .pdf
        // Append the link to the body
        document.body.appendChild(a)
        // Programmatically click the link to trigger the download
        a.click()
        // Remove the link from the body
        document.body.removeChild(a)
        // Revoke the temporary URL
        window.URL.revokeObjectURL(url)
        Swal.fire({
          icon: 'Sucess',
          title: 'Exported PDF Report',
          text: 'Your report is generated...',
          confirmButtonColor: '#3085d6',
        })
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error)
        //Swal.fire({error,'Exporting PDF Report failed' })
      })
  }

  const [selectedLoanAmount,setSelectedLoanAmount] =useState();
  const handleDisbursement = (loanAccountNumber,loanAmount) => {
    console.log({ storedUser, loanAccountNumber, loanAmount })
    setShowModal(true)
    setSelectedLoan(loanAccountNumber);
    setSelectedLoanAmount(loanAmount);
  }

  return (
    <>
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        centered
      >
        <CModalHeader
          className="cardbg"
          style={{ backgroundColor: 'rgb(51, 187, 255', color: 'white' }}
        >
          <b>Disbursement Loan Details:</b>
        </CModalHeader>
        <ModalBody style={{ height: '45%' }}>
          <DisbursementForm
            loanAccountNumber={selectedLoan}
            loanAmount={selectedLoanAmount}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false) // Close the modal
              // Add logic to refresh the component (e.g., fetch updated data)
              //fetchData() // Example: Fetch updated data
            }}
          />
        </ModalBody>
      </CModal>

      <CCard className="shadow-lg mt-4 p-3">
        <CCardHeader style={{ backgroundColor: '#33bbff', color: 'white' }} className="text-center">
          <h5>{storedUser} Dashboard</h5>
        </CCardHeader>

        {/* Top Summary Cards */}
        <CRow className="mt-4">
          <CCol md="4">
            <CCard className="shadow-lg text-white bg-danger text-center p-3">
              <CCardBody>
                <FaEnvelope size={25} />
                <h6 className="mt-2">Loan Requests</h6>
                <h4>{totalLoans}</h4>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md="4">
            <CCard className="shadow-lg text-white bg-primary text-center p-3">
              <CCardBody>
                <FaEnvelope size={25} />
                <h6 className="mt-2">Pre-Approval Progress</h6>
                <h4>{pendingLoans}</h4>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md="4">
            <CCard className="shadow-lg text-white bg-success text-center p-3">
              <CCardBody>
                <FaUser size={25} />
                <h6 className="mt-2">Approved Loans</h6>
                <h4>{approvedLoans}</h4>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CCardBody>
          <CRow>
            {/* LEFT SIDE - PIE CHART */}
            <CCol md="4">
              <CCard className="shadow-lg p-3">
                <CCardHeader className="bg-light text-dark text-center">
                  <h6>📊 Loan Statistics</h6>
                </CCardHeader>
                <CCardBody className="d-flex justify-content-center">
                  <Pie data={pieData} />
                </CCardBody>
              </CCard>
            </CCol>

            {/* RIGHT SIDE - LOAN TABLE */}
            <CCol md="8">
              <CCard className="shadow-lg p-3">
                <CCardHeader className="bg-light text-dark">
                  <CRow className="align-items-center">
                    <CCol md="6" className="d-flex justify-content-between align-items-center">
                      <h6>📄 Loan Applications</h6>
                      {storedUser === 'Manager' ? (
                        <>
                          <CButton
                            color="info"
                            variant="outline"
                            size="sm"
                            onClick={handleExportClick}
                          >
                            Export Report
                            <FaFileExport className="me-3" style={{ marginLeft: '4px' }} />
                          </CButton>
                        </>
                      ) : null}
                    </CCol>
                    <CCol md="6">
                      <CFormInput
                        type="text"
                        placeholder="🔍 Search Loan ID, Account No, Name, or Status"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  {loading ? (
                    <p>Loading loan applications...</p>
                  ) : (
                    <CTable hover bordered striped responsive>
                      <CTableHead className="table-light">
                        <CTableRow>
                          <CTableHeaderCell>#</CTableHeaderCell>
                          <CTableHeaderCell>Loan Account No</CTableHeaderCell>
                          <CTableHeaderCell>Name</CTableHeaderCell>
                          <CTableHeaderCell>Type</CTableHeaderCell>
                          <CTableHeaderCell>Amount</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredLoans.length > 0 ? (
                          filteredLoans.map((loan, index) => (
                            <CTableRow key={loan.id}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{loan.loanAccountNumber}</CTableDataCell>
                              <CTableDataCell>{loan.applicantName}</CTableDataCell>
                              <CTableDataCell>{loan.loanType}</CTableDataCell>
                              <CTableDataCell>₹{loan.loanAmount}</CTableDataCell>
                              <CTableDataCell>{loan.loanStatus}</CTableDataCell>
                              <CTableDataCell>
                                {storedUser === 'Manager' ? (
                                  <>
                                    <CButton
                                      color="success"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleDisbursement(loan.loanAccountNumber,loan.loanAmount)}
                                    >
                                      Get Disbursement
                                    </CButton>
                                  </>
                                ) : (
                                  <>
                                    <CButton
                                      color="success"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleApprove(loan.loanId)}
                                    >
                                      Approve
                                    </CButton>
                                    <CButton
                                      color="danger"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleReject(loan.loanId)}
                                    >
                                      Reject
                                    </CButton>
                                    <CButton
                                      color="info"
                                      size="sm"
                                      onClick={() => handleView(loan.id, loan.loanStatus)}
                                    >
                                      View
                                    </CButton>
                                    {/* <CButton
                                      color="success"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleDisbursement(loan.loanId)}
                                    >
                                      Get Disbursement
                                    </CButton> */}
                                  </>
                                )}
                              </CTableDataCell>
                            </CTableRow>
                          ))
                        ) : (
                          <CTableRow>
                            <CTableDataCell colSpan="7" className="text-center text-danger">
                              No matching loan applications found.
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default LoanApproverDashboard
