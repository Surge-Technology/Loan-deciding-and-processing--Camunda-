/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { CButton, CFormLabel, CRow } from '@coreui/react';
import { FaUpload, FaUndo, FaArrowLeft } from 'react-icons/fa';
import { Button } from '@mui/material';
import '../css/customerForm.css'
import '../css/Household.css'
import ReactInputNumber from 'react-input-number';
import { useLocation, useNavigate } from 'react-router-dom';

const HouseHoldEarnings = () => {
    const location = useLocation();
    const navigate=useNavigate();
    const [isCustomerDataAvailable, setIsCustomerDataAvailable] = useState(false);

    // Extract the data passed in the state of the location object
    const { personalData, employmentData, bankDetails,assetsDetail } = location.state || {};

    // Log the data to confirm you're receiving it correctly
    console.log('Full Data from Assets:', personalData);
    console.log('Received Employment Data:', employmentData);
    console.log('Received Bank Details:', bankDetails);
    console.log('Received assets Detail :', assetsDetail);

  
  const formik = useFormik({
    initialValues: {
      
      annualIncome: '',
      grossRentals: '',
      interestPaid: '',
      dividends: '',
      otherIncome: '',
      
      // Household Spending
      rentalPaid: '',
      groceriesExpense: '',
      medicalExpense: '',
      clothingExpense: '',
      recreationExpense: '',
      personalInsurance: '',
      communicationsExpense: '',
      transportationExpense: '',
      educationExpense: '',
      childcareExpense: '',

      
    },
    onSubmit: (housedata) => {
       
        navigate('/liabilities',{ state: { personalData, employmentData , bankDetails,assetsDetail,houseHold:housedata } })
      
      console.log("house hold",housedata);
     
    },
  });

  const handleLoadData = () => {
    const jsonData = {
      houseHoldEarnings: {
        annualIncome: '6000000',
        grossRentals: '200000',
        interestPaid: '40000',
        dividends: '4',
        otherIncome: 'no',
      },
      houseHoldSpending: {
        rentalPaid: '10000',
        groceriesExpense: '500',
        medicalExpense: '200',
        clothingExpense: '300',
        recreationExpense: '150',
        personalInsurance: '100',
        communicationsExpense: '50',
        transportationExpense: '200',
        educationExpense: '400',
        childcareExpense: '250',
      }
    //   properties: {
    //     propertyType: 'Residential',
    //     occupancyType: 'Owner Occupied',
    //     propertyAddress: '123 Main St, Cityville, ST 12345',
    //   },
    };

    formik.setValues({
      ...formik.values,
      // Household Earnings
      annualIncome: jsonData.houseHoldEarnings.annualIncome,
      grossRentals: jsonData.houseHoldEarnings.grossRentals,
      interestPaid: jsonData.houseHoldEarnings.interestPaid,
      dividends: jsonData.houseHoldEarnings.dividends,
      otherIncome: jsonData.houseHoldEarnings.otherIncome,

      // Household Spending
      rentalPaid: jsonData.houseHoldSpending.rentalPaid,
      groceriesExpense: jsonData.houseHoldSpending.groceriesExpense,
      medicalExpense: jsonData.houseHoldSpending.medicalExpense,
      clothingExpense: jsonData.houseHoldSpending.clothingExpense,
      recreationExpense: jsonData.houseHoldSpending.recreationExpense,
      personalInsurance: jsonData.houseHoldSpending.personalInsurance,
      communicationsExpense: jsonData.houseHoldSpending.communicationsExpense,
      transportationExpense: jsonData.houseHoldSpending.transportationExpense,
      educationExpense: jsonData.houseHoldSpending.educationExpense,
      childcareExpense: jsonData.houseHoldSpending.childcareExpense,

      // Properties
      });
  };

  const handleReset = () => {
    formik.resetForm();
  };
 useEffect(() => {
    // Fetching data from localStorage if available
    const fetchedData = JSON.parse(sessionStorage.getItem('customerData'));
    setIsCustomerDataAvailable(!!fetchedData);

    if (fetchedData) {
      console.log('Fetched customer data:', fetchedData);

      // Set the form values with fetched data
      formik.setValues({
        annualIncome: fetchedData.houseHold.annualIncome || '',
        childcareExpense: fetchedData.houseHold.childcareExpense || '',
        clothingExpense: fetchedData.houseHold.clothingExpense || '',
        communicationsExpense: fetchedData.houseHold.communicationsExpense || '',
        dividends: fetchedData.houseHold.dividends || '',
        educationExpense: fetchedData.houseHold.educationExpense || '',
        groceriesExpense: fetchedData.houseHold.groceriesExpense || '',
        grossRentals: fetchedData.houseHold.grossRentals || '',
        interestPaid: fetchedData.houseHold.interestPaid || '',
        medicalExpense: fetchedData.houseHold.medicalExpense || '',
        otherIncome: fetchedData.houseHold.otherIncome || '',
        personalInsurance: fetchedData.houseHold.personalInsurance || '',
        recreationExpense: fetchedData.houseHold.recreationExpense || '',
        rentalPaid: fetchedData.houseHold.rentalPaid || '',
        transportationExpense: fetchedData.houseHold.transportationExpense || '',
      });
    } else {
      console.log('No customer data found in localStorage');

    }

    // You can add any other logic you need to execute on mount or dependency changes here
  }, []);
  const handlePrevious = () => {
    navigate(-1);
  };
  return (
    <div className="container mt-4">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
      <CButton
      color="success"
      onClick={handlePrevious}  
      title="Go Back"
    >
      <FaArrowLeft /> 
      </CButton></div>
          <h2 className="form-title mb-4 mx-auto text-center">Household </h2>
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

        <form onSubmit={formik.handleSubmit} id="myForm">
     
            {/* Household Earnings Section */}
            <div className="form-section mt-4">
              <h5 className="section-title">Household Earnings (Year-wise)</h5>
              <div className="row mt-3">
                {/* Gross Salary */}
                <div className="col-md-6">
                  <label htmlFor="annualIncome" className="form-label">
                    Gross Salary (includes basic, bonus, incentives, etc.) 
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formik.touched.annualIncome && formik.errors.annualIncome ? 'is-invalid' : ''}`}
                    id="annualIncome"
                    name="annualIncome"
                    min={0}
                    step={0}
                    value={formik.values.annualIncome}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  
                </div>

                {/* Gross Rentals */}
                <div className="col-md-6">
                  <label htmlFor="grossRentals" className="form-label">Gross Rentals </label>
                  <input
                    type="number"
                    className={`form-control ${formik.touched.grossRentals && formik.errors.grossRentals ? 'is-invalid' : ''}`}
                    id="grossRentals"
                    name="grossRentals"
                    min={0}
                    step={0}
                    value={formik.values.grossRentals}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                 
                </div>
              </div>

              {/* Interest Paid */}
              <div className="row mt-3">
                <div className="col-md-6">
                  <label htmlFor="interestPaid" className="form-label">Interest Paid </label>
                  <input
                    type="number"
                    className={`form-control ${formik.touched.interestPaid && formik.errors.interestPaid ? 'is-invalid' : ''}`}
                    id="interestPaid"
                    name="interestPaid"
                    min={0}
                    step={0}
                    value={formik.values.interestPaid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  
                </div>

                {/* Dividends */}
                <div className="col-md-6">
                  <label htmlFor="dividends" className="form-label">Dividends </label>
                  <input
                    type="number"
                    className={`form-control ${formik.touched.dividends && formik.errors.dividends ? 'is-invalid' : ''}`}
                    id="dividends"
                    name="dividends"
                    min={0}
                    step={0}
                    value={formik.values.dividends}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  
                </div>
              </div>

              {/* Other Income */}
              <div className="row mt-3">
                <div className="col-md-6">
                  <label htmlFor="otherIncome" className="form-label">Other Income </label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.otherIncome && formik.errors.otherIncome ? 'is-invalid' : ''}`}
                    id="otherIncome"
                    name="otherIncome"
                    min={0}
                    step={0}
                    value={formik.values.otherIncome}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                 
                </div>
               
              </div>
            </div>
            <div className="form-section mt-4">
              <h5 className="section-title">Household Spending</h5>
              <div className="input-box">
              <div className="row field-row">
              {/* Rent */}
              <div className="col-lg-4 px-14">
                <label htmlFor="rentalPaid" className="form-label">Rent </label>
                <input
                  type="number"
                 className={`form-control ${formik.touched.rentalPaid && formik.errors.rentalPaid ? 'is-invalid' : ''}`}
                  id="rentalPaid"
                  name="rentalPaid"
                  min={0}
                  step={0}
                  value={formik.values.rentalPaid}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </div>
      
              {/* Groceries */}
              <div className="col-lg-4 px-14">
                <label htmlFor="groceriesExpense" className="form-label">Groceries </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.groceriesExpense && formik.errors.groceriesExpense ? 'is-invalid' : ''}`}
                  id="groceriesExpense"
                  name="groceriesExpense"
                  min={0}
                  step={0}
                  value={formik.values.groceriesExpense}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </div>
              <div className="col-lg-4 px-14">
                <label htmlFor="medicalExpense" className="form-label">Medical Expense </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.medicalExpense && formik.errors.medicalExpense ? 'is-invalid' : ''}`}
                  id="medicalExpense"
                  name="medicalExpense"
                  min={0}
                  step={0}
                  value={formik.values.medicalExpense}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </div>
            </div>
      
            <div className="row mt-3">
              
      
              {/* Clothing */}
              <div className="col-lg-4 px-14">
                <label htmlFor="clothingExpense" className="form-label">Clothing </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.clothingExpense && formik.errors.clothingExpense ? 'is-invalid' : ''}`}
                  id="clothingExpense"
                  name="clothingExpense"
                  min={0}
                  step={0}
                  value={formik.values.clothingExpense}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                
              </div>
              <div className="col-lg-4 px-14">
              <label htmlFor="recreationExpense" className="form-label">Recreation & Entertainment </label>
              <input
                type="number"
                className={`form-control ${formik.touched.recreationExpense && formik.errors.recreationExpense ? 'is-invalid' : ''}`}
                id="recreationExpense"
                name="recreationExpense"
                min={0}
                step={0}
                value={formik.values.recreationExpense}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              
            </div>
          
      
           
              <div className="col-lg-4 px-14">
                <label htmlFor="personalInsurance" className="form-label">Personal Insurance </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.personalInsurance && formik.errors.personalInsurance ? 'is-invalid' : ''}`}
                  id="personalInsurance"
                  name="personalInsurance"
                  min={0}
                  step={0}
                  value={formik.values.personalInsurance}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </div>
              </div>
      
            <div className="row mt-3">
              {/* Communications */}
              <div className="col-lg-4 px-14">
                <label htmlFor="communicationsExpense" className="form-label">Communications </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.communicationsExpense && formik.errors.communicationsExpense ? 'is-invalid' : ''}`}
                  id="communicationsExpense"
                  name="communicationsExpense"
                  min={0}
                  step={0}
                  value={formik.values.communicationsExpense}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                
              </div>
      
              {/* Transportation */}
              <div className="col-lg-4 px-14">
                <label htmlFor="transportationExpense" className="form-label">Transportation </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.transportationExpense && formik.errors.transportationExpense ? 'is-invalid' : ''}`}
                  id="transportationExpense"
                  name="transportationExpense"
                  min={0}
                  step={0}
                  value={formik.values.transportationExpense}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </div>
              <div className="col-lg-4 px-14">
                <label htmlFor="educationExpense" className="form-label">Education </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.educationExpense && formik.errors.educationExpense ? 'is-invalid' : ''}`}
                  id="educationExpense"
                  name="educationExpense"
                  min={0}
                  step={10}
                  value={formik.values.educationExpense}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
               
              </div>
            </div>
      
            <div className="row mt-3">
              
      
              {/* Childcare */}
              <div className="col-lg-4 px-14">
                <label htmlFor="childcareExpense" className="form-label">Childcare </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.childcareExpense && formik.errors.childcareExpense ? 'is-invalid' : ''}`}
                  id="childcareExpense"
                  name="childcareExpense"
                 
                  value={formik.values.childcareExpense}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                
              </div>
            </div>
          </div>
           
          </div>
        
<div className="d-flex justify-content-end mt-4">
<Button variant="contained" color="primary" type="submit">
  Next
</Button>
</div>
        </form>
      </div>
    </div>
  );
};

export default HouseHoldEarnings;
