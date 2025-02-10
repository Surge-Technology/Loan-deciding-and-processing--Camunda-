/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { useParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'
import { Container, FormLabel, Input, Select } from '@mui/material'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import moment from 'moment/moment'
import * as Yup from 'yup'
import axios from 'axios'
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

// // Import the validation function
// import {validateForm} from './formValidation';  // Adjust the path based on your file structure

const LoanRequest = () => {
  const [state, setState] = useState({
    customerId: '',
    //newCustomer: false
  })

  let params = useNavigate()
  let navigate = useNavigate()
  const [newCustomer, setNewCustomer] = useState(false)

  const initialValues = {
    customerId: state.customerId,
    newCustomer: state.newCustomer,
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  //}

  // Handle checkbox change
  const handleCheckbox = (e) => {
    setNewCustomer(e.target.checked)
  }

  const checkNewCustomer = () => {
    axios
      .post('http://localhost:8080/checkNewCustomer')
      .then((response) => {
        // Axios considers any status code in the 2xx range as a success
        // So, no need for response.ok
        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }
        return response.data // Axios responses already return JSON data in the 'data' property
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message)
      })
  }

  // Handle form submit
  const SubmitForm = (values) => {
    setState((prevState) => ({ ...prevState }))
    //checkNewCustomer(newCustomer);
    if (newCustomer === true) {
      setNewCustomer(true)

      axios

        .post('http://localhost:8080/checkNewCustomer', { newCustomer: true })
        .then((response) => {
          navigate('/applyLoan/basicDetails/new')
          return response.data // Returning the response data if needed for further processing
        })
        .then((data) => {
          console.log('API Response:', data) // Handle or log response data as needed
        })
        .catch((error) => {
          // Handle any errors that occur during the API call
          console.error('There was a problem with the API call:', error.message)
        })
    } else {
      let id = {
        customerId: values.customerId,
      }
      let sendData = {
        // newCustomer: newCustomer,
        customerId: id.customerId,
      }
      console.log('Id that will be submitted is :', id.customerId)

      axios
        .post(`http://localhost:8080/checkNewCustomer?customerId=${id.customerId}`)
        .then((response) => {
          // Axios considers any status code in the 2xx range as a success
          // So, no need for response.ok
          navigate(`/applyLoan/basicDetails/${id.customerId}`)
          if (response.status !== 200) {
            throw new Error('Network response was not ok')
          }
          return response.data // Axios responses already return JSON data in the 'data' property
        })
        .then((data) => {
          console.log(data)
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error.message)
        })
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <ToastContainer />
      <Container className=" d-flex justify-content-center align-items-center">
        <CRow>
          <CCol>
            <CCard
              className="mb-3 d-flex justify-content-center align-items-center"
              style={{ maxWidth: '980px' }}
            >
              <CRow className="g-0">
                <CCol md={6}>
                  <CCardImage src="src/assets/images/applyloan.jpg" style={{ height: '100%' }} />
                </CCol>
                <CCol md={6}>
                  <CCol>
                    <CCardBody>
                      <CCardTitle>
                        <h4>
                          <strong>Apply For Loan</strong>
                        </h4>
                      </CCardTitle>
                      <Formik
                        enableReinitialize="true"
                        initialValues={initialValues}
                        //validationSchema={ValidationSchema}
                        //validateOnBlur={true}  // Validates when input loses focus
                        //validateOnChange={true}  // Validation only on form submission
                        onSubmit={SubmitForm}
                      >
                        {({
                          values,
                          setFieldValue,
                          handleChange,
                          handleSubmit,
                          resetForm,
                          handleBlur,
                          errors,
                          touched,
                        }) => (
                          <Form id="myForm" onSubmit={handleSubmit} className="mx-auto my-4">
                            <CRow xs={{ gutter: 2 }}>
                              <CCol className="text-end mb-3">
                                <FormLabel class="form-check-label" for="flexSwitchCheckReverse">
                                  New Customer{' '}
                                </FormLabel>
                              </CCol>
                              <CCol className="form-check form-switch">
                                <CFormInput
                                  name="newCustomer"
                                  className=" text-start form-check-input"
                                  type="checkbox"
                                  id="flexSwitchCheckReverse"
                                  onClick={handleCheckbox}
                                />
                              </CCol>
                            </CRow>

                            <CRow>
                              <CCol md={2}></CCol>
                              <CCol md={6} className="justify-start">
                                {newCustomer == false ? (
                                  <CFormInput
                                    id="floatingInput"
                                    type="text"
                                    name="customerId"
                                    floatingClassName="mb-3"
                                    floatingLabel="Customer Id"
                                    placeholder="Customer Id"
                                    value={values.customerId}
                                    onChange={handleInputChange}
                                    onChangeCapture={handleChange}
                                    onBlur={handleBlur}
                                  />
                                ) : null}
                              </CCol>
                            </CRow>
                            <CRow>
                              <div className=" d-md-flex justify-content-md-center">
                                <CButton
                                  id="bttn"
                                  as="input"
                                  type="submit"
                                  value="Submit"
                                  onSubmit={SubmitForm}
                                />
                              </div>
                            </CRow>
                          </Form>
                        )}
                      </Formik>
                    </CCardBody>
                  </CCol>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </Container>
    </>
  )
}

export default LoanRequest
