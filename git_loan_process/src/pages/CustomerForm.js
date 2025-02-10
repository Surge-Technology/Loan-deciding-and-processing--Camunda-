/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../css/customerForm.css'
import { CButton, CRow, CSpinner } from '@coreui/react'
import { Button, CircularProgress } from '@mui/material'
import { FaArrowLeft, FaUpload } from 'react-icons/fa6'
import { FaUndo } from 'react-icons/fa'
import { useNavigate,useLocation } from 'react-router-dom'
const CustomerForm = () => {
  const location = useLocation();
  const [isCustomerDataAvailable, setIsCustomerDataAvailable] = useState(false);

    const navigate=useNavigate();
    // const customerData = location.state?.customerData; 
    // console.log("customer Data Check  ----->",JSON.stringify(customerData, null, 2));
    
  const validationSchema = Yup.object().shape(
    {
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    // legalFullName: Yup.string().required('Legal Full Name is required'),
    birthDate: Yup.date()
      .required('Date of Birth is required')
      .max(new Date(), 'Date of Birth cannot be in the future'),
    maritalStatus: Yup.string().required('Marital Status is required'),
    // spouseName: Yup.string().when('maritalStatus', {
    //   is: 'Married',
    //   then: Yup.string().required('Spouse Name is required when married'),
    // }),
    // gender: Yup.string().required('Gender is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    // phone: Yup.string()
    //   .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    //   .required('Phone number is required'),
    // streetAddress: Yup.string().required('Street Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required'),
    // howLongAtAddress: Yup.number()
    //   .min(1, 'At least 1 year')
    //   .required('How long at address is required'),
  })
  const [customerData, setCustomerData] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0)
}, [])
  useEffect(() => {
    const fetchedData = JSON.parse(sessionStorage.getItem('customerData'));
    setIsCustomerDataAvailable(!!fetchedData);

    if (fetchedData) {
      console.log('Fetched customer data:', fetchedData);
      
      // Set the form values with fetched data
      formik.setValues({
        firstName: fetchedData.personalData.personalInfo.firstName || '',
        lastName: fetchedData.personalData.personalInfo.lastName || '',
        legalFullName: fetchedData.personalData.personalInfo.legalFullName || '',
        birthDate: fetchedData.personalData.personalInfo.dob || '',
        maritalStatus: fetchedData.personalData.personalInfo.maritalStatus || '',
        spouseName: fetchedData.personalData.personalInfo.spouseName || '',
        gender: fetchedData.personalData.personalInfo.gender || '',
        email: fetchedData.personalData.contactInfo.email || '',
        phone: fetchedData.personalData.contactInfo.phone || '',
        streetAddress: fetchedData.personalData.addressInfo.streetLine1 || '',
        streetAddress2: fetchedData.personalData.addressInfo.streetLine2 || '',
        city: fetchedData.personalData.addressInfo.city || '',
        state: fetchedData.personalData.addressInfo.state || '',
        zipCode: fetchedData.personalData.addressInfo.zip || '',
        howLongAtAddress: fetchedData.personalData.addressInfo.yearsAtAddress || '',
      });
    } else {
      console.log('No customer data found in localStorage');
      setIsCustomerDataAvailable(false);

    }
    
  }, []);
  
  const formik = useFormik({
    initialValues: {
      firstName:'',
      lastName: '',
      legalFullName: '',
      birthDate: '',
      maritalStatus: '',
      spouseName:'',
      gender: '',
      email: '',
      phone: '',
      streetAddress: '',
      streetAddress2: '',
      city: '',
      state: '',
      zipCode: '',
      howLongAtAddress: '',
    },
    validationSchema,
    onSubmit: (values) => {

        const formData = {
            personalInfo: {
              firstName: values.firstName,
              lastName: values.lastName,
              legalFullName:values.legalFullName,
              gender: values.gender,
              maritalStatus:values.maritalStatus,
              spouseName:values.spouseName,

            //   dob: String(moment(values.birthDate).format('MM-DD-YYYY')),

              dob: values.birthDate,
            },
            contactInfo: {
              email: values.email,
              phone: values.phone,
            },
            addressInfo: {
              streetLine1: values.streetAddress,
              streetLine2: values.streetAddress2,
              city: values.city,
              state: values.state,
              zip: values.zipCode,
              yearsAtAddress: values.howLongAtAddress,
            }
          };
      console.log('Submitted Data:', formData)
    //   navigate('/employmentForm')
    navigate('/employmentForm', { state: {  formData } });

     // alert('Form submitted successfully!')
    },
  })
  const handlePrevious = () => {
    navigate(-1);
  };
  const handleLoadData = () => {
    const jsonData = {
      personalInfo: {
        firstName: 'Abi',
        lastName: 'Johny',
        legalFullName: 'Abi Johny',
        gender: 'Male',
        maritalStatus: 'Single',
        spouseName: '',
        birthDate: '1990-10-09',
      },
      contactInfo: {
        email: 'camerongre1@gmail.com',
        phone: '9876235671',
      },
      addressInfo: {
        streetLine1: '123 Main St',
        streetLine2: 'Apt 4B',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zip: '630017',
        yearsAtAddress: '3',
      },
    };

    formik.setValues({
      ...formik.values,
      firstName: jsonData.personalInfo.firstName,
      lastName: jsonData.personalInfo.lastName,
      legalFullName: jsonData.personalInfo.legalFullName,
      gender: jsonData.personalInfo.gender,
      maritalStatus: jsonData.personalInfo.maritalStatus,
      spouseName: jsonData.personalInfo.spouseName,
      birthDate: jsonData.personalInfo.birthDate,
      email: jsonData.contactInfo.email,
      phone: jsonData.contactInfo.phone,
      streetAddress: jsonData.addressInfo.streetLine1,
      streetAddress2: jsonData.addressInfo.streetLine2,
      city: jsonData.addressInfo.city,
      state: jsonData.addressInfo.state,
      zipCode: jsonData.addressInfo.zip,
      howLongAtAddress: jsonData.addressInfo.yearsAtAddress,
    });
  };
  const handleReset = () => {
    formik.resetForm();
  };
  
  return (
    <div className="container mt-4">
      <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex">
      <CButton
      color="success"
      onClick={handlePrevious}  // Navigate to the previous page
      title="Go Back"
    >
      <FaArrowLeft /> 
      </CButton></div>
        <h2 className="form-title mb-4 mx-auto text-center">Loan Applicantion Form</h2>
        <div className="d-flex">
        {!isCustomerDataAvailable && (
          <>
            {/* Show Load Data button */}
            <CButton
              color="info"
              className="me-2"
              onClick={handleLoadData}
              title="Load Data"
            >
              <FaUpload /> 
            </CButton>
      
            {/* Show Reset Form button */}
            <CButton
              color="danger"
              onClick={handleReset}
              title="Reset Form"
            >
              <FaUndo />
            </CButton>
          </>
        )}
      </div>
      
      </div>
    
    
        <form onSubmit={formik.handleSubmit} id='myForm'>
          <div className="form-section">
            <h5 className="section-title">Personal Information</h5>
            <div className="row mt-3">
              {/* First Name */}
              <div className="col-md-4">
                <label htmlFor="firstName" className="form-label">
                  First Name *
                </label>
                <input
                  type="text"
                  className={`form-control ${formik.touched.firstName && formik.errors.firstName ? 'is-invalid' : ''}`}
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="invalid-feedback">{formik.errors.firstName}</div>
                )}
              </div>

              {/* Last Name */}
              <div className="col-md-4">
                <label htmlFor="lastName" className="form-label">
                  Last Name *
                </label>
                <input
                  type="text"
                  className={`form-control ${formik.touched.lastName && formik.errors.lastName ? 'is-invalid' : ''}`}
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="invalid-feedback">{formik.errors.lastName}</div>
                )}
              </div>

              {/* Legal Full Name */}
              <div className="col-md-4">
                <label htmlFor="legalFullName" className="form-label">
                  Legal Full Name *
                </label>
                <input
                  type="text"
                  className={`form-control ${formik.touched.legalFullName && formik.errors.legalFullName ? 'is-invalid' : ''}`}
                  id="legalFullName"
                  name="legalFullName"
                  value={formik.values.legalFullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.legalFullName && formik.errors.legalFullName && (
                  <div className="invalid-feedback">{formik.errors.legalFullName}</div>
                )}
              </div>
            </div>

            <div className="row mt-3">
              {/* Gender */}
              <div className="col-md-4">
                <label className="form-label">Gender *</label>
                <div className="d-flex">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <div className="form-check me-3" key={gender}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formik.values.gender === gender}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label">{gender}</label>
                    </div>
                  ))}
                </div>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-danger">{formik.errors.gender}</div>
                )}
              </div>
              {/* Date of Birth */}
              <div className="col-md-4">
                <label htmlFor="birthDate" className="form-label">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  className={`form-control ${formik.touched.birthDate && formik.errors.birthDate ? 'is-invalid' : ''}`}
                  id="birthDate"
                  name="birthDate"
                  value={formik.values.birthDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <div className="invalid-feedback">{formik.errors.birthDate}</div>
                )}
              </div>

              {/* Marital Status */}
              <div className="col-md-4">
                <label className="form-label">Marital Status *</label>
                <div className="d-flex">
                  {['Single', 'Married', 'Divorced'].map((status) => (
                    <div className="form-check me-3" key={status}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="maritalStatus"
                        value={status}
                        checked={formik.values.maritalStatus === status}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label">{status}</label>
                    </div>
                  ))}
                </div>
                {formik.touched.maritalStatus && formik.errors.maritalStatus && (
                  <div className="text-danger">{formik.errors.maritalStatus}</div>
                )}
              </div>
            </div>

            {/* Spouse Name (Conditional) */}
            {formik.values.maritalStatus === 'Married' && (
              <div className="row mt-3">
                <div className="col-md-4">
                  <label htmlFor="spouseName" className="form-label">
                    Spouse Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.spouseName && formik.errors.spouseName ? 'is-invalid' : ''}`}
                    id="spouseName"
                    name="spouseName"
                    value={formik.values.spouseName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.spouseName && formik.errors.spouseName && (
                    <div className="invalid-feedback">{formik.errors.spouseName}</div>
                  )}
                </div>
              </div>
            )}

            {/* Email and Phone */}
            <div className="form-section mt-4">
              <h5 className="section-title">Contact Information</h5>
              <div className="row mt-3">
                {/* Email */}
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label">
                    Phone *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="invalid-feedback">{formik.errors.phone}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="form-section mt-4">
              <h5 className="section-title">Address</h5>
              <div className="row mt-3">
                {/* Street Address Line 1 */}
                <div className="col-md-6">
                  <label htmlFor="streetAddress" className="form-label">
                    Street Address Line 1 *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.streetAddress && formik.errors.streetAddress ? 'is-invalid' : ''}`}
                    id="streetAddress"
                    name="streetAddress"
                    value={formik.values.streetAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.streetAddress && formik.errors.streetAddress && (
                    <div className="invalid-feedback">{formik.errors.streetAddress}</div>
                  )}
                </div>

                {/* Street Address Line 2 */}
                <div className="col-md-6">
                  <label htmlFor="streetAddress2" className="form-label">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.streetAddress2 && formik.errors.streetAddress2 ? 'is-invalid' : ''}`}
                    id="streetAddress2"
                    name="streetAddress2"
                    value={formik.values.streetAddress2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <div className="row mt-3">
                {/* City */}
                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">
                    City *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.city && formik.errors.city ? 'is-invalid' : ''}`}
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <div className="invalid-feedback">{formik.errors.city}</div>
                  )}
                </div>

                {/* State */}
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">
                    State *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.state && formik.errors.state ? 'is-invalid' : ''}`}
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <div className="invalid-feedback">{formik.errors.state}</div>
                  )}
                </div>
                {/* Zip Code */}
                <div className="col-md-4">
                  <label htmlFor="zipCode" className="form-label">
                    Zip / Postal Code *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.zipCode && formik.errors.zipCode ? 'is-invalid' : ''}`}
                    id="zipCode"
                    name="zipCode"
                    value={formik.values.zipCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <div className="invalid-feedback">{formik.errors.zipCode}</div>
                  )}
                </div>
              </div>

              <div className="row mt-3">
                {/* How long at address */}
                <div className="col-md-6">
                  <label htmlFor="howLongAtAddress" className="form-label">
                    How long have you lived at the above address? (Years) *
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formik.touched.howLongAtAddress && formik.errors.howLongAtAddress ? 'is-invalid' : ''}`}
                    id="howLongAtAddress"
                    name="howLongAtAddress"
                    value={formik.values.howLongAtAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min="1"
                  />
                  {formik.touched.howLongAtAddress && formik.errors.howLongAtAddress && (
                    <div className="invalid-feedback">{formik.errors.howLongAtAddress}</div>
                  )}
                </div>
              </div>
            </div>
            <CRow>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            {/* Cancel Button */}
            <Button
              variant="contained" // Solid style
              color="error"
              type="button"
              onClick={() => formik.resetForm()} // Resets form to initial values
            >
              Cancel
            </Button>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={formik.isSubmitting} // Disables the button while submitting
            >
            Next
            {/*  {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Next'}*/}
            </Button>
          </div>
          </CRow>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerForm
