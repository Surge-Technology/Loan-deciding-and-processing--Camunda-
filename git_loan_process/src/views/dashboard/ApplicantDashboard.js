/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './ApplicantDashboardStyles.css'
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
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
import { cilChevronRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { ModalBody, Spinner } from 'react-bootstrap'
import RepayPayment from './RepayPayment'
const URL = import.meta.env.VITE_BASE_URL

const ApplicantDashboard = () => {
  const [applicants, setApplicants] = useState([])
  const [RepayModal, setRepayModal] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [loanDetails, setLoanDetails] = useState()
  const [data, setData] = useState([])

  const [selectedStatus, setSelectedStatus] = useState('All')

  // useEffect(() => {
  //     // setData(
  //     //     {
  //     //         id: '',
  //     //         loanAccountNumber: '',
  //     //         loanAmount:'',
  //     //         loanType: '',
  //     //         loanStatus: '',
  //     //         _cellProps: { id: { scope: 'row' } },
  //     //     }
  //     // )
  //     const updatedDetails = [];
  // }, []);

  const loadApplicants = () => {
    const email = localStorage.getItem('email')
    axios
      .get(`${URL}/ApplicantDashboard?emailId=camerongre1@gmail.com`)
      .then((res) => {
        console.log('response', res.data.loanDetails)
        const formattedData = res.data.loanDetails.map((item, index) => ({
          id: index + 1,
          loanAccountNumber: item.accountNumber || '',
          applicantName: item.applicantName || '',
          createdDate: item.createdDate || '',
          loanAmount: item.loanAmount || '',
          loanType: item.loanType || '',
          loanStatus: item.loanStatus || '',
          action:
            item.loanStatus === 'Disbursed' ? (
              <CButton
                color="success"
                className="repay"
                onClick={() => modalHandleChange(item.accountNumber, item)}
              >
                Repay
              </CButton>
            ) : null,
        }))
        setData(formattedData)
        console.log('formattedData', formattedData)
      })
      .catch((err) => {
        console.log('Error fetching applicants:', err)
      })
  }

  const columns = [
    {
      key: 'id',
      label: 'S.No',
      _props: { scope: 'col' },
    },
    {
      key: 'loanAccountNumber',
      label: 'Loan Account Number',
      _props: { scope: 'col' },
    },
    {
      key: 'loanAmount',
      label: 'Loan Amount',
      _props: { scope: 'col' },
    },
    {
      key: 'loanType',
      label: 'Loan Type',
      _props: { scope: 'col' },
    },
    {
      key: 'loanStatus',
      label: 'Loan Status',
      _props: { scope: 'col' },
    },
    {
      key: 'action',
      label: 'Action',
      _props: { scope: 'col' },
    },
  ]
  // const items = [
  //     {
  //         id: 1,
  //         loanAccountNumber: 124578985,
  //         loanAmount: 50000,
  //         loanType: 'personal',
  //         loanStatus: 'approved',
  //         _cellProps: { id: { scope: 'row' } },
  //     }, {
  //         id: 2,
  //         loanAccountNumber: 124578985,
  //         loanAmount: 50000,
  //         loanType: 'personal',
  //         loanStatus: 'Pending',
  //         _cellProps: { id: { scope: 'row' } },
  //     },
  // ]

  // const modalHandleChange = (data,id) => {

  //     if (data === "repay") {
  //         console.log("repayModle........", RepayModal);
  //         // setState((prevState) => ({
  //         //     ...prevState,
  //         //     RepayModal: !RepayModal
  //         // }))
  //         setRepayModal(!RepayModal)
  //     }

  //     console.log("repayModle....", RepayModal );
  // }

  const modalHandleChange = (loanId, loanDetails) => {
    setSelectedLoan(loanId)
    setRepayModal(true)
    setLoanDetails(loanDetails)
  }

  const callBackmodelHandle = (data) => {
    modalHandleChange(data)
  }

  const fetchData = async () => {
    const email = localStorage.getItem('email')
    axios
      .get(`{${URL}/ApplicantDashboard?emailId=${email}`)
      .then((res) => {
        console.log('response', res.data.loanDetails)
        const formattedData = res.data.loanDetails.map((item, index) => ({
          id: index + 1,
          loanAccountNumber: item.accountNumber || '',
          applicantName: item.applicantName || '',
          createdDate: item.createdDate || '',
          loanAmount: item.loanAmount || '',
          loanType: item.loanType || '',
          loanStatus: item.loanStatus || '',
          action:
            item.loanStatus === 'Disbursed' ? (
              <CButton
                color="success"
                className="repay"
                onClick={() => modalHandleChange(item.accountNumber, item)}
              >
                Repay
              </CButton>
            ) : null,
        }))
        setData(formattedData)
        console.log('formattedData', formattedData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  // ✅ Ensure `data` is always an array (default to empty array)
const filteredData = data?.length
? selectedStatus === "All"
  ? data
  : data.filter((item) => item.loanStatus === selectedStatus)
: [];

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
              // Add logic to refresh the component (e.g., fetch updated data)
              fetchData() // Example: Fetch updated data
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
                Loans
                <CIcon style={{ marginLeft: '4px' }} icon={cilChevronRight} title="Download file" />
              </CButton>

              <CRow className="filtersection">
                <h5 >Status Filters</h5>
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
              <h2 className="text-center">Applicant Loans</h2>
              <div className="table">
                <CTable hover borderless>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>S.No</CTableHeaderCell>
                      <CTableHeaderCell>Loan Account Number</CTableHeaderCell>
                      <CTableHeaderCell>Applicant Name</CTableHeaderCell>
                      <CTableHeaderCell>Loan Amount</CTableHeaderCell>
                      <CTableHeaderCell>Loan Type</CTableHeaderCell>
                      <CTableHeaderCell>Loan Status</CTableHeaderCell>
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

             {/* {(!data || data.length === 0) && (
                <p>
                  <center>No data to show</center>
                </p>
              )}

               {data && data.length > 0 ? (
                                    // <BootstrapTable keyField="id" data={data} columns={columns} striped hover />
                                    <div className='table '  style={{ maxWidth:'90%', overflowY: '-moz-hidden-unscrollable' }}>  <CTable hover borderless columns={columns} items={data} /></div>
                                ) : (
                                    <><div className='table'>  <CTable hover borderless columns={columns} /></div>
                                        <p><center>No data to show</center></p></>
                                })} */}
            </CCol>
          </CRow>
        </CCard>
      </div>
    </>
  )
}

export default ApplicantDashboard
