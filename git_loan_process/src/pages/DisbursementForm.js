/* eslint-disable prettier/prettier */

import { CButton } from '@coreui/react'
import { Input, Select } from '@mui/material'
import axios from 'axios'
import { ErrorMessage, Form, Formik } from 'formik'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
const URL = import.meta.env.VITE_BASE_URL

const DisbursementForm = (props) => {
  const { loanAccountNumber,loanAmount, onClose, onSuccess } = props
  const [state, setState] = useState({
    loanId: '',
    loanAccountNumber: loanAccountNumber || '',
    applicantName: '',
    loanAmount: loanAmount || '',
    tenure: '',
    interestRate: '',
  })

  const navigate = useNavigate()

  console.log('props', props, loanAccountNumber)

//   const fieldHandleChange = (e) => {
//     const { name, value } = e.target

//     setState((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }))
//   }

  const submitForm = (values) => {
    // let payload = {
    //   "loanAccountNumber": state.loanAccountNumber, // Fixed typo (loanaccountnumber -> loanAccountNumber)
    //   "applicantName": state.applicantName,
    //   "loanAmount": state.loanAmount,
    //   "tenure": state.tenure,
    //   "interestRate": state.interestRate,
    // };
    
  
    //console.log("Payload", payload);
  
    axios
      .post(`${URL}/ManagerEnd`)
      .then((res) => {
        console.log("Successfully initiated repayment", res.data);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Successfully completed disbursement",
          showConfirmButton: true,
        }).then(() => {
          // Navigate back to the previous page;
          onSuccess() 
        })
      })
      .catch((err) => {
        console.log("Error occurred in initiating repayment", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Please try again later",
        });
      });
  };
  
  useEffect(() => {
    axios
      .post(`${URL}/calculateTenureInterest`)
      .then((res) => {
        //console.log('Succesfully completed ', res.data)
        setState((prevState) => ({
          ...prevState,
          loanId: res.data.id,
          loanAccountNumber: res.data.loanAccountNumber,
          applicantName: res.data.applicantName,
          loanAmount: res.data.loanAmount,
          tenure: res.data.tenure,
          interestRate: res.data.interestRate,
        }))
      })
      .catch((err) => {
        console.log('Error occered in initiating repayment', err)
        Swal.fire(err.response.data.message, 'Please try again later')
      })
  }, [])

  return (
    <>
      <Formik initialValues={state} onSubmit={submitForm}>
        {({ values, setFieldValue, handleChange, handleBlur, handleSubmit, errors, touched }) => (
          <Form>
            <Row className="mb-3">
              <Col md={12}>
                <label style={{marginRight:'6px'}}>Applicant Name: </label>
                <Input
                  type="text"
                  name="id"
                  //value={values.id}
                  value={state.applicantName}
                //  onBlur={handleBlur}
                  //onChangeCapture={handleChange}
                  //onChange={fieldHandleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <label>Account Number: </label>
                <Input
                  type="text"
                  name="loanAccountNumber"
                  //value={values.loanDetailsAccountNumber}
                  value={state.loanAccountNumber}
                //  onBlur={handleBlur}
                 // onChangeCapture={handleChange}
                 // onChange={fieldHandleChange}
                />
              </Col>
              <Col md={6}>
                <label>Loan Ammount: </label>
                <Input
                  type="text"
                  name="loanDetailsAmmount"
                  //value={values.loanAmmount}
                  value={state.loanAmount}
                //   onBlur={handleBlur}
                //   onChangeCapture={handleChange}
                //   onChange={fieldHandleChange}
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <label>Tenure: </label>
                <Input
                  type="text"
                  name="loanAmmount"
                  //value={values.loanAmmount}
                  value={state.tenure}
                //   onBlur={handleBlur}
                //   onChangeCapture={handleChange}
                //   onChange={fieldHandleChange}
                />
              </Col>
              <Col md={6}>
                <label>Interest Rate: </label>
                <Input
                  type="text"
                  name="loanAmmount"
                  //value={values.loanAmmount}
                  value={state.interestRate}
                //   onBlur={handleBlur}
                //   onChangeCapture={handleChange}
                //   onChange={fieldHandleChange}
                />
              </Col>
            </Row>

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
                  Approve
                </CButton>
              </center>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default DisbursementForm
