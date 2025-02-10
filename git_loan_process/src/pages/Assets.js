/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { FaUpload, FaUndo, FaArrowLeft } from 'react-icons/fa'
import { CButton, CFormLabel } from '@coreui/react'
import '../css/customerForm.css'
import '../css/Household.css'
import { Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

const Assets = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isCustomerDataAvailable, setIsCustomerDataAvailable] = useState(false)

  const { personalData, employmentData, bankDetails } = location.state || {}
  console.log('Received Personal Data:', personalData)
  console.log('Received Employment Data:', employmentData)
  console.log('Received bankDetails Data:', bankDetails)

  const formik = useFormik({
    initialValues: {
      // ...bankDetails,
      //cash
      savingDeposits: '',
      fund: '',
      shares: false,
      stocks: false,
      //otherAssest
      motorVehicle: false,
      superannuation: false,
      insurancePolicies: false,
      otherAssets: false,
      otherAssetsDetails: '',
      //property
      propertyType: '',
      occupancyType: '',
      propertyAddress: '',
    },
    onSubmit: (assets) => {
      // const fullData = { ...personalData, ...employmentData, ...bankDetails, assets:values };

      console.log('Assests....2:', assets)
      const fullData1 = { ...personalData, ...employmentData, bankDetails, assetsDetail: assets }
      console.log('fullData1....2:', fullData1)

      navigate('/houseHoldEarnings', {
        state: { personalData, employmentData, bankDetails, assetsDetail: assets },
      })
    },
  })
  useEffect(() => {
    const fetchedData = JSON.parse(sessionStorage.getItem('customerData'))

    if (fetchedData) {
      console.log('Fetched customer data:', fetchedData)
      setIsCustomerDataAvailable(!!fetchedData)

      // Set the form values with fetched data
      formik.setValues({
        savingDeposits: fetchedData.assetsDetail.savingDeposits || '',
        fund: fetchedData.assetsDetail.fund || '',
        shares: fetchedData.assetsDetail.shares || false,
        stocks: fetchedData.assetsDetail.stocks || false,
        motorVehicle: fetchedData.assetsDetail.motorVehicle || false,
        superannuation: fetchedData.assetsDetail.superannuation || false,
        insurancePolicies: fetchedData.assetsDetail.insurancePolicies || false,
        otherAssets: fetchedData.assetsDetail.otherAssets || false,
        otherAssetsDetails: fetchedData.assetsDetail.otherAssetsDetails || '',
        propertyType: fetchedData.assetsDetail.propertyType || '',
        occupancyType: fetchedData.assetsDetail.occupancyType || '',
        propertyAddress: fetchedData.assetsDetail.propertyAddress || '',
      })
    } else {
      console.log('No customer data found in localStorage')
    }
  }, [])
  const handleLoadData = () => {
    const jsonData = {
      cash: {
        savingDeposits: '50000',
        fund: '90000',
        shares: false,
        stocks: true,
      },
      otherAssets: {
        motorVehicle: true,
        superannuation: true,
        insurancePolicies: false,
        otherAssets: true,
        otherAssetsDetails: 'Gold bars worth $50,000',
      },
      properties: {
        propertyType: 'Residential',
        occupancyType: 'Owner Occupied',
        propertyAddress: '123 Main St, Cityville, ST 12345',
      },
    }

    formik.setValues({
      savingDeposits: jsonData.cash.savingDeposits,
      fund: jsonData.cash.fund,
      shares: jsonData.cash.shares,
      stocks: jsonData.cash.stocks,

      motorVehicle: jsonData.otherAssets.motorVehicle,
      superannuation: jsonData.otherAssets.superannuation,
      insurancePolicies: jsonData.otherAssets.insurancePolicies,
      otherAssets: jsonData.otherAssets.otherAssets,
      otherAssetsDetails: jsonData.otherAssets.otherAssetsDetails,

      propertyType: jsonData.properties.propertyType,
      occupancyType: jsonData.properties.occupancyType,
      propertyAddress: jsonData.properties.propertyAddress,
    })
  }

  const handleReset = () => {
    formik.resetForm();
  }
  const handlePrevious = () => {
    navigate(-1);
  }
  
  return (
    <div className="container mt-4">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <CButton
              color="success"
              onClick={handlePrevious} // Navigate to the previous page
              title="Go Back"
            >
              <FaArrowLeft />
            </CButton>
          </div>
          <h2 className="form-title mb-4 mx-auto text-center">Assets</h2>
          <div className="d-flex">
            {!isCustomerDataAvailable && (
              <>
                {/* Show Load Data button */}
                <CButton color="info" className="me-2" onClick={handleLoadData} title="Load Data">
                  <FaUpload />
                </CButton>

                {/* Show Reset Form button */}
                <CButton color="danger" onClick={handleReset} title="Reset Form">
                  <FaUndo />
                </CButton>
              </>
            )}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} id="myForm">
          <div className="form-section mt-4">
            <h5 className="section-title">Properties You Own</h5>

            <div className="row field-row mt-4 mt-5">
              {/* Property Type */}

              <div className="col-md-6">
                <label>Property Type</label>
                <div className="btn-group" role="group" aria-label="Property Type">
                  <input
                    type="radio"
                    className="btn-check"
                    id="residential"
                    name="propertyType"
                    value="Residential"
                    checked={formik.values.propertyType === 'Residential'}
                    onChange={formik.handleChange}
                  />
                  <label className="btn btn-outline-primary" htmlFor="residential">
                    Residential
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    id="commercial"
                    name="propertyType"
                    value="Commercial"
                    checked={formik.values.propertyType === 'Commercial'}
                    onChange={formik.handleChange}
                  />
                  <label className="btn btn-outline-primary" htmlFor="commercial">
                    Commercial
                  </label>
                </div>
              </div>

              {/* Occupancy Type */}

              <div className="col-md-6">
                <label>Occupancy Type</label>
                <div className="btn-group" role="group" aria-label="Occupancy Type">
                  <input
                    type="radio"
                    className="btn-check"
                    id="ownerOccupied"
                    name="occupancyType"
                    value="Owner Occupied"
                    checked={formik.values.occupancyType === 'Owner Occupied'}
                    onChange={(e) => {
                      formik.handleChange(e)
                      console.log(`Occupancy Type: ${e.target.value}`)
                    }}
                  />
                  <CFormLabel className="btn btn-outline-primary mr-2" htmlFor="ownerOccupied">
                    Owner Occupied
                  </CFormLabel>

                  <input
                    type="radio"
                    className="btn-check"
                    id="investment"
                    name="occupancyType"
                    value="Investment"
                    checked={formik.values.occupancyType === 'Investment'}
                    onChange={(e) => {
                      formik.handleChange(e)
                      console.log(`Occupancy Type: ${e.target.value}`)
                    }}
                  />
                  <CFormLabel className="btn btn-outline-primary" htmlFor="investment">
                    Investment
                  </CFormLabel>
                </div>
              </div>
            </div>
            <div className="row field-row">
              <div className="col-md-12">
                <label htmlFor="propertyAddress">Property Address</label>
                <textarea
                  className="form-control rectangle-textarea"
                  name="propertyAddress"
                  value={formik.values.propertyAddress}
                  onChange={formik.handleChange}
                ></textarea>
              </div>
            </div>
          </div>
          {/* Household Earnings Section */}
          <div className="form-section mt-4">
            <h5 className="section-title">Cash & Other liquid assets </h5>
            <div className="row mt-3"></div>

            <div className="row mt-3">
              {/* Include Savings Checkbox */}
              <div className="col-md-2 d-flex align-items-center">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="shares"
                    checked={formik.values.shares}
                    onChange={formik.handleChange}
                  />{' '}
                  Shares{' '}
                </label>
              </div>

              {/* Include Stocks Checkbox */}
              <div className="col-md-2 d-flex align-items-center">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="stocks"
                    checked={formik.values.stocks}
                    onChange={formik.handleChange}
                  />{' '}
                  Stocks
                </label>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <label htmlFor="savingDeposits" className="form-label">
                  Savings / Term Deposits
                </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.savingDeposits && formik.errors.savingDeposits ? 'is-invalid' : ''}`}
                  id="savingDeposits"
                  name="savingDeposits"
                  value={formik.values.savingDeposits}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  min={0}
                  step={0}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="fund" className="form-label">
                  Fund{' '}
                </label>
                <input
                  type="number"
                  className={`form-control ${formik.touched.fund && formik.errors.fund ? 'is-invalid' : ''}`}
                  id="fund"
                  name="fund"
                  value={formik.values.fund}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  min={0}
                  step={0}
                />
              </div>
            </div>
          </div>
          <div className="form-section mt-4">
            <h5 className="section-title">Select Your Assets</h5>
            <div className="input-box">
              <div className="row mt-3">
                {/* Motor Vehicle */}
                <div className="col-md-2">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="motorVehicle"
                      name="motorVehicle"
                      checked={formik.values.motorVehicle}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="motorVehicle" className="form-check-label">
                      Motor Vehicles
                    </label>
                  </div>
                </div>

                {/* Superannuation */}
                <div className="col-md-2">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="superannuation"
                      name="superannuation"
                      checked={formik.values.superannuation}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="superannuation" className="form-check-label">
                      Superannuation
                    </label>
                  </div>
                </div>

                {/* Insurance Policies */}
                <div className="col-md-2">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="insurancePolicies"
                      name="insurancePolicies"
                      checked={formik.values.insurancePolicies}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="insurancePolicies" className="form-check-label">
                      Insurance Policies
                    </label>
                  </div>
                </div>

                {/* Other Assets */}
                <div className="col-md-2">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="otherAssets"
                      name="otherAssets"
                      checked={formik.values.otherAssets}
                      onChange={formik.handleChange}
                    />
                    <label htmlFor="otherAssets" className="form-check-label">
                      Other Assets (if any)
                    </label>
                  </div>
                </div>
              </div>

              {/* Other Assets Details Textbox */}
              {formik.values.otherAssets && (
                <div className="row mt-3">
                  <div className="col-md-12">
                    <label htmlFor="otherAssetsDetails" className="form-label">
                      Please specify other assets:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="otherAssetsDetails"
                      name="otherAssetsDetails"
                      value={formik.values.otherAssetsDetails}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.otherAssetsDetails && formik.errors.otherAssetsDetails && (
                      <div className="invalid-feedback">{formik.errors.otherAssetsDetails}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div className="d-flex justify-content-end mt-4">
            <Button variant="contained" color="primary" type="submit">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Assets
