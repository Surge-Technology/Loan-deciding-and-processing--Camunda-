/* eslint-disable prettier/prettier */
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CModal,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'
import axios from 'axios'
import 'chart.js/auto'
import React, { useEffect, useState } from 'react'
import { ModalBody } from 'react-bootstrap'
import { Pie } from 'react-chartjs-2'
import { FaEnvelope, FaFileExport, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Swal from 'sweetalert2'
import DisbursementForm from './DisbursementForm'
// import '../css/Model.css';
const LoanApproverDashboard = (loan) => {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState()
  const URL = import.meta.env.VITE_BASE_URL
  const [filterLoans, setFilterLoans] = useState([]);
  useEffect(() => {
    fetchLoanApplications()
  }, [])
  const storedUser = localStorage.getItem('username')

  const fetchLoanApplications = async () => {
    try {
      let response;
      let formattedLoans = [];
  
      if (storedUser === "FieldOfficer") {
        try {
          response = await axios.get(`${URL}/getActivedTasks`);
          console.log('API Response for FieldOfficer:', response.data); // Debugging Step 1
  
          // Ensure response.data is an array
          if (Array.isArray(response.data)) {
            const validTasks = response.data.filter((task) => task.assignee === storedUser);
            console.log('Filtered Tasks for FieldOfficer:', validTasks); // Debugging Step 2
  
            formattedLoans = validTasks.map((item) => ({
              loanId: item.variables.find(v => v.name === "loanAccountNumber")?.value || "",
              loanType: item.variables.find(v => v.name === "loanType")?.value || "",
              applicantName: item.variables.find(v => v.name === "applicantName")?.value || "",
              loanAmount: item.variables.find(v => v.name === "loanAmount")?.value || 0,
              loanStatus: item.variables.find(v => v.name === "loanStatus")?.value?.trim() || "",
              emailId: item.variables.find(v => v.name === "emailId")?.value || "",
              loanAccountNumber: item.variables.find(v => v.name === "loanAccountNumber")?.value || "",
              processId: item.processDefinitionId,
              id: item.id,
              taskId: item.id,
            }));
  
            setFilterLoans(formattedLoans);
  
            formattedLoans.forEach((loan) => {
              console.log(`Storing processId: ${loan.processId} for Loan ID: ${loan.taskId}`);
              localStorage.setItem(`processId_${loan.loanId}`, loan.processId);
              localStorage.setItem(`taskId_${loan.loanId}`, loan.taskId);
              console.log(localStorage.getItem(`taskId_${loan.loanId}`), "----------taskIds------");
            });
  
            console.log("Filtered Loans for FieldOfficer:", formattedLoans);
          }
        } catch (error) {
          console.error('Error fetching tasks for FieldOfficer:', error);
        }
      } 
      else if (storedUser !== 'Manager') {
        try {
          response = await axios.get(`${URL}/getActiveTask?user=${storedUser}`);
          console.log('API Response for User Tasks:', response.data); // Debugging Step 3
  
          if (Array.isArray(response.data)) {
            const validTasks = response.data.filter((task) => task.assignee === storedUser);
            console.log('Filtered Tasks for User:', validTasks[0]?.loanDetails); // Debugging Step 4
  
            formattedLoans = validTasks.map((item) => ({
              loanId: item.loanDetails.loanAccountNumber,
              loanType: item.loanDetails.loanType,
              applicantName: item.loanDetails.applicantName,
              loanAmount: item.loanDetails.loanAmount,
              loanStatus: String(item.loanDetails.loanStatus || "").trim(),
              emailId: item.loanDetails.emailId,
              loanAccountNumber: item.loanDetails.loanAccountNumber,
              processId: item.loanDetails.processInstanceId,
              id: item.loanDetails.id,
              taskId: item.taskId
            }));
  
            setFilterLoans(formattedLoans);
  
            formattedLoans.forEach((loan) => {
              console.log(`Storing processId: ${loan.processId} for Loan ID: ${loan.taskId}`);
              localStorage.setItem(`processId_${loan.loanId}`, loan.processId);
              localStorage.setItem(`taskId_${loan.loanId}`, loan.taskId);
              console.log(localStorage.getItem(`taskId_${loan.loanId}`), "----------taskIds------");
            });
  
            console.log("Filtered Loans:", formattedLoans);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      } 
      else {
        response = await axios.get(`${URL}/getApplicantDetails`);
        console.log('API Response for Manager:', response.data);
  
        formattedLoans = Array.isArray(response.data)
          ? response.data
            .filter((loan) => loan.loanStatus?.trim().toLowerCase() !== 'pending')
            .map((loanData) => ({
              loanId: loanData.loanAccountNumber,
              loanType: loanData.loanType,
              applicantName: loanData.applicantName,
              loanAmount: loanData.loanAmount,
              loanStatus: loanData.loanStatus?.trim() || '',
              emailId: loanData.emailId,
              loanAccountNumber: loanData.loanAccountNumber,
              id: loanData.id,
            }))
          : [];
  
        setFilterLoans(formattedLoans);
        console.log('Formatted Loans:', formattedLoans, filterLoans);
      }
  
      // Updating state
      setLoans(formattedLoans);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const processId = localStorage.getItem("pId");

  const [loadingAction, setLoadingAction] = useState({});
  const handleAction = async (loanId, taskId, actionType) => {

    const storedUser = localStorage.getItem('username'); // Retrieve username
    const taskIds = localStorage.getItem(`taskId_${loan.loanId}`);

    console.log(taskIds, "----------taskIds");
    if (!taskId) {
      console.error("taskId is undefined");
      return;
    }

    const processInstanceId = localStorage.getItem(`processId_${loanId}`);
    console.log("2345678", processInstanceId);

    // Get processId using loanId
    // const taskIds = localStorage.getItem(`processId_${taskId}`); // Get processId using loanId

    if (!processInstanceId) {
      console.error(`No processId found for Loan ID: ${loanId}`);
      return;
    }

    console.log("Retrieved Process Instance ID:", processInstanceId);
    console.log("Retrieved Task ID:", taskId);

    // const actionPayload = JSON.stringify({
    //     [storedUser]: actionType,
    // });  
    const actionPayload = storedUser === "InitialApprover"
      ? JSON.stringify({ [storedUser]: actionType })
      : JSON.stringify({ "Decision": actionType });
    console.log("action type", actionType);
    console.log("1234567", actionPayload);

    setLoadingAction((prev) => ({ ...prev, [taskId]: true })); try {
      const response = await axios.post(
        `${URL}/${storedUser}?processInstanceId=${processInstanceId}&id=${taskId}`,
        actionPayload,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log(`Handle ${actionType} Response:`, response.data);
      toast.success(`Loan ID ${loanId} has been ${actionType}`, { position: 'top-right' });

      if (response.status === 200) {
        navigate(0);

        if (storedUser === "LegalApprover" && actionType.toLowerCase() === "approved") {
          try {
            const statusUpdateResponse = await axios.get(`${URL}/updateStatusApproved`);
            console.log("Status updated:", statusUpdateResponse.data);
          } catch (statusUpdateError) {
            console.error("Error updating status for LegalApprover:", statusUpdateError);
          }
        }
      } else {
        console.error(`${actionType} action failed`);
      }
    } catch (error) {
      console.error(`Error handling ${actionType}:`, error);
    } finally {
      setLoadingAction((prev) => ({ ...prev, [taskId]: false }));
    }


  };




  const handleView = (id, loanId, taskId, processId, loanStatus) => {
    // alert(45678)
    const taskIds = localStorage.getItem(`taskId_${loanId}`);
    console.log(taskIds, "----------taskIds------");

    localStorage.setItem('selectedLoanId', loanId);
    localStorage.setItem('selectedTaskId', taskId);
    console.log(`Viewing Loan ID: ${id}`);
    console.log(`LoanStatus for ${id} is ${loanStatus}`);

    if (!processId) {
      console.error('Process Instance ID is undefined or null');
      return;
    }

    console.log(`Viewing Process Instance ID: ${processId}`);
    console.log(`LoanStatus for Process Instance ID ${processId} is ${loanStatus}`);

    localStorage.setItem('emailId', id);
    localStorage.setItem('processId', processId);

    const storedUser = localStorage.getItem('username');

    switch (storedUser) {
      case 'InitialApprover':
        navigate('/initialApprover');
        break;
      case 'UnderWriter':
        navigate('/underwriterForm');
        break;
      case 'LegalApprover':
        navigate('/legalApprover');
        break;
      case 'Manager':
        navigate('/managerForm'); // Corrected spelling
        break;
        case 'FieldOfficer':
          navigate('/fieldOfficer')
      default:
        navigate('/applicantDashboard');
        break;
    }
  };
  const totalLoans = filterLoans.length
  const pendingLoans = filterLoans.filter((loan) => loan.loanStatus === 'Pending').length
  const approvedLoans = filterLoans.filter((loan) => loan.loanStatus === 'Approved').length
  const rejectedLoans = filterLoans.filter((loan) => loan.loanStatus === 'Rejected').length

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
  const [selectedStatus, setSelectedStatus] = useState(''); // State for status filter




  const handleExportClick = () => {

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

  const [selectedLoanAmount, setSelectedLoanAmount] = useState()
  const handleDisbursement = (loanAccountNumber, loanAmount) => {
    console.log({ storedUser, loanAccountNumber, loanAmount })
    setShowModal(true)
    setSelectedLoan(loanAccountNumber)
    setSelectedLoanAmount(loanAmount)
  }


  const handleLegalAction = async (loanAccountNumber) => {
    try {
      console.log(loanAccountNumber );
  
      // Construct the payload with loanAccountNumber
      const payload = {
        // message: `Legal action initiated for Loan Account Number: ${loanAccountNumber}`,
        loanAccountNumber: loanAccountNumber,
      };
  console.log(payload);
  
      // Make the API request
      const response = await axios.post(`${URL}/startMessage`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log('Legal Action API Response:', response.data);
    } catch (error) {
      console.error('Error initiating legal action:', error);
    }
  };
  

  const [ViewDetials, setViewDetails] = useState(false);

  const handleViewAction = (loanAccountNumber, loanAmount) =>{
    console.log({ loanAccountNumber, loanAmount })
    setViewDetails(true)
    setSelectedLoan(loanAccountNumber)
    setSelectedLoanAmount(loanAmount)
  }

  return (
    <>
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        // className="custom-modal"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      // centered
      >
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

      <CModal
        visible={ViewDetials}
        onClose={() => setViewDetails(false)}
        // className="custom-modal"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      // centered
      >
        <ModalBody style={{ height: '45%' }}>
          <DisbursementForm
            loanAccountNumber={selectedLoan}
            loanAmount={selectedLoanAmount}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setViewDetails(false) // Close the modal
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
                          <CTableHeaderCell>Application No</CTableHeaderCell>
                          <CTableHeaderCell>Name</CTableHeaderCell>
                          <CTableHeaderCell>Type</CTableHeaderCell>
                          <CTableHeaderCell>Amount</CTableHeaderCell>
                          <CTableHeaderCell>Status</CTableHeaderCell>
                          <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filterLoans.length > 0 ? (
                          filterLoans.map((loan, index) => (
                            <CTableRow key={loan.id}>
                              <CTableDataCell>{index + 1}</CTableDataCell>
                              <CTableDataCell>{loan.loanAccountNumber}</CTableDataCell>
                              <CTableDataCell>{loan.applicantName}</CTableDataCell>
                              <CTableDataCell>{loan.loanType}</CTableDataCell>
                              <CTableDataCell>₹{loan.loanAmount}</CTableDataCell>
                              <CTableDataCell>{loan.loanStatus}</CTableDataCell>
                              <CTableDataCell>
                                {storedUser === 'Manager' ? (
                                  <div  className="d-flex">
                                    <CButton
                                      color="success"
                                      size="sm"
                                      className="me-2"
                                      disabled={loan.loanStatus.toLowerCase() === 'disbursed'}
                                      onClick={() =>
                                        handleDisbursement(loan.loanAccountNumber, loan.loanAmount)
                                      }
                                    >
                                      Disbursement
                                    </CButton>
                                    <CButton
                                      color="warning"
                                      size="sm"
                                      className="me-2"
                                      disabled={loan.loanStatus.toLowerCase() !== 'disbursed'}
                                      onClick={() => handleLegalAction(loan.loanAccountNumber, loan.loanAmount)}>
                                    
                                      LegalAction
                                    </CButton>
                                    {/*<CButton
                                      color="info"
                                      size="sm"
                                      className="me-2"
                                      disabled={loan.loanStatus.toLowerCase() !== 'disbursed'}
                                      onClick={() =>
                                        handleViewAction(loan.loanAccountNumber, loan.loanAmount)
                                      }
                                    >
                                    FieldVisit
                                    </CButton>*/}
                                  </div>
                                ) : (
                                  <>
                                    <CButton
                                      color="success"
                                      size="sm"
                                      className="me-2"
                                      // onClick={() => handleApprove(loan.loanId, loan.taskId, "Approved")}
                                      onClick={() => handleAction(loan.loanId, loan.taskId, "Approved")}
                                      disabled={loadingAction[loan.taskId]}                                    >
                                      {loadingAction[loan.taskId] ? <CSpinner size="sm" /> : "Approve"}

                                    </CButton>
                                    <CButton
                                      color="danger"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleAction(loan.loanId, loan.taskId, "Rejected")}
                                      disabled={loadingAction[loan.taskId]}                                    >

                                      {loadingAction[loan.taskId] ? <CSpinner size="sm" /> : "Reject"}

                                    </CButton>
                                    <CButton
                                      color="info"
                                      size="sm"
                                      // onClick={() => handleView(loan.id,loan.loadId,loan.taskId,loan.processId, loan.loanStatus)}
                                      onClick={() => handleView(loan.id, loan.loanId, loan.taskId, loan.processId, loan.loanStatus)}
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
