/* eslint-disable prettier/prettier */

import { cilArrowRight, cilChevronRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCol,
  CModal,
  CModalHeader,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import axios from 'axios'
import React, { useState } from 'react'
import { ModalBody } from 'react-bootstrap'
import { FaDownload, FaPlusCircle } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import TransactionPopUp from '../../pages/transactionPopUp'
import './ApplicantDashboardStyles.css'
import RepayPayment from './RepayPayment'
const URL = import.meta.env.VITE_BASE_URL

const ApplicantDashboard = () => {
  const { id } = useParams()

  const [RepayModal, setRepayModal] = useState(false)
  const [transactionModal, setTransactionModal] = useState(false)
  const [transactionData, setTransactionData] = useState()
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [loanDetails, setLoanDetails] = useState()
  const [data, setData] = useState([])
  const [transaction, setTransaction] = useState()
  const [balanceAmount, setBalanceAmount] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const navigate = useNavigate()
  const [showTransactions, setShowTransactions] = useState(false)
  const [showLoans, setShowLoans] = useState(false)

  const email = localStorage.getItem('email')

  const loadTransactions = () => {
    setShowLoans(false)
    setShowTransactions(true)
    axios
      .get(`${URL}/loanTransaction/email/${email}`)
      .then((response) => {
        console.log('Transaction Details:', response.data)
        setTransaction(response.data)
        setShowTransactions(true) // Show the table
      })
      .catch((error) => console.error('Error fetching transactions:', error))
  }

  const loadApplicants = () => {
    setShowLoans(true)
    setShowTransactions(false)
    const email = localStorage.getItem('email')

    axios
      .get(`${URL}/ApplicantDashboard?emailId=${email}`)
      .then((loanRes) => {
        console.log('Loan Details Response:', loanRes.data.loanDetails)
        const loanData = loanRes.data.loanDetails

        return axios.get(`${URL}/getAllTransaction`).then((transactionRes) => {
          console.log('Transaction Details Response:', transactionRes.data)
          const transactionData = transactionRes.data

          const balanceMap = {}
          transactionData.forEach((txn) => {
            balanceMap[txn.accountNumber] = txn.balanceAmount
          })

          const formattedData = loanData.map((item, index) => {
            const latestBalance = balanceMap[item.accountNumber] ?? item.loanAmount
            localStorage.setItem(`balance_${item.accountNumber}`, latestBalance)

            return {
              id: index + 1,
              loanAccountNumber: item.accountNumber || '',
              applicantName: item.applicantName || '',
              createdDate: item.createdDate || '',
              loanAmount: item.loanAmount || '',
              balanceAmount: latestBalance,
              loanType: item.loanType || '',
              loanStatus: item.loanStatus || '',
              action: (
                <CButton
                  className="repay"
                  onClick={() => modalHandleChange(item.accountNumber, item)}
                  color={
                    item.loanStatus === 'Disbursed' && latestBalance > 0 ? 'success' : 'secondary'
                  }
                  disabled={item.loanStatus !== 'Disbursed' || latestBalance === 0}
                >
                  {item.loanStatus === 'Disbursed' && latestBalance === 0 ? 'Paid' : 'Repay'}
                </CButton>
              ),
            }
          })

          setData(formattedData)
          setShowLoans(true) 
          console.log('Final Merged Data:', formattedData)
        })
      })
      .catch((err) => console.error('Error fetching data:', err))
  }

  const modalHandleChange = (loanId, loanDetails) => {
    setSelectedLoan(loanId)
    setRepayModal(true)
    setLoanDetails(loanDetails)
  }
  const showTransactionModal = (uanId, transactionDetails) => {
    console.log('onbutton clic view', uanId, transactionDetails)
    setTransactionModal(true)
    setTransactionData(transactionDetails)
  }

  const filteredData = data?.length
    ? selectedStatus === 'All'
      ? data
      : data.filter((item) => item.loanStatus === selectedStatus)
    : []
    const handleDownload = async (accountNumber) => {
      try {
        console.log("Downloading for Account:", accountNumber);
  
        // Example: Fetching a file from the backend (Adjust API as needed)
        const response = await axios.get(`http://localhost:8080/repaymentSchedule/download/${accountNumber}`, {
          responseType: "blob", // Important for handling file downloads
        });
  
        // Create a blob URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `LoanDetails_${accountNumber}.pdf`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    };
  const downloadPDF = () => {
    axios
      .get(`${URL}/repaymentSchedule/download/${accountNumber}`, {
        responseType: 'blob',
      })
      .then((res) => {
        console.log(res)

        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Repayment_Schedule.pdf')
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully downloaded report',
          showConfirmButton: true,
        })
      })
      .catch((err) => {
        console.error('Error downloading report:', err)
        Swal.fire('Error occurred. Please try again later.', '', 'error')
      })
  }
  return (
    <>
      <CModal
        visible={RepayModal}
        onClose={() => setRepayModal(false)}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        centered
      >
        <CModalHeader
          className="cardbg"
          style={{ backgroundColor: 'rgb(51, 187, 255', color: 'white' }}
        >
          <b>Repay Details for the applicant: {selectedLoan}</b>
        </CModalHeader>
        <ModalBody style={{ height: '45%' }}>
          <RepayPayment
            loanDetails={loanDetails}
            onClose={() => setRepayModal(false)}
            onSuccess={() => {
              setRepayModal(false) 
              console.log('Balance Amount:', balanceAmount)
       
            }}
          />
        </ModalBody>
      </CModal>

      <CModal
        visible={transactionModal}
        onClose={() => setTransactionModal(false)}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        centered
      >
        <CModalHeader
          className="cardbg"
          style={{ backgroundColor: 'rgb(51, 187, 255', color: 'white' }}
        >
          <b>Transaction Details :</b>
        </CModalHeader>
        <ModalBody style={{ height: '45%' }}>
          <TransactionPopUp
            transactionDetails={transactionData}
            onClose={() => setTransactionModal(false)}
            onSuccess={() => {
              setTransactionModal(false) // Close the modal
            }}
          />
        </ModalBody>
      </CModal>

      <div style={{ backgroundColor: '#27445D', color: 'white', height: '100vh' }}>
        <h1 style={{ paddingLeft: '25px', marginLeft: '25px' }}>Borrower Portal</h1>
        <CCard
          className="shadow-lg mb-3"
          style={{
            borderRadius: '20px',
            width: '90%',
            height: '85%',
            margin: '10px 0px 10px 55px',
            backgroundColor: 'white',
          }}
        >
          <CRow className="g-0" style={{ display: 'flex', height: '100%' }}>
            <CCol md={4} className="sideMenu" style={{ height: '100%' }}>
              <CButton className="loanButton" size="lg" onClick={loadApplicants}>
                Show Loans
                <CIcon style={{ marginLeft: '4px' }} icon={cilChevronRight} title="Download file" />
              </CButton>
              <CButton className="loanButton" size="lg" onClick={loadTransactions}>
                Transaction
                <CIcon style={{ marginLeft: '4px' }} icon={cilChevronRight} />
              </CButton>
              <CRow className="filtersection">
                <h5>Status Filters</h5>
                <CButton
                  color={selectedStatus === 'All' ? 'primary' : 'secondary'}
                  onClick={() => setSelectedStatus('All')}
                  className="filterbtn"
                >
                  All Loans ({data.length})
                </CButton>
                <CButton
                  color={selectedStatus === 'Approved' ? 'primary' : 'warning'}
                  onClick={() => setSelectedStatus('Approved')}
                  className="filterbtn"
                >
                  Approved ({data.filter((item) => item.loanStatus === 'Approved').length})
                </CButton>
                <CButton
                  color={selectedStatus === 'Pending' ? 'primary' : 'danger'}
                  onClick={() => setSelectedStatus('Pending')}
                  className="filterbtn"
                >
                  Pending ({data.filter((item) => item.loanStatus === 'Pending').length})
                </CButton>
                <CButton
                  color={selectedStatus === 'Disbursed' ? 'primary' : 'success'}
                  onClick={() => setSelectedStatus('Disbursed')}
                  className="filterbtn"
                >
                  Disbursed ({data.filter((item) => item.loanStatus === 'Disbursed').length})
                </CButton>
              </CRow>
            </CCol>
            <CCol md={8}>
              <CRow>
                <CCol md={10}>
                  <h2 className="text-xl font-bold flex items-center w-full">
                    New Loans <CIcon icon={cilArrowRight} />
                  </h2>
                </CCol>
                <CCol
                  md={2}
                  className="text-blue-600 text-2xl cursor-pointer hover:text-blue-800 transition-transform hover:scale-110 text-end"
                  style={{ marginTop: '4px', cursor: 'pointer', borderRadius: '50%' }}
                >
                  {' '}
                  <FaPlusCircle onClick={() => navigate('/selectType')} />
                </CCol>
              </CRow>

              <div className="table">
                <CTable hover borderless>
                  <CTableBody>
                    {showLoans && (
                      <div style={{ overflowX: 'auto', width: '100%' }}>
                        <CTable hover borderless>
                          <CTableHead>
                            <h2 className="text-xl font-bold">Loans</h2>
                            <CTableRow>
                              <CTableHeaderCell>S.No</CTableHeaderCell>
                              <CTableHeaderCell>Account Number</CTableHeaderCell>
                              <CTableHeaderCell>Applicant Name</CTableHeaderCell>
                              <CTableHeaderCell>Loan Amount</CTableHeaderCell>
                              <CTableHeaderCell>Balance</CTableHeaderCell>
                              <CTableHeaderCell>Type</CTableHeaderCell>
                              <CTableHeaderCell>Status</CTableHeaderCell>
                              <CTableHeaderCell>Action</CTableHeaderCell>
                              <CTableHeaderCell>Download </CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {filteredData.map((item, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>{item.id}</CTableDataCell>
                                <CTableDataCell>{item.loanAccountNumber}</CTableDataCell>
                                <CTableDataCell>{item.applicantName}</CTableDataCell>
                                <CTableDataCell>{item.loanAmount}</CTableDataCell>
                                <CTableDataCell>{item.balanceAmount}</CTableDataCell>
                                <CTableDataCell>{item.loanType}</CTableDataCell>
                                <CTableDataCell>{item.loanStatus}</CTableDataCell>
                                <CTableDataCell>{item.action}</CTableDataCell>
                                <CTableDataCell>
                                  <CButton variant="outline" size="sm">
                                    <CloudDownloadIcon className="me-2" onClick={() => handleDownload(item.loanAccountNumber)} />
                                  </CButton>
                                </CTableDataCell> <CTableDataCell>
                                <button onClick={() => handleDownload(loan.accountNumber)}>
                                <FaDownload />
                              </button>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </div>
                    )}

                    {showTransactions && (
                      <div className="table">
                        <h2 className="text-xl font-bold">Transactions</h2>
                        <div style={{ overflowX: 'auto', maxWidth: '100%', whiteSpace: 'nowrap' }}>
                          <CTable hover borderless>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>UAN ID</CTableHeaderCell>
                                <CTableHeaderCell>Account Number</CTableHeaderCell>
                                <CTableHeaderCell>Transaction Type</CTableHeaderCell>
                                <CTableHeaderCell>Amount</CTableHeaderCell>
                                <CTableHeaderCell>Date</CTableHeaderCell>

                                <CTableHeaderCell>View </CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {transaction?.length > 0 ? (
                                transaction.map((txn, index) => (
                                  <CTableRow key={index}>
                                    <CTableDataCell>{txn.uanId}</CTableDataCell>
                                    <CTableDataCell>{txn.loanAccountNumber}</CTableDataCell>
                                    <CTableDataCell>{txn.paymentType}</CTableDataCell>
                                    <CTableDataCell>{txn.loanAmount}</CTableDataCell>
                                    <CTableDataCell>{txn.date}</CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        color="success"
                                        onClick={() => showTransactionModal(txn.uanId, txn)}
                                      >
                                        View
                                      </CButton>
                                      {/* <CButton>
                                        <FileDownload />
                                      </CButton> */}
                                      <CTableHeaderCell></CTableHeaderCell>
                                    </CTableDataCell>
                                  </CTableRow>
                                ))
                              ) : (
                                <CTableRow>
                                  <CTableDataCell colSpan="6" className="text-center">
                                    No Transactions Available
                                  </CTableDataCell>
                                </CTableRow>
                              )}
                            </CTableBody>
                          </CTable>
                        </div>
                      </div>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CCol>
          </CRow>
        </CCard>
      </div>
    </>
  )
}

export default ApplicantDashboard
