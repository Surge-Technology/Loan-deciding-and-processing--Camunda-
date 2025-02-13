/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormSelect,
  CFormTextarea,
  CButton,
  CContainer,
  CCollapse,
} from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import Swal from 'sweetalert2'

const InitialApproverForm = () => {
  const [loanData, setLoanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openSections, setOpenSections] = useState({})
  const [approverName] = useState('John Doe')
  const [currentDate] = useState(new Date().toISOString().split('T')[0])
  const URL = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate()

  const [decision, setDecision] = useState({
    // creditScore: 750, // Default Score
    eligibility: '',
    comments: '',
    approvalStatus: '',
  })
  const processInstance = localStorage.getItem('processId');
 console.log("process Instance id retrived",processInstance);
 

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const email = localStorage.getItem('emailId')
        console.log('1234567', email)
 

        // const email = "camerongre1@gmail.com"; // Replace with dynamic email

        const response = await axios.get(`${URL}/getApplicantData/${email}`)

        if (response.data) {
          setLoanData(response.data)
        }
      } catch (error) {
        console.error('Error fetching loan details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLoanDetails()
  }, [])

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleSubmit = () => {
    console.log('Final Decision Submitted:', decision)
    alert('Decision Submitted Successfully!')
  }
  const storedUser = localStorage.getItem('username')
  const handleApprove = async (loanId) => {
    const approve = {
      [storedUser]: 'Approved', // Use an appropriate key for the backend
      // approver: storedUser // Store the approver’s username
    }

    try {
      const response = await axios.post(`${URL}/${storedUser}?processInstanceId=${processInstance}`, approve)
      console.log('Handle Approve Response:', response.data)
      // toast.success(`Loan ID ${loanId} has been Approved ✅`, { position: "top-right" });
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Approved`,
        confirmButtonColor: '#28a745',
      })
      navigate('/loanApproverDashboard')
    } catch (error) {
      console.error('Error approving task:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error`,
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

    const response = axios.post(` ${URL}/${storedUser}?processInstanceId=${processInstance}`, reject)
    console.log('handle reject', response)
    // toast.success(`Loan ID ${loanId} has been Rejected ❌`, { position: "top-right" });
    navigate('/loanApproverDashboard')
    // alert(`Loan ID ${loanId} has been Rejected`);
  }

  const renderSection = (title, data) => {
    if (!data) return null

    // Check if the data is an array (e.g., prevEmployments)
    if (Array.isArray(data)) {
      return (
        <CCard className="mb-3 shadow-lg">
          <CCardHeader className="bg-primary text-white" onClick={() => toggleSection(title)}>
            <h6 style={{ cursor: 'pointer' }}>{title} 🔽</h6>
          </CCardHeader>
          <CCollapse visible={openSections[title]}>
            <CCardBody>
              {data.map((item, index) => (
                <div key={index} className="mb-3 p-2 border rounded bg-light">
                  <CRow>
                    {Object.entries(item).map(([key, value]) => (
                      <CCol md="4" key={key} className="mb-2">
                        <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>{' '}
                        {typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}
                      </CCol>
                    ))}
                  </CRow>
                </div>
              ))}
            </CCardBody>
          </CCollapse>
        </CCard>
      )
    }

    // For normal objects, split into groups of 10 fields
    const entries = Object.entries(data)
    const splitData = []
    for (let i = 0; i < entries.length; i += 10) {
      splitData.push(entries.slice(i, i + 10))
    }

    return (
      <CCard className="mb-3 shadow-lg">
        <CCardHeader className="bg-light text-muted" onClick={() => toggleSection(title)}>
          <h6 style={{ cursor: 'pointer' }}>{title} 🔽</h6>
        </CCardHeader>
        <CCollapse visible={openSections[title]}>
          <CCardBody>
            {splitData.map((chunk, index) => (
              <CRow key={index}>
                {chunk.map(([key, value]) => (
                  <CCol md="4" key={key} className="mb-2">
                    <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>{' '}
                    {typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}
                  </CCol>
                ))}
              </CRow>
            ))}
          </CCardBody>
        </CCollapse>
      </CCard>
    )
  }

  if (loading) {
    return <p className="text-center mt-4">Loading loan details...</p>
  }
  const handlePrevious = () => {
    navigate(-1)
  }
  return (
    <CContainer className="mt-4">
      <CCard className="shadow-lg">
        <CCardHeader
          style={{ backgroundColor: '#33bbff', color: 'white' }}
          className="d-flex justify-content-between align-items-center"
        >
          {/* Back Button (Left Side) */}
          <CButton color="success" onClick={handlePrevious} title="Go Back">
            <FaArrowLeft /> Back
          </CButton>

          {/* Centered Title */}
          <h5 className="m-0">🏦 Loan Approver Summary</h5>

          {/* Empty Space (Right Side) to Maintain Alignment */}
          <div></div>
        </CCardHeader>

        <CCardBody>
          {loanData ? (
            <>
              <CCard className="mb-3 shadow">
                <CCardHeader
                  className="bg-light text-muted"
                  onClick={() => toggleSection('personalDetails')}
                >
                  <CRow className="align-items-center">
                    <CCol>
                      <h6 style={{ cursor: 'pointer' }}>Personal Details 🔽</h6>
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCollapse visible={openSections['personalDetails']}>
                  <CCardBody>
                    <CRow>
                      {Object.entries(loanData.personalData.personalInfo).map(([key, value]) => (
                        <CCol md="4" key={key} className="mb-2">
                          <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value || 'N/A'}
                        </CCol>
                      ))}
                    </CRow>
                    <CRow>
                      {Object.entries(loanData.personalData.contactInfo).map(([key, value]) => (
                        <CCol md="4" key={key} className="mb-2">
                          <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value || 'N/A'}
                        </CCol>
                      ))}
                    </CRow>
                    <CRow>
                      {Object.entries(loanData.personalData.addressInfo).map(([key, value]) => (
                        <CCol md="4" key={key} className="mb-2">
                          <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value || 'N/A'}
                        </CCol>
                      ))}
                    </CRow>
                  </CCardBody>
                </CCollapse>
              </CCard>
              {/* Previous Employment Details */}
              <CCard className="mb-3 shadow">
                <CCardHeader
                  className="bg-light text-muted"
                  onClick={() => toggleSection('Employment Details')}
                >
                  <CRow className="align-items-center">
                    <CCol>
                      <h6 style={{ cursor: 'pointer' }}>Employment Details🔽</h6>
                    </CCol>
                  </CRow>
                </CCardHeader>
              </CCard>
              <CCollapse visible={openSections['Employment Details']}>
                <CCardBody>
                  {/* Current Employment Info */}
                  <CRow>
                    {Object.entries(loanData.employmentData).map(([key, value]) => {
                      // Skip 'prevEmployments' since it needs custom rendering
                      if (key === 'prevEmployments') return null

                      // Format employmentPeriod separately
                      if (key === 'employmentPeriod') {
                        return (
                          <CCol md="4" key={key} className="mb-2">
                            <strong>Employment Duration:</strong> {value.employmentYears} years{' '}
                            {value.employmentMonths} months
                          </CCol>
                        )
                      }

                      return (
                        <CCol md="4" key={key} className="mb-2">
                          <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value || 'N/A'}
                        </CCol>
                      )
                    })}
                  </CRow>

                  {/* Previous Employment Info */}
                  {loanData.employmentData.prevEmployments &&
                    loanData.employmentData.prevEmployments.length > 0 && (
                      <>
                        <h6 className="mt-3">📌 Previous Employment</h6>
                        <CRow>
                          {loanData.employmentData.prevEmployments.map((prev, index) => (
                            <CCol md="4" key={index} className="mb-2">
                              <strong>Company:</strong> {prev.prevCompanyName} <br />
                              <strong>Experience:</strong>{' '}
                              {prev.prevEmploymentPeriod.prevEmploymentYears} years{' '}
                              {prev.prevEmploymentPeriod.prevEmploymentMonths} months
                            </CCol>
                          ))}
                        </CRow>
                      </>
                    )}
                </CCardBody>
              </CCollapse>

              {renderSection('Household Expenses', loanData.houseHold)}
              {renderSection('Liabilities', loanData.liabilities)}
              {renderSection('Assets', loanData.assetsDetail)}
              {renderSection('Bank Details', loanData.bankDetails)}

              {/* Initial Approver Decision Section */}
              <CCard className="mb-3 shadow">
                <CCardHeader className="bg-dark text-white text-center">
                  <h6>📋 Initial Approver Decision</h6>
                </CCardHeader>
                <CCardBody>
                  <CRow className="mb-3">
                    <CCol md="12">
                      <CFormTextarea
                        rows="3"
                        className="form-control"
                        placeholder="📝 Enter remarks/comments"
                        value={decision.comments}
                        onChange={(e) => setDecision({ ...decision, comments: e.target.value })}
                      />
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md="6"></CCol>
                    <CCol md="6">
                      <p>
                        <strong>👤 Approver:</strong> {approverName}
                      </p>
                      <p>
                        <strong>📆 Approval Date:</strong> {currentDate}
                      </p>
                    </CCol>
                  </CRow>

                  <div className="mt-4 text-end">
                    <CButton className="m-4" color="primary" type="submit" onClick={handleApprove}>
                      Approve
                    </CButton>

                    <CButton color="danger" type="submit" onClick={handleReject}>
                      Reject
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </>
          ) : (
            <p className="text-danger text-center">⚠️ No loan details available.</p>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default InitialApproverForm
