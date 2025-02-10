/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup' // Import Yup for validation
import moment from 'moment'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
  CCardImage,
  CSpinner,
  CFormCheck,
  CFormLabel,
  CFormSwitch,
} from '@coreui/react'
import { Container } from '@mui/material'

const CreateCustomer = () => {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    legalFullName: '',
    birthDate: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
    spouseStatus: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    postalCode: '',
    occupation: '',
    nationalId: '',
    nationalIdType: '',
    employmentStatus:''
  })

  const initialValues = { ...state }
  const params = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
 // Define Yup validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed'),
    lastName: Yup.string()
      .required('Last Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed'),
    legalFullName: Yup.string()
      .required('Full Name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed'),

    birthDate: Yup.string()
      .required('Birth date is required')
      .test(
        'DOB',
        'Age must be at least 18 years',
        (date) => moment().diff(moment(date), 'years') >= 18,
      ),
    nationality: Yup.string()
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed')
      .required('Nationality is required'),
    gender: Yup.string()
      .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
      .required('Gender is required'),
    maritalStatus: Yup.string()
      .oneOf(['married', 'unmarried'], 'Invalid marital status')
      .required('Marital Status is required'),
      employmentStatus: Yup.string()
      .oneOf(['self-employed', 'employed','unemployed'], 'Invalid marital status')
      .required('Marital Status is required'),
   
    phone: Yup.string()
      .min(10, 'Minimum 10 digits!')
      .max(14, 'Maximum 14 digits!')
      .matches(/^\d+$/, 'Phone must be numeric')
      .required('Phone number is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required')
      .email('Invalid mail address'),
    city: Yup.string().required('city is required'),
    state: Yup.string().required('state is required'),
    country: Yup.string().required('country is required'),
    nationalId: Yup.string().required('National Id is required'),
    nationalIdType: Yup.string().required('National Id Type is required'),

    address: Yup.string().required('Address is required'),
    postalCode: Yup.string()
      .matches(/^\d{5,6}$/, 'postalCode must be valid')
      .min(6, 'Must be exactly 6 digits')
      .max(6, 'Must be exactly 6 digits')
      .required('postalCode is required'),
    occupation: Yup.string().required('Occupation is required'),
    annualIncome: Yup.number()
      .required('Annual income is required')
      .min(0, 'Income cannot be negative'),
  })
 
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const dateHandleChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const SubmitData = (values) => {
    
    let payload = {
      ...values,
      dob: String(moment(values.birthDate).format('MM-DD-YYYY')),
    }
    console.log('Payload that will be submitted is :', payload)

    if (isSubmitting) return
    setIsSubmitting(true)
    axios
      .post(`http://localhost:8080/claimAndCompleteTask`, payload)
      // .then((res) => {
      //     console.log('response from backend ', res);
      //     Swal.fire('Success', 'Customer created successfully', 'success');
      // })

      .then((res) => {
        // Show success alert
        Swal.fire({
          title: 'Success',
          text: 'Account created successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/applyLoan/selectType')
          // Clear form after the OK button is clicked
          //   document.getElementById('myForm').reset();
        })
      })

      .catch((err) => {
        console.error('Error sending data:', err.response ? err.response.data : err.message)
        Swal.fire('Error', 'Please try again', 'error')
      })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center mt-2">
        <CRow>
          <CCol>
            <CCard
              className="mb-3 d-flex justify-content-center align-items-center"
              style={{
                maxWidth: '1200px',
                width: '132%',
                marginLeft: '-50px',
                marginRight: '70px',
              }}
            >
              <CCol md={10}>
                <CCardBody>
                  <CCardTitle className="mt-3 mb-3">
                    {' '}
                    <strong>Customer Registration Form</strong>
                  </CCardTitle>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema} // Use the validation schema
                    onSubmit={SubmitData}
                  >
                    {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
                      <Form id="myForm" onSubmit={handleSubmit}>
                        <CRow>
                          <CCol className="text-start">
                            <div>
                              Personal Details:
                              <span style={{ color: 'red', fontSize: '20px' }}>*</span>
                            </div>
                          </CCol>
                        </CRow>
                        <CRow xs={{ gutter: 2 }}>
                          <CCol>
                            <CFormInput
                              type="text"
                              name="firstName"
                              floatingLabel="First Name"
                              value={values.firstName}
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.firstName && !!errors.firstName}
                            />
                            <ErrorMessage
                              name="firstName"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="text"
                              name="lastName"
                              floatingLabel="Last Name"
                              value={values.lastName}
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.lastName && !!errors.lastName}
                            />
                            <ErrorMessage name="lastName" component="div" className="text-danger" />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol className="text-start">
                            <div>
                              Full Name:(as per nationality){' '}
                              <span style={{ color: 'red', fontSize: '20px' }}>*</span>
                            </div>
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="floatingInput"
                              name="legalFullName"
                              value={values.legalFullName}
                              floatingClassName="mb-2"
                              floatingLabel="FullName"
                              placeholder="FullName"
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.legalFullName && !!errors.legalFullName}
                            />
                            <ErrorMessage
                              name="legalFullName"
                              component="div"
                              className="errmsg text-danger"
                            ></ErrorMessage>
                          </CCol>
                        </CRow>
                        <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                          <CCol>
                            <CFormInput
                              type="date"
                              name="birthDate"
                              floatingLabel="DOB"
                              selected={values.birthDate ? new Date(values.birthDate) : null}
                              onChange={(e) => {
                                dateHandleChange('birthDate', e)
                              }}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.birthDate && !!errors.birthDate}
                            />
                            <ErrorMessage
                              name="birthDate"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="floatingInput"
                              name="phone"
                              value={values.phone}
                              floatingClassName="mb-2"
                              floatingLabel="Phone number"
                              placeholder="Phone Number"
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.phone && !!errors.phone}
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="errmsg text-danger"
                            ></ErrorMessage>
                          </CCol>
                        </CRow>
                        <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                          <CCol>
                            <CFormSelect
                              name="gender"
                              floatingLabel="Gender"
                              value={values.gender}
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.gender && !!errors.gender}
                              options={[
                                { value: 'select', label: 'Select' },
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' },
                              ]}
                            />
                            <ErrorMessage name="gender" component="div" className="text-danger" />
                          </CCol>

                          <CCol>
                            <CFormInput
                              type="text"
                              id="floatingInput"
                              name="nationality"
                              value={values.nationality}
                              floatingClassName="mb-2"
                              floatingLabel="nationality"
                              placeholder="Nationality"
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.nationality && !!errors.nationality}
                            />
                            <ErrorMessage name="nationality" component="div" className="text-danger" />
                          </CCol>
                        </CRow>
                        <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                          <CCol>
                            <CFormSelect
                              name="maritalStatus"
                              floatingLabel="Marital Status"
                              value={values.maritalStatus}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.maritalStatus && !!errors.maritalStatus}
                              options={[
                                { value: 'select', label: 'Select' },
                                { value: 'married', label: 'Married' },
                                { value: 'unmarried', label: 'Unmarried' },
                              ]}
                            />
                            <ErrorMessage
                              name="maritalStatus"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                          <CCol>
                            <div className="form-group">
                              <label htmlFor="spouseStatus">Spouse:</label>
                              <div>
                                <label style={{paddingLeft:'30px',paddingRight:'30px'}}>
                                  <input
                                    type="radio"
                                    name="spouseStatus"
                                    value="yes"
                                    checked={state.spouseStatus === 'yes'}
                                    onChange={handleInputChange}
                                  />
                                  Yes
                                </label>
                                <label  style={{paddingRight:'30px'}}>
                                  <input
                                    type="radio"
                                    name="spouseStatus"
                                    value="no"
                                    checked={state.spouseStatus === 'no'}
                                    onChange={handleInputChange}
                                  />
                                  No
                                </label>
                              </div>
                            </div>
                          </CCol>
                        </CRow>
                       
                        <CRow>
                          <CCol className="text-start">
                            <div>
                              Email<span style={{ color: 'red', fontSize: '20px' }}>*</span>
                            </div>
                          </CCol>
                        </CRow>
                        <CRow xs={{ gutter: 2 }}>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="floatingInput"
                              name="email"
                              value={values.email}
                              floatingClassName="mb-2"
                              floatingLabel="Email address"
                              placeholder="name@example.com"
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.email && !!errors.email}
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="errmsg text-danger"
                            ></ErrorMessage>
                          </CCol>
                        </CRow>
                       

                        <CRow xs={{ gutter: 2 }}>
                          <CCol>
                            <CFormSelect
                              name="nationalIdType"
                              floatingLabel="National ID Type"
                              value={values.nationalIdType}
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.nationalIdType && !!errors.nationalIdType}
                              options={[
                                { value: '', label: 'Select National ID Type' },
                                { value: 'Aadhaar', label: 'Aadhaar' },
                                { value: 'PAN', label: 'PAN' },
                                { value: 'Passport', label: 'Passport' },
                                { value: 'DrivingLicense', label: 'Driving License' },
                                { value: 'VoterID', label: 'Voter ID' },
                                // Add more options as needed
                              ]}
                            />
                            <ErrorMessage
                              name="nationalIdType"
                              component="div"
                              className="errmsg text-danger"
                            />
                          </CCol>

                          <CCol>
                            <CFormInput
                              type="text"
                              id="floatingInput"
                              name="nationalId"
                              value={values.nationalId}
                              floatingClassName="mb-2"
                              floatingLabel="National Id"
                              // placeholder=""
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.nationalId && !!errors.nationalId}
                            />
                            <ErrorMessage
                              name="nationalId"
                              component="div"
                              className="errmsg text-danger"
                            ></ErrorMessage>
                          </CCol>
                        </CRow>
                        <CRow xs={{ gutter: 3 }}>
                         
                          <CCol>
                            <CFormInput
                              type="text"
                              id="floatingInput"
                              name="state"
                              value={values.state}
                              floatingClassName="mb-2"
                              floatingLabel="State"
                              placeholder="State"
                              onChange={handleInputChange}
                              onChangeCapture={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.state && !!errors.state}
                            />
                            <ErrorMessage name="state" component="div" className="text-danger" />
                          </CCol>
                          <CCol>
                          <CFormInput
                            type="text"
                            id="floatingInput"
                            name="city"
                            value={values.city}
                            floatingClassName="mb-2"
                            floatingLabel="City"
                            placeholder="City"
                            onChange={handleInputChange}
                            onChangeCapture={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.city && !!errors.city}
                          />
                          <ErrorMessage name="city" component="div" className="text-danger" />
                        </CCol>
                        <CCol>
                        <CFormInput
                          type="text"
                          id="floatingInput"
                          name="postalCode"
                          value={values.postalCode}
                          floatingClassName="mb-2"
                          floatingLabel="Postal Code"
                          placeholder="postal Code"
                          onChange={handleInputChange}
                          onChangeCapture={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.postalCode && !!errors.postalCode}
                        />
                        <ErrorMessage name="postalCode" component="div" className="text-danger" />
                      </CCol>
                        </CRow>
                        <CCol>
                            <CFormSelect
                              name="employmentStatus"
                              floatingLabel="Employment Status"
                              value={values.employmentStatus}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.employmentStatus && !!errors.employmentStatus}
                              options={[
                                { value: 'select', label: 'Select' },
                                { value: 'married', label: 'Married' },
                                { value: 'unmarried', label: 'Unmarried' },
                              ]}
                            />
                            <ErrorMessage
                              name="employmentStatus"
                              component="div"
                              className="text-danger"
                            />
                          </CCol>
                        <CRow>
                          <CCol className="text-start">
                            <div>
                              Employment Details:
                              <span style={{ color: 'red', fontSize: '20px' }}>*</span>
                            </div>
                          </CCol>
                        </CRow>
                        <CRow>
                        <CCol>
                        <select
                          name="employmentStatus"
                          value={state.employmentStatus}
                          onChange={handleInputChange}
                          id="employmentStatus"
                          className="form-control"
                        >
                          <option value="">Select Employment Status</option>
                          <option value="employed">Employed</option>
                          <option value="self-employed">Self-employed</option>
                          <option value="unemployed">Unemployed</option>
                        </select>
                        <ErrorMessage name="employmentStatus" component="div" className="text-danger" />

                      </CCol>
                         
                        </CRow>
                        <CRow>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                            <CButton
                              id="cancel"
                              type="button"
                              color="danger"
                              onClick={() => document.getElementById('myForm').reset()}
                            >
                              Cancel
                            </CButton>
                            <CButton id="bttn" type="submit" disabled={isSubmitting}>
                              {isSubmitting ? <CSpinner /> : 'Submit'}
                            </CButton>
                          </div>
                        </CRow>
                      </Form>
                    )}
                  </Formik>
                </CCardBody>
              </CCol>
            </CCard>
          </CCol>
        </CRow>
      </Container>
    </>
  )
}

export default CreateCustomer
