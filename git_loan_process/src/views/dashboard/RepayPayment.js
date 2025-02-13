/* eslint-disable prettier/prettier */

import { CButton, CFormLabel, CFormSelect } from '@coreui/react'
import { Input } from '@mui/material'
import axios from 'axios'
import { ErrorMessage, Form, Formik } from 'formik'
import moment from 'moment'
import React, { useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import PropTypes from 'prop-types'

const RepayPayment = ({ loanDetails, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [amountType, setAmountType] = useState('')
  // const [balanceAmount, setBalanceAmount] = useState(loanDetails.loanAmount)
  const [loader,setLoader] = useState(false);
  const [transactionAmount,setTransactionAmount] = useState('')
  const [balAmount,setBalAmount] = useState('')

  const handleAmountChange = (e, setFieldValue) => {
    const amount = Number(e.target.value)
    setFieldValue('repayAmount', amount)
    setBalanceAmount(loanDetails.loanAmount - amount)
  }
  const storedBalance = localStorage.getItem(`balance_${loanDetails.accountNumber}`);
  const [balanceAmount, setBalanceAmount] = useState(storedBalance ? Number(storedBalance) : loanDetails.loanAmount);
  const URL = import.meta.env.VITE_BASE_URL;

  const handleRepayment = (values) => {
    setLoader(true);
    const payload = {
      transactionStatus: '',
      date: moment().format('YYYY-MM-DDTHH:mm:ss'),
      loanId: loanDetails.accountNumber,
      loanAmount: loanDetails.loanAmount,
      paymentType: paymentMethod,
      transactionAmount: amountType === 'full' ? loanDetails.loanAmount : values.repayAmount,
    }

    console.log('Payload:', payload)
    axios
      .post(`${URL}/save?loanAccountNumber=${payload.loanId}`, payload)
      .then((res) => {
        setLoader(false);
        console.log(res.data.transactionAmount,res.data.balanceAmount);
        setTransactionAmount(res.data.transactionAmount);
        setBalAmount(res.data.balanceAmount);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully initiated repayment',
          showConfirmButton: true,
        }).then(() => onSuccess(transactionAmount,balAmount)) // Close modal on success
      })
      .catch((err) => {
        console.error('Error initiating repayment:', err)
        Swal.fire('Error occurred. Please try again later.', '', 'error')
      })
  }

  return (
    <>
  
    <Formik
      initialValues={{ repayAmount: '' }}
      onSubmit={handleRepayment}
    >
      {({ values, setFieldValue, handleBlur, handleSubmit }) => (
        <Form>
          {/* ✅ Applicant & Loan Details Section */}
          <Row className="mb-3">
            <Col md={6}>
              <CFormLabel>Applicant Name:</CFormLabel>
              <Input type="text" value={loanDetails.applicantName} readOnly fullWidth />
            </Col>
            <Col md={6}>
              <CFormLabel>Account Number:</CFormLabel>
              <Input type="text" value={loanDetails.accountNumber} readOnly fullWidth />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <CFormLabel>Loan Amount:</CFormLabel>
              <Input type="text" value={`₹ ${loanDetails.loanAmount}`} readOnly fullWidth />
            </Col>
            <Col md={6}>
              <CFormLabel>Payment Method:</CFormLabel>
              <CFormSelect value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="online_payment">Online Payment</option>
                <option value="cheque">Cheque</option>
              </CFormSelect>
            </Col>
          </Row>
          

          {/* ✅ Payment Type Selection */}
          <Row className="mb-3">
            <CFormLabel>Select Payment Type:</CFormLabel>
            <Col md={6} className="text-start">
              <label className="me-3">
                <input
                  type="radio"
                  name="amountType"
                  value="full"
                  checked={amountType === 'full'}
                  onChange={() => {
                    setAmountType('full')
                    setFieldValue('repayAmount', loanDetails.loanAmount)
                    setBalanceAmount(0)
                  }}
                />
                Full Amount
              </label>
              <label>
                <input
                  type="radio"
                  name="amountType"
                  value="custom"
                  checked={amountType === 'custom'}
                  onChange={() => setAmountType('custom')}
                />
                Custom Amount
              </label>
            </Col>
            <Col md={6} className='text-satrt'>
            {loader?<Spinner
              className='loaderr'
               color="info"
              ></Spinner>:null}
            </Col>
          </Row>

          {/* ✅ Repayment Amount & Balance Display */}
          {amountType === 'custom' && (
            <Row className="mb-3">
              <Col md={6}>
                <CFormLabel>Repay Amount:</CFormLabel>
                <Input
                  type="number"
                  name="repayAmount"
                  value={values.repayAmount}
                  onBlur={handleBlur}
                  onChange={(e) => handleAmountChange(e, setFieldValue)}
                  fullWidth
                />
                <ErrorMessage name="repayAmount" component="div" className="text-danger" />
              </Col>
              <Col md={6}>
                <CFormLabel>Balance Amount:</CFormLabel>
                <Input type="text" value={`₹ ${balanceAmount}`} readOnly fullWidth />
              </Col>
            </Row>
          )}

          {/* ✅ Action Buttons */}
          <div className="text-center mt-3">
            <CButton color="danger" className="me-3" onClick={onClose}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary">
              Initiate Repayment
            </CButton>
          </div>
        </Form>
      )}
    </Formik>
    </>
  )
}

// ✅ Prop Validation for Better Code Quality
RepayPayment.propTypes = {
  loanDetails: PropTypes.shape({
    applicantName: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired,
    loanAmount: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default RepayPayment
