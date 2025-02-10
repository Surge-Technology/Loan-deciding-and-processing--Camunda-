/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardTitle,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react';
import { Formik, Form } from 'formik';
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';

const CheckCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const URL = import.meta.env.VITE_BASE_URL;

  const initialValues = {
    hasAccount: '', 
    email: '', 
  };

  const handleSubmit = async (values) => {
    if (values.hasAccount === 'No') {
      sessionStorage.clear();

      navigate('/customerForm');
    } else if (values.hasAccount === 'Yes') {
      if (!values.email) {
        Swal.fire('Error', 'Please enter your email address!', 'error');
        return;
      }
console.log("values...........",values.email);

      try {
        setLoading(true); 
        // const response = await axios.get('http://localhost:8080/getJsonDataByEmail',{
        //   email: values.email,
        // });

        const response = await axios.get(`${URL}/getJsonDataByEmail`, {
          params: { emailId: values.email },
        });
  

        if (response) {
          console.log("Response Data----->", response.data);

      sessionStorage.setItem("customerData", JSON.stringify(response.data));
      
          navigate('/customerForm');
        } else {
          Swal.fire('Error', 'Invalid Data!', 'error');
        }
      } catch (error) {
        console.error('API Error:', error);
        Swal.fire('', 'Invalid Data.', 'error');
      } finally {
        setLoading(false);  
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ToastContainer />
      <CContainer className="d-flex justify-content-center align-items-center mb-4 mt-4">
        <CRow>
          <CCol>
            <CCard className="mb-3 d-flex justify-content-center align-items-center" style={{ maxWidth: '980px' }}>
              <CRow className="g-0">
                <CCol md={6}>
                  <CCardImage src="src/assets/images/applyloan.jpg" style={{ height: '100%' }} />
                </CCol>
                <CCol md={6}>
                  <CCardBody>
                    <CCardTitle>
                      <h4 className="text-center mt-4">
                        <strong>Apply For Loan</strong>
                      </h4>
                    </CCardTitle>
                    <Formik
                      initialValues={initialValues}
                      onSubmit={handleSubmit}
                    >
                      {(formik) => (
                        <Form onSubmit={formik.handleSubmit} className="d-flex flex-column align-items-center text-center">
                          <div className="mt-4">
                            <label className="form-label">Do you have an account with the bank? *</label>
                            <div className="d-flex justify-content-center">
                              {['Yes', 'No'].map((option) => (
                                <div className="form-check me-3" key={option}>
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hasAccount"
                                    value={option}
                                    checked={formik.values.hasAccount === option}
                                    onChange={formik.handleChange}
                                  />
                                  <label className="form-check-label">{option}</label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Conditionally show the email field if "Yes" is selected */}
                          {formik.values.hasAccount === 'Yes' && (
                            <div className="col-md-6 mt-3">
                              <label className="form-label">Email *</label>
                              <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.email && formik.errors.email && (
                                <div className="text-danger">{formik.errors.email}</div>
                              )}
                            </div>
                          )}

                          {/* Submit Button */}
                          <div className="mt-4">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            // disabled={isDataFetched} // Disable button if data is fetched
                          >
Next
                          </button>
                        </div>
                        </Form>
                      )}
                    </Formik>
                  </CCardBody>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default CheckCustomer;
