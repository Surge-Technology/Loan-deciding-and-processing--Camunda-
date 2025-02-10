/* eslint-disable prettier/prettier */

import { CButton } from '@coreui/react'
import { Input, Select } from '@mui/material'
import axios from 'axios'
import { ErrorMessage, Form, Formik } from 'formik'
import moment from 'moment'
import { CFormLabel, CFormSelect, CRow } from '@coreui/react'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const RepayDetails = {
  id: '',
  loanAccountNumber: '',
  loanAmmount: '',
  loanType: '',
  paymentMethod: '',
  repayAmmount: '',
  ammountType: '',
}

const RepayPayment = (props) => {
  const { loanDetails, onClose, onSuccess } = props
  const [state, setState] = useState(props)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [amountType, setAmountType] = useState('')
  const [balanceAmount,setBalanceAmount] = useState();

  const navigate = useNavigate()

  //console.log('props', loanDetails)

  const fieldHandleChange = (e) => {
    const { name, value } = e.target
    
    
    if (name === 'repayAmmount') {
      let balance = Number(loanDetails.loanAmount) - Number(value) 
      setBalanceAmount(balance);
      setState((prevState) => ({
        ...prevState, 
        [name]:value,
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  const InitiateRepayment = (values) => {
    let payload = {
      uanId: '',
      transactionStatus: '',
      date: moment().format('YYYY-MM-DDTHH:mm:ss'),
      loanId: loanDetails.accountNumber,
      loanAmount: loanDetails.loanAmount,
      paymentType: paymentMethod,
      transactionAmount: amountType === 'full' ? loanDetails.loanAmount : values.repayAmmount,
    }

    console.log('Payload', payload)
    axios
     // .post(`http://localhost:8080/api/transactions/save`, payload)
     .post(`http://localhost:8080/save`, payload)
      .then((res) => {
        console.log('Succesfully initiated repayment', res)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Successfully initiated repayment',
          showConfirmButton: true,
          // timer: 1500 // Remove this if you want the user to manually close the alert
        }).then(() => {
          // Navigate back to the previous page;
          onSuccess() // Call the onSuccess function to close the modal and refresh the component
        })
      })
      .catch((err) => {
        console.log('Error occered in initiating repayment', err)
        Swal.fire(err.response.data.message, 'Please try again later')
      })
  }

  const validationSchema = Yup.object().shape({
    repayAmmount: Yup.number()
      .typeError('Repay Amount must be a number')
      .required('Repay Amount is required')
      .min(10000, 'Minimum repay amount should be 10,000'),
    paymentMethod: Yup.string().required('Payment method is required'),
    amountType: Yup.string().oneOf(
      ['full', 'custom'],
      'Please select a valid amount type (Full or Custom)',
    ),
    // .required("Amount type is required"),
  })

  return (
    <>
      <Formik
        initialValues={RepayDetails}
        // validationSchema={validationSchema}
        onSubmit={InitiateRepayment}
      >
        {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, errors, touched }) => (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <label>Applicant Name: </label>
                <Input
                  type="text"
                  name="id"
                  //value={values.id}
                  value={loanDetails.applicantName}
                  onBlur={handleBlur}
                  onChangeCapture={handleChange}
                  onChange={fieldHandleChange}
                  invalid={touched.id && !!errors.id}
                />
              </Col>
              <Col md={6}>
                <label>Account Number: </label>
                <Input
                  type="text"
                  name="loanAccountNumber"
                  //value={values.loanAccountNumber}
                  value={loanDetails.accountNumber}
                  onBlur={handleBlur}
                  onChangeCapture={handleChange}
                  onChange={fieldHandleChange}
                  invalid={touched.loanAccountNumber && !!errors.loanAccountNumber}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <label>Loan Ammount: </label>
                <Input
                  type="text"
                  name="loanAmmount"
                  //value={values.loanAmmount}
                  value={loanDetails.loanAmount}
                  onBlur={handleBlur}
                  onChangeCapture={handleChange}
                  onChange={fieldHandleChange}
                  invalid={touched.loanAmmount && !!errors.loanAmmount}
                />
              </Col>
              <Col md={6}>
                <CFormLabel className="text-dark">Payment Method:</CFormLabel>
                <CFormSelect
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="online_payment">Online Payment</option>
                  <option value="cheque">Cheque</option>
                </CFormSelect>
                <ErrorMessage
                  name="paymentMethod"
                  component="div"
                  className="errmsg"
                  style={{ color: 'red' }}
                />
              </Col>
            </Row>
            <Row>
              <label>Select Amount</label> {/*<span style={{ color: 'red' }}>*</span>*/}
            </Row>
            <Row className="mb-3">
              <Col md={6} className="text-start">
                <label>
                  <input
                    type="radio"
                    name="amountType"
                    value="full"
                    checked={amountType === 'full'}
                    onChangeCapture={handleChange}
                    onChange={(e) => {
                      setFieldValue('amountType', 'full')
                      setAmountType('full')
                    }}
                    //onChange={() => setAmountType("full")}
                  />
                  Full Amount
                </label>
                <label style={{ marginLeft: '10px' }}>
                  <input
                    type="radio"
                    name="amountType"
                    value="custom"
                    checked={amountType === 'custom'}
                    onChange={(e) => {
                      setFieldValue('amountType', 'custom')
                      setAmountType('custom')
                    }}
                    onChangeCapture={handleChange}
                    //onChange={() => setAmountType("custom")}
                  />
                  Custom
                </label>

                <ErrorMessage
                  name="amountType"
                  component="div"
                  className="errmsg"
                  style={{ color: 'red' }}
                />
              </Col>
            </Row>
            {amountType !== '' ? (
              <>
                <Row>
                  <Col md={6}>
                    <label>Repay Ammount: </label>
                    <Input
                      type="text"
                      name="repayAmmount"
                      value={amountType === 'full' ? loanDetails.loanAmount : values.repayAmmount}
                      onBlur={handleBlur}
                      onChangeCapture={handleChange}
                      onChange={fieldHandleChange}
                    />
                    <ErrorMessage
                      name="repayAmmount"
                      component="div"
                      className="errmsg"
                      style={{ color: 'red' }}
                    />
                  </Col>
                  <Col md={6}>
                    <label>Balance Ammount: </label>
                    <Input
                      type="text"
                      name="balanceAmmount"
                      value={balanceAmount}
                      readOnly
                      onBlur={handleBlur}
                      onChangeCapture={handleChange}
                      onChange={fieldHandleChange}
                    />
                    <ErrorMessage
                      name="repayAmmount"
                      component="div"
                      className="errmsg"
                      style={{ color: 'red' }}
                    />
                  </Col>
                </Row>
              </>
            ) : null}
            <div style={{ marginTop: '18px' }}>
              <center>
                <CButton
                  type="reset"
                  color="danger"
                  className="btn"
                  size="sm"
                  style={{ margin: '10px' }}
                  onClick={onClose}
                >
                  Cancel
                </CButton>
                <CButton type="submit" color="primary" className="btn" size="sm">
                  initiate
                </CButton>
              </center>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default RepayPayment
