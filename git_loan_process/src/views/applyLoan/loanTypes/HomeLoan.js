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
} from '@coreui/react'
import { Container } from '@mui/material'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import IconButton from '@mui/material/IconButton'

const HomeLoan = () => {
  const [state, setState] = useState({
    homeLoanId: '',
    panNumber: '',
    aadharNumber: '',
    purpose: '',
    // creditScore: '',
    existingLoans: '',
    areaOfLand: '',
    builtArea: '',
    landCost: '',
    costOfExpense: '',
    city: '',
    state: '',
    country: '',
    address: '',
    pincode: '',
  })
  const [homeLoanId, setHomeLoanId] = useState('')

  const initialValues = { ...state }
  
  const params = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Define Yup validation schema
  const validationSchema = Yup.object().shape({
    panNumber: Yup.string()
      .required('PAN number is required')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'),
    aadharNumber: Yup.string()
      .required('Aadhaar number is required')
      .matches(/^\d{12}$/, 'Aadhaar number can only contain numbers')
      .min(12, 'Must be exactly 12 digits')
      .max(12, 'Must be exactly 12 digits'),
    purpose: Yup.string()
      .oneOf(['purchase', 'construction', 'improvement', 'Other'], 'Invalid marital status')
      .required('Please select the purpose of loan'),
    creditScore: Yup.string()
      .required('CIBIL Score is required')
      .matches(/^\d+$/, 'CIBIL must be in numbers'),
    city: Yup.string().required('city is required'),
    state: Yup.string().required('state is required'),
    country: Yup.string().required('country is required'),
    address: Yup.string().required('Address is required'),
    pincode: Yup.string()
      .matches(/^\d{5,6}$/, 'Pincode must be valid')
      .min(6, 'Must be exactly 6 digits')
      .max(6, 'Must be exactly 6 digits')
      .required('Pincode is required'),
    areaOfLand: Yup.string()
      .matches(/^\d+$/, 'Area must be in numbers')
      .required('Area of the land is required'),
    builtArea: Yup.string()
      .matches(/^\d+$/, 'Bulit-Up Area must be in numbers')
      .required('Built-Up Area of the land is required'),
    landCost: Yup.number().required('Salary is required').min(0, 'Salary cannot be negative'),
    costOfExpense: Yup.number().required('Salary is required').min(0, 'Salary cannot be negative'),
    // addressproofDocument: Yup.mixed()
    //     .required('File is required'),
    //     panDocument: Yup.mixed()
    //     .required('File is required'),
    // .test('fileType', 'Only PDF or image files are allowed', (value) => {
    //     if (!value) return false; // if no file is selected
    //     const supportedFormats = ['file/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    //     return supportedFormats.includes(value.type);
    // }),
    // .test('fileSize', 'File size is too large', (value) => {
    //     const maxSize = 2 * 1024 * 1024; // 2 MB limit
    //     return value && value.size <= maxSize;
    // }),
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // const fileHandleChange=(e)=>{
  //     let file =URL.createObjectURL(e.target.files[0]);
  //     setDocumentImage(file);
  //     let formdata = new FormData();
  //     formdata.append('image', e.target.files[0]);
  //     axios.post(`${process.env.REACT_APP_BASE_URL}/panCard/image/upload`,formdata).then((res)=>{
  //        setState((prevState)=>({
  //         ...prevState,
  //         panCardImageNameForApi:res.data.imageName
  //       }))
  //     }).catch(err=>{
  //       Swal.fire(err.response.data.message,'Please try again later');
  //     })
  //   }

  const SubmitData = (values) => {
    
          let payload = {
    //    ...values,
          loanType: "home",
          homeLoanId: Number(values.homeLoanId),
    //   customerId: Number(params.id),

      panNumber: state.panNumber,
      aadharNumber: state.aadharNumber,
      purpose: state.purpose,
      existingLoans: state.existingLoans,
      areaOfLand: state.areaOfLand,
      builtArea: state.builtArea,
      landCost: state.landCost,
      costOfExpense: state.costOfExpense,
      city: state.city,
      state: state.state,
      country: state.country,
      address: state.address,
      pincode: state.pincode,
      customerId:Number(params.id)
    }
    console.log('Payload that will be submitted is :', payload)
    // navigate(`/applyloan/reviewPage/${params.id}`);
      if (isSubmitting) return
      setIsSubmitting(true)
      axios
        .post(`http://localhost:8080/homeLoan`, payload)
        // .then((res) => {
        //     console.log('response from backend ', res);
        //     Swal.fire('Success', 'Customer created successfully', 'success');
        // })

        .then((res) => {
          console.log('response from backend ', res.data)

          // Show success alert
          Swal.fire({
            text: 'Datas stored',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate(`/applyloan/reviewPage/${params.id}`)
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
   
    if (params.id) {
      axios.get(`http://localhost:8080/getHomeLoanDetailsByCustomerId/${params.id}`)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const homeLoanDetails = res.data[0];
            setHomeLoanId(homeLoanDetails.homeLoanId);
            setState(homeLoanDetails);
            console.log('Fetched existing home loan details:', homeLoanDetails);
          } else {
            console.log('No existing loan found, ready for new submission');
          }
        })
        .catch((err) => {
          console.error('Error fetching home loan data:', err.response ? err.response.data : err.message);
          Swal.fire('Error', 'Unable to fetch existing loan data. Please try again.', 'error');
        });
    }
  }, [params.id]);

  return (
    <>
      <Container
        className="d-flex justify-content-center align-items-center mt-2 mb-2"
        style={{ width: '100%', maxWidth: '1200px' }}
      >
        <CRow
          className="d-flex justify-content-center align-items-center "
          style={{ width: '90%', maxWidth: '1200px' }}
        >
          <CCol>
            <CCard
              className="mb-3 d-flex justify-content-center align-items-center"
              style={{
                maxWidth: '980px',
                backgroundImage: `url(src/assets/images/home.jpg)`,
                backgroundSize: 'cover', // Ensures the image covers the entire card
                backgroundPosition: 'start', // Centers the background image
                height: '52rem', // Set a height for the card to match the image
              }}
            >
              <CRow className="g-0">
                {/* <CCol md={6}>
                                    <CCardImage src="src/assets/images/home.jpg" style={{ height: '40rem' , width: '60rem'}} />
                                </CCol> */}
                <CCol md={12}>
                  <CCardBody>
                    <CCardTitle>
                      {' '}
                      <h3>
                        <span
                          className="material-icons-outlined"
                          style={{ paddingRight: ' 250px', paddingLeft: '2px' }}
                        >
                          <IconButton
                            style={{ color: '#314D1C', size: 'xl4' }}
                            onClick={() => navigate(`/applyLoan/selectType/${params.id}`)}
                          >
                            <ArrowCircleLeftIcon />
                          </IconButton>
                        </span>
                        <strong>
                          <em>Home Loan Form</em>
                        </strong>
                      </h3>
                    </CCardTitle>
                    <Formik
                    //   initialValues={initialValues}
                    //   // validationSchema={validationSchema} // Use the validation schema
                    //   onSubmit={SubmitData}
                    initialValues={initialValues}
    //   validationSchema={validationSchema}
      onSubmit={SubmitData}
      enableReinitialize
                    >
                      {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
                        <Form id="myForm" onSubmit={handleSubmit}>
                          <CRow>
                            <CCol className="text-start">
                              <div>
                                ID Proofs:<span style={{ color: 'red', fontSize: '20px' }}>*</span>
                              </div>
                            </CCol>
                          </CRow>
                          <CRow xs={{ gutter: 2 }}>
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                name="panNumber"
                                floatingLabel="PAN Number"
                                className="transparent-input"
                                value={values.panNumber}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.panNumber && !!errors.panNumber}
                              />
                              <ErrorMessage
                                name="panNumber"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                name="aadharNumber"
                                floatingLabel="Aadhar Number"
                                className="transparent-input"
                                value={values.aadharNumber}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.aadharNumber && !!errors.aadharNumber}
                              />
                              <ErrorMessage
                                name="aadharNumber"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-2 mt-2">
                            <CCol className="dark-label">
                              <CFormSelect
                                name="purpose"
                                floatingLabel="Select the purpose of home loan"
                                className="transparent-input"
                                value={values.purpose}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.purpose && !!errors.purpose}
                                options={[
                                  { value: 'select', label: 'Select' },
                                  { value: 'purchase', label: 'Purchase' },
                                  { value: 'construction', label: 'Construction' },
                                  { value: 'imporvement', label: 'Improvement' },
                                  { value: 'Other', label: 'Other' },
                                ]}
                              />
                              <ErrorMessage
                                name="purpose"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          {/* <CRow>
                                                        <CCol className='dark-label' style={{paddingTop:'2px'}}>
                                                            <CFormInput
                                                                type="file"
                                                                size="sm"
                                                                id="formFileSm"
                                                                name="addressproofDocument"
                                                                floatingLabel="Address Proof Document: AadharCard/voterCard"
                                                                className="transparent-input"
                                                                value={values.addressproofDocument}
                                                                onChange={fileHandleChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.addressproofDocument && !!errors.addressproofDocument}
                                                            />
                                                            <ErrorMessage
                                                                name="addressproofDocument"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow  className="mb-2 mt-2">
                                                        <CCol className='dark-label' style={{paddingTop:'2px'}}>
                                                            <CFormInput
                                                                type="file"
                                                                size="sm"
                                                                id="formFileSm"
                                                                name="panDocument"
                                                                floatingLabel="PAN Card Document: "
                                                                className="transparent-input"
                                                                value={values.panDocument}
                                                                onChange={fileHandleChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.panDocument && !!errors.panDocument}
                                                            />
                                                            <ErrorMessage
                                                                name="panDocument"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow> */}
                          <CRow>
                            <CCol className="text-start">
                              <div>
                                Credit Information:
                                <span style={{ color: 'red', fontSize: '20px' }}>*</span>
                              </div>
                            </CCol>
                          </CRow>
                          <CRow xs={{ gutter: '2' }}>
                            {/* <CCol md={4} className='dark-label'>
                                                        <CFormInput
                                                                type="text"
                                                                name="creditScore"
                                                                floatingLabel="What is your Credit Score (CIBIL)"
                                                                className="transparent-input"
                                                                value={values.creditScore}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.creditScore && !!errors.creditScore}
                                                            />
                                                            <ErrorMessage
                                                                name="creditScore"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol> */}
                            <CCol md={8} className="dark-label">
                              <CFormInput
                                type="text"
                                name="existingLoans"
                                floatingLabel="Please mention any outstanding loans or credit card loans you currently have"
                                className="transparent-input"
                                value={values.existingLoans}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.existingLoans && !!errors.existingLoans}
                              />
                              <ErrorMessage
                                name="existingLoans"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          <CRow>
                            <CCol className="text-start">
                              <div>
                                Property Details:
                                <span style={{ color: 'red', fontSize: '20px' }}>*</span>
                              </div>
                            </CCol>
                          </CRow>
                          <CRow xs={{ gutter: 2 }}>
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                name="areaOfLand"
                                floatingLabel="Area Of Land (sq.mtrs)"
                                className="transparent-input"
                                value={values.areaOfLand}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.areaOfLand && !!errors.areaOfLand}
                              />
                              <ErrorMessage
                                name="areaOfLand"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                name="builtArea"
                                floatingLabel="Built-Up Area (sq.mtrs)"
                                className="transparent-input"
                                value={values.builtArea}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.builtArea && !!errors.builtArea}
                              />
                              <ErrorMessage
                                name="builtArea"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                name="landCost"
                                floatingLabel="Cost of Land: Rs."
                                className="transparent-input"
                                value={values.landCost}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.landCost && !!errors.landCost}
                              />
                              <ErrorMessage
                                name="landCost"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                name="costOfExpense"
                                floatingLabel="Cost of Expenses: Rs."
                                className="transparent-input"
                                value={values.costOfExpense}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.costOfExpense && !!errors.costOfExpense}
                              />
                              <ErrorMessage
                                name="costOfExpense"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-2 mt-2">
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                id="floatingInput"
                                name="address"
                                className="transparent-input"
                                value={values.address}
                                floatingClassName="mb-2"
                                floatingLabel="Street address"
                                placeholder="Street address"
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.address && !!errors.address}
                              />
                              <ErrorMessage
                                name="address"
                                component="div"
                                className="errmsg text-danger"
                              ></ErrorMessage>
                            </CCol>
                          </CRow>
                          <CRow xs={{ gutter: 3 }}>
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                id="floatingInput"
                                name="city"
                                className="transparent-input"
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
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                id="floatingInput"
                                name="state"
                                className="transparent-input"
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
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                id="floatingInput"
                                name="country"
                                className="transparent-input"
                                value={values.country}
                                floatingClassName="mb-2"
                                floatingLabel="Country"
                                placeholder="Country"
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.country && !!errors.country}
                              />
                              <ErrorMessage
                                name="country"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                            <CCol className="dark-label">
                              <CFormInput
                                type="text"
                                name="pincode"
                                floatingLabel="Pincode"
                                className="transparent-input"
                                value={values.pincode}
                                onChange={handleInputChange}
                                onChangeCapture={handleChange}
                                onBlur={handleBlur}
                                invalid={touched.pincode && !!errors.pincode}
                              />
                              <ErrorMessage
                                name="pincode"
                                component="div"
                                className="text-danger"
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-2"></CRow>

                          <CRow>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
                              <CButton
                                id="cancel"
                                type="reset"
                                color="danger"
                                //onClick={handlePrevious}
                              >
                                Cancel
                              </CButton>
                              <CButton id="bttn" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <CSpinner /> : 'Next'}
                              </CButton>
                            </div>
                          </CRow>
                        </Form>
                      )}
                    </Formik>
                  </CCardBody>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </Container>
    </>
  )
}

export default HomeLoan
