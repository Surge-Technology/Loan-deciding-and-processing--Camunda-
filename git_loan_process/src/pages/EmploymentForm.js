/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { CRow, CCol, CButton, CForm, CFormLabel, CFormInput, CFormSelect } from '@coreui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../css/customerForm.css'
import { FaArrowLeft, FaTimes, FaUndo, FaUpload } from 'react-icons/fa' // Import the remove icon (X) from FontAwesome
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const EmploymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {};
  console.log('Received Form Data:', formData); 
  const [isCustomerDataAvailable, setIsCustomerDataAvailable] = useState(false);

  const formik = useFormik({
    initialValues: {
      companyName: '',
      contactPersonName: '',
      companyContactNumber: '',
      companyContactEmail: '',
      employmentType: '',
      grossSalary: '',
      annualIncome: '',
      designation: '',
      employmentPeriod: {
        employmentYears: 0,
        employmentMonths: 0,
      },
      // isCurrent: false,
      prevEmployments: [
        {
          prevCompanyName: '',
          prevContactPersonName: '',
          prevCompanyContactNumber: '',
          prevCompanyContactEmail: '',
          prevEmploymentType: '',
          prevGrossSalary: '',
          prevAnnualIncome: '',
          prevDesignation: '',
          prevEmploymentPeriod: {
            prevEmploymentYears: 0,
            prevEmploymentMonths: 0,
          },
        },
      ],
    },
    onSubmit: (values) => {
      const { formData } = location.state || {};
      // navigate('/bankDetail', { state: { employmentData: values } });
      navigate('/bankDetail', { 
        state: { 
          personalData: formData, 
          employmentData: values 
        } 
      });
      
      console.log('Form values:', JSON.stringify(values, null, 2));
    },
  })
  useEffect(() => {
    const fetchedEmploymentData = JSON.parse(sessionStorage.getItem('customerData'));
    setIsCustomerDataAvailable(!!fetchedEmploymentData);

    if (fetchedEmploymentData) {
      console.log('Fetched employment data:', fetchedEmploymentData);
      console.log('Fetched ------------------->:',  fetchedEmploymentData.employmentData.employmentPeriod);
      console.log("fetchedEmploymentData.prevEmployments",fetchedEmploymentData.employmentData.prevEmployments
      );
      const prevEmployments = fetchedEmploymentData.employmentData.prevEmployments 
      ? fetchedEmploymentData.employmentData.prevEmployments 
      : [{
          prevAnnualIncome: '',
          prevCompanyName: '',
          prevCompanyContactEmail: '',
          prevCompanyContactNumber: '',
          prevContactPersonName: '',
          prevDesignation: '',
          prevEmploymentPeriod: { prevEmploymentYears: '', prevEmploymentMonths: '' },
          prevEmploymentType: ''
      }];

      // Set the form values with fetched employment data
      formik.setValues({
        annualIncome: fetchedEmploymentData.employmentData.annualIncome || '',
        companyContactEmail: fetchedEmploymentData.employmentData.companyContactEmail || '',
        companyContactNumber: fetchedEmploymentData.employmentData.companyContactNumber || '',
        companyName: fetchedEmploymentData.employmentData.companyName || '',
        contactPersonName: fetchedEmploymentData.employmentData.contactPersonName || '',
        designation: fetchedEmploymentData.employmentData.designation || '',
        employmentPeriod: {
       employmentYears: fetchedEmploymentData.employmentData.employmentPeriod.employmentYears || '',
      employmentMonths: fetchedEmploymentData.employmentData.employmentPeriod.employmentMonths || '',
      
        },employmentType: fetchedEmploymentData.employmentData.employmentType || '',
        grossSalary: fetchedEmploymentData.employmentData.grossSalary || '',
        prevEmployments,
        // For previous employments
        // prevEmployments: fetchedEmploymentData.prevEmployments?.length > 0 
        // ? fetchedEmploymentData.prevEmployments 
        // : [{
        //     prevAnnualIncome: '',
        //     prevCompanyName: '',
        //     prevCompanyContactEmail: '',
        //     prevCompanyContactNumber: '',
        //     prevContactPersonName: '',
        //     prevDesignation: '',
        //     prevEmploymentPeriod: { prevEmploymentYears: '', prevEmploymentMonths: '' },
        //     prevEmploymentType: ''
        // }]
    });
    } else {
      console.log('No employment data found in localStorage');
      setIsCustomerDataAvailable(false);

    }
  }, []);
  
  // Handle adding a new previous employment
  const handleAddPreviousEmployment = () => {
    formik.setFieldValue('prevEmployments', [
      ...formik.values.prevEmployments,
      {
        prevCompanyName: '',
        prevContactPersonName: '',
        prevCompanyContactNumber: '',
        prevCompanyContactEmail: '',
        prevEmploymentType: '',
        prevGrossSalary: '',
        prevAnnualIncome: '',
        prevDesignation: '',
        prevEmploymentPeriod: {
          prevEmploymentYears: 0,
          prevEmploymentMonths: 0,
        },
      },
    ])
  }
  const sampleData = {
    companyName: 'Tech Solutions Inc.',
    contactPersonName: 'Abi johny',
    companyContactNumber: '9876238989',
    companyContactEmail: 'john.doe@techsolutions.com',
    employmentType: 'Full Time',
    grossSalary: '500000',
    annualIncome: '60000',
    designation: 'Software Engineer',
    employmentPeriod: {
      employmentYears: 2,
      employmentMonths: 6,
    },
    prevEmployments: [
      {
        prevCompanyName: 'Web Innovators',
        prevContactPersonName: 'Anish',
        prevCompanyContactNumber: '9876543210',
        prevCompanyContactEmail: 'anish.smith@webinnovators.com',
        prevEmploymentType: 'Part-Time',
        prevGrossSalary: '3000',
        prevAnnualIncome: '36000',
        prevDesignation: 'Frontend Developer',
        prevEmploymentPeriod: {
          prevEmploymentYears: 1,
          prevEmploymentMonths: 8,
        },
      },
    ],
  };
  const handleLoadData = () => {
    formik.setValues(sampleData);
  };

  const handleReset = () => {
    formik.resetForm();
  };
  // Handle removing a previous employment
  const handleRemovePreviousEmployment = (index) => {
    const newPrevEmployments = formik.values.prevEmployments.filter((_, i) => i !== index)
    formik.setFieldValue('prevEmployments', newPrevEmployments)
  }
  const handlePrevious = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex">
      <CButton
      color="success"
      onClick={handlePrevious}  // Navigate to the previous page
      title="Go Back"
    >
      <FaArrowLeft /> 
      </CButton></div>
      <h2 className="form-title mb-4 mx-auto text-center">Customer Employment Details</h2>
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
        <CForm onSubmit={formik.handleSubmit}>
          {/* Current Company Section */}
          <div className="form-sections">
            <h5 className="section-title">Current Company</h5>
            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel htmlFor="companyName">Company Name</CFormLabel>
                <CFormInput
                  id="companyName"
                  name="companyName"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="contactPersonName">Contact Person Name</CFormLabel>
                <CFormInput
                  id="contactPersonName"
                  name="contactPersonName"
                  value={formik.values.contactPersonName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="companyContactNumber">Company Contact Number</CFormLabel>
                <CFormInput
                  id="companyContactNumber"
                  name="companyContactNumber"
                  value={formik.values.companyContactNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </CCol>
            </CRow>
            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel htmlFor="companyContactEmail">Company Contact Email</CFormLabel>
                <CFormInput
                  id="companyContactEmail"
                  name="companyContactEmail"
                  value={formik.values.companyContactEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </CCol>
               <CCol md={4}>
              <CFormLabel htmlFor="employmentType">Employment Type *</CFormLabel>
              <CFormSelect
                id="employmentType"
                name="employmentType"
                value={formik.values.employmentType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-label="Employment Type"
              >
                <option value="" disabled>
                  Select Employment Type
                </option>
                <option value="Contract">Contract</option>
                <option value="Full_Time">Full Time</option>
                <option value="Part_Time">Part Time</option>
              </CFormSelect>
              
            </CCol>
             
              <CCol md={4}>
                <CFormLabel htmlFor="grossSalary">Gross Salary</CFormLabel>
                <CFormInput
                  id="grossSalary"
                  name="grossSalary"
                  value={formik.values.grossSalary}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </CCol>
            </CRow>
            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel htmlFor="annualIncome">Annual Income</CFormLabel>
                <CFormInput
                  id="annualIncome"
                  name="annualIncome"
                  value={formik.values.annualIncome}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="designation">Designation</CFormLabel>
                <CFormInput
                  id="designation"
                  name="designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </CCol>
              { /*   <CCol md={4}>
                <CFormLabel>Current Employment Status</CFormLabel>
                <div className="col-md-4">
                  <div className="d-flex">
                    {['Yes', 'No'].map((option) => (
                      <div className="form-check me-3" key={option}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="currentEmploymentStatus"
                          value={option}
                          checked={formik.values.currentEmploymentStatus === option}
                          onChange={formik.handleChange}
                        />
                        <label className="form-check-label">{option}</label>
                      </div>
                    ))}
                  </div>
                  {formik.touched.currentEmploymentStatus &&
                    formik.errors.currentEmploymentStatus && (
                      <div className="text-danger">{formik.errors.currentEmploymentStatus}</div>
                    )}
                </div>
              </CCol>*/}
            </CRow>
            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel htmlFor="employmentPeriod">Employment Period</CFormLabel>
                <CRow className="mb-4">
                  {/* Years Input */}
                  <CCol md={6}>
                    <CFormLabel htmlFor="employmentYears">Years</CFormLabel>
                    <CFormInput
                      id="employmentYears"
                      name="employmentPeriod.employmentYears" // Nested field
                      type="number"
                      value={formik.values.employmentPeriod.employmentYears}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.employmentPeriod?.employmentYears &&
                        !!formik.errors.employmentPeriod?.employmentYears
                      }
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="employmentMonths">Months</CFormLabel>
                    <CFormInput
                      id="employmentMonths"
                      name="employmentPeriod.employmentMonths" // Nested field
                      type="number"
                      value={formik.values.employmentPeriod.employmentMonths}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        formik.touched.employmentPeriod?.employmentMonths &&
                        !!formik.errors.employmentPeriod?.employmentMonths
                      }
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </div>

          {/* Previous Employment Section */}
          <div className="form-sections">
          {(formik.values.prevEmployments || []).map((employment, index) => (
            <div key={index} className="card p-4 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="section-title">Previous Employment {index + 1}</h5>
                <FaTimes
                  size={20}
                  color="red"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRemovePreviousEmployment(index)}
                />
              </div>
                <CRow className="mb-4">
                  <CCol md={4}>
                    <CFormLabel htmlFor={`prevCompanyName${index}`}>
                       Company Name
                    </CFormLabel>
                    <CFormInput
                      id={`prevCompanyName${index}`}
                      name={`prevEmployments[${index}].prevCompanyName`}
                      value={employment.prevCompanyName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor={`prevContactPersonName${index}`}>
                       Contact Person
                    </CFormLabel>
                    <CFormInput
                      id={`prevContactPersonName${index}`}
                      name={`prevEmployments[${index}].prevContactPersonName`}
                      value={employment.prevContactPersonName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor={`prevCompanyContactNumber${index}`}>
                       Contact Number
                    </CFormLabel>
                    <CFormInput
                      id={`prevCompanyContactNumber${index}`}
                      name={`prevEmployments[${index}].prevCompanyContactNumber`}
                      value={employment.prevCompanyContactNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </CCol>
                </CRow>

                {/* Additional Fields for Previous Employment */}
                <CRow className="mb-4">
                  <CCol md={4}>
                    <CFormLabel htmlFor={`prevCompanyContactEmail${index}`}>
                       Company Contact Email
                    </CFormLabel>
                    <CFormInput
                      id={`prevCompanyContactEmail${index}`}
                      name={`prevEmployments[${index}].prevCompanyContactEmail`}
                      value={employment.prevCompanyContactEmail}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </CCol>
                  <CCol md={4}>
                  <CFormLabel htmlFor={`prevEmploymentType${index}`}>
                  Employment Type </CFormLabel>
                  <CFormSelect
                  id={`prevEmploymentType${index}`}
                  name={`prevEmployments[${index}].prevEmploymentType`}
                  value={employment.prevEmploymentType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  >
                    <option value="" disabled>
                      Select Employment Type
                    </option>
                    <option value="Contract">Contract</option>
                    <option value="Full_Time">Full Time</option>
                    <option value="Part_Time">Part Time</option>
                  </CFormSelect>
                  
                </CCol>
                  
                  <CCol md={4}>
                    <CFormLabel htmlFor={`prevGrossSalary${index}`}>
                       Gross Salary
                    </CFormLabel>
                    <CFormInput
                      id={`prevGrossSalary${index}`}
                      name={`prevEmployments[${index}].prevGrossSalary`}
                      value={employment.prevGrossSalary}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-4">
                  <CCol md={4}>
                    <CFormLabel htmlFor={`prevAnnualIncome${index}`}>
                       Annual Income
                    </CFormLabel>
                    <CFormInput
                      id={`prevAnnualIncome${index}`}
                      name={`prevEmployments[${index}].prevAnnualIncome`}
                      value={employment.prevAnnualIncome}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor={`prevDesignation${index}`}>
                       Designation
                    </CFormLabel>
                    <CFormInput
                      id={`prevDesignation${index}`}
                      name={`prevEmployments[${index}].prevDesignation`}
                      value={employment.prevDesignation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </CCol>
                  <CCol md={4}>
                  <CFormLabel htmlFor={`prevEmploymentPeriod${index}`}>Previous Employment Period</CFormLabel>
                  <CRow className="mb-4">
                    {/* Years Input */}
                    <CCol md={6}>
                      <CFormLabel htmlFor={`prevEmploymentYears${index}`}>Years</CFormLabel>
                      <CFormInput
                        id={`prevEmploymentYears${index}`}
                        name={`prevEmployments[${index}].prevEmploymentPeriod.prevEmploymentYears`} // Nested field
                        type="number"
                        value={employment.prevEmploymentPeriod.prevEmploymentYears}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={
                          formik.touched.prevEmployments?.[index]?.prevEmploymentPeriod
                            ?.prevEmploymentYears &&
                          !!formik.errors.prevEmployments?.[index]?.prevEmploymentPeriod
                            ?.prevEmploymentYears
                        }
                      />
                     
                    </CCol>
                
                    {/* Months Input */}
                    <CCol md={6}>
                      <CFormLabel htmlFor={`prevEmploymentMonths${index}`}>Months</CFormLabel>
                      <CFormInput
                        id={`prevEmploymentMonths${index}`}
                        name={`prevEmployments[${index}].prevEmploymentPeriod.prevEmploymentMonths`} // Nested field
                        type="number"
                        value={employment.prevEmploymentPeriod.prevEmploymentMonths}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        // invalid={
                        //   formik.touched.prevEmployments?.[index]?.prevEmploymentPeriod
                        //     ?.prevEmploymentMonths &&
                        //   !!formik.errors.prevEmployments?.[index]?.prevEmploymentPeriod
                        //     ?.prevEmploymentMonths
                        // }
                      />
                      
                    </CCol>
                  </CRow>
                </CCol>
                
                </CRow>
              </div>
            ))}
            
            
          </div> <CRow>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                 
<CButton color="success" onClick={handleAddPreviousEmployment}>
              Add Previous Employment
            </CButton>
          <CButton color="primary" type="submit">
            Next
          </CButton>
          </div>
          </CRow>
        </CForm>
      </div>
    </div>
  )
}

export default EmploymentForm
