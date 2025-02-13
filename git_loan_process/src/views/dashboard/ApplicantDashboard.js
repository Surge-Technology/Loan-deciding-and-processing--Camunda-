/* eslint-disable prettier/prettier */

import { cilChevronRight } from '@coreui/icons'
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
  CTableRow
} from '@coreui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ModalBody } from 'react-bootstrap'
import { FaPlusCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './ApplicantDashboardStyles.css'
import RepayPayment from './RepayPayment'
const URL = import.meta.env.VITE_BASE_URL

const ApplicantDashboard = () => {
  const [applicants, setApplicants] = useState([])
  const [RepayModal, setRepayModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [loanDetails, setLoanDetails] = useState()
  const [data, setData] = useState([])

  const [balanceAmount, setBalanceAmount] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const navigate = useNavigate()

  // const loadApplicants1 = () => {
  //   getEmailId
  //   const email = localStorage.getItem('email')

  //   axios
  //     .get(`${URL}/ApplicantDashboard?emailId=${email}`)
  //     .then((res) => {
  //       console.log('response', res.data.loanDetails)
  //       const formattedData = res.data.loanDetails.map((item, index) => ({
  //         id: index + 1,
  //         loanAccountNumber: item.accountNumber || '',
  //         applicantName: item.applicantName || '',
  //         createdDate: item.createdDate || '',
  //         loanAmount: item.loanAmount || '',
  //         balanceAmount: balanceAmount || '',
  //         loanType: item.loanType || '',
  //         loanStatus: item.loanStatus || '',
  //         action:
  //           item.loanStatus === 'Disbursed' ? (
  //             <CButton
  //               color="success"
  //               className="repay"
  //               onClick={() => modalHandleChange(item.accountNumber, item)}
  //             >
  //               Repay
  //             </CButton>
  //           ) : null,
  //       }))
  //       setData(formattedData)
  //       console.log('formattedData', formattedData)
  //     })
  //     .catch((err) => {
  //       console.log('Error fetching applicants:', err)
  //     })
  // }

  const loadApplicants = () => {
    const email = localStorage.getItem('email')

    axios
      .get(`${URL}/ApplicantDashboard?emailId=${email}`)
      // axios.get(`${URL}/ApplicantDashboard?emailId=camerongre1@gmail.com`)
      .then((loanRes) => {
        console.log('Loan Details Response:', loanRes.data.loanDetails)
        const loanData = loanRes.data.loanDetails

        // Fetch Transaction Details API
        return axios.get(`${URL}/getAllTransaction`).then((transactionRes) => {
          console.log('Transaction Details Response:', transactionRes.data)
          const transactionData = transactionRes.data

          // Create a map to store the latest balance amount for each accountNumber
          const balanceMap = {}
          transactionData.forEach((txn) => {
            balanceMap[txn.accountNumber] = txn.balanceAmount
          })

          // ✅ Store balanceAmount in localStorage and merge data
          const formattedData = loanData.map((item, index) => {
            // const latestBalance = balanceMap[item.accountNumber] ?? item.loanAmount
            // localStorage.setItem(`balance_${item.accountNumber}`, latestBalance)
            const latestBalance = balanceMap[item.accountNumber] ?? item.loanAmount;
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
              action:
              <CButton
              color={item.loanStatus === "Disbursed" && latestBalance > 0 ? "success" : "secondary"}
              className="repay"
              onClick={() => modalHandleChange(item.accountNumber, item)}
              disabled={item.loanStatus !== "Disbursed" || latestBalance === 0}
            >
              {item.loanStatus === "Disbursed" && latestBalance === 0 ? "Paid" : "Repay"}
            </CButton>
            }
          })

          setData(formattedData)
          console.log('Final Merged Data:', formattedData)
        })
      })
      .catch((err) => console.error('Error fetching data:', err))
  }


  const handleLoanRequest = () => {
    navigate('/selectType')
  }

  const modalHandleChange = (loanId, loanDetails) => {
    setSelectedLoan(loanId)
    setRepayModal(true)
    setLoanDetails(loanDetails)
  }

  const callBackmodelHandle = (data) => {
    modalHandleChange(data)
  }

  const filteredData = data?.length
    ? selectedStatus === 'All'
      ? data
      : data.filter((item) => item.loanStatus === selectedStatus)
    : []

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
              setRepayModal(false) // Close the modal
              // console.log('Transaction Amount:', transactionAmount)
              console.log('Balance Amount:', balanceAmount)
              // // Add logic to refresh the component (e.g., fetch updated data)
              // fetchData() // Example: Fetch updated data
            }}
          />
        </ModalBody>
      </CModal>

      <div style={{ backgroundColor: '#27445D', color: 'white', height: '100vh' }}>
        <h1 style={{ paddingLeft: '25px', marginLeft: '25px' }}>Applicant Dashboard</h1>
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
             {/* <div className="flex justify-space-between">
                <h2 className="text-xl font-bold flex items-center">
                  <span>
                    <FaPlusCircle
                      className="text-blue-600 text-2xl cursor-pointer hover:text-blue-800 transition-transform hover:scale-110"
                      style={{ cursor: 'pointer', marginLeft: '10px' }}
                    />
                  </span>
                </h2>
              </div>*/}
              <CRow>
                <CCol md={10}>
                  <h2 className="text-xl font-bold flex items-center w-full">Applicant Loans</h2>
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
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>S.No</CTableHeaderCell>
                      <CTableHeaderCell>Account Number</CTableHeaderCell>
                      <CTableHeaderCell>Applicant Name</CTableHeaderCell>
                      <CTableHeaderCell>Loan Amount</CTableHeaderCell>
                      <CTableHeaderCell>Balance</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>

                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.id}</CTableDataCell>
                          <CTableDataCell>{item.loanAccountNumber}</CTableDataCell>
                          <CTableDataCell>{item.applicantName}</CTableDataCell>
                          <CTableDataCell>{item.loanAmount}</CTableDataCell>
                          <CTableDataCell>{item.balanceAmount}</CTableDataCell>
                          <CTableDataCell>{item.loanType}</CTableDataCell>
                          <CTableDataCell>{item.loanStatus}</CTableDataCell>
                          <CTableDataCell>{item.action}</CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="7" className="text-center">
                          No records found
                        </CTableDataCell>
                      </CTableRow>
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
