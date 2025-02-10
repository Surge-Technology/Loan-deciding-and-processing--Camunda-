/* eslint-disable prettier/prettier */
import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import 'bootstrap/dist/css/bootstrap.min.css'
import './CustomerDetailsForm.css' // Custom CSS for additional styling
import { useState } from 'react'
import { FaMinusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
const CustomerDetailsForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    legalFullName: '',
    birthDate: '',
    // nationality: '',
    // nationalityId: '',
    // nationalityType: '',
    gender: '',
    maritalStatus: '',
    spouseName: '',
    phone: '',
    email: '',
    // state: '',
    // city: '',
    // postalCode: '',
    // yearsAtAddress:'',
    employeeStatus: '',
    currentAddress: '',
    prevAddress: '',
    currentAddress: {
        address: '',
        city: '',
        state: '',
        postalCode: '',
        yearsAtAddress: '',
      },
      previousAddresses: [],
    
     
    // jobTitle: '',
    // annualIncome: ''
  })
  const navigate=useNavigate();
  const handleInputChange = (e, section = 'currentAddress', index = null) => {
    const { name, value } = e.target;
    if (section === 'currentAddress') {
      setFormData({
        ...formData,
        currentAddress: {
          ...formData.currentAddress,
          [name]: value,
        },
      });
    } else if (section === 'previousAddress') {
      const updatedPreviousAddresses = [...formData.previousAddresses];
      updatedPreviousAddresses[index] = {
        ...updatedPreviousAddresses[index],
        [name]: value,
      };
      setFormData({
        ...formData,
        previousAddresses: updatedPreviousAddresses,
      });
    }
  };

  // Add new previous address
  const addPreviousAddress = () => {
    
    setFormData({
      ...formData,
      previousAddresses: [
        ...formData.previousAddresses,
        { address: '', city: '', state: '', postalCode: '' , yearsAtAddress: ''},
      ],
    });
  };

  // Remove previous address section
  const removePreviousAddress = (index) => {
    const updatedPreviousAddresses = formData.previousAddresses.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      previousAddresses: updatedPreviousAddresses,
    });
  };
//   const handleInputChange = (field, value) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

  const handleSubmit = () => {
    console.log('submit', formData)
  }
  const formik = useFormik({
    initialValues: formData,

    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      legalFullName: Yup.string().required('Required'),
      birthDate: Yup.string()
        .required('Birth date is required')
       ,
      nationality: Yup.string().required('Required'),
      gender: Yup.string().required('Required'),
      maritalStatus: Yup.string().required('Required'),
      spouseStatus: Yup.string().when('maritalStatus', {
        is: 'Married',
        then: Yup.string().required('Required for married individuals'),
      }),
      phone: Yup.string()
        .required('Required')
        .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number'),
      email: Yup.string().email('Invalid email address').required('Required'),
      streetAddress: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      nationalityType: Yup.string().required('Required'),
      postalCode: Yup.string()
        .required('Required')
        .matches(/^[0-9]{5}$/, 'Must be a valid 5-digit postal code'),
      employerStatus: Yup.string().required('Required'),
    //   currentAddress:Yup.string().required('Required'),


        currentAddress: Yup.object({
          address: Yup.string().required('Required'),
          city: Yup.string().required('Required'),
          state: Yup.string().required('Required'),
          postalCode: Yup.string()
            .required('Required')
            .matches(/^[0-9]{5}$/, 'Must be a valid 5-digit postal code'),
          yearsAtAddress: Yup.number()
            .required('Required')
            .min(0, 'Must be at least 0 years')
            .max(10, 'Max of 10 years allowed')
        }),
        previousAddresses: Yup.array().of(
          Yup.object({
            address: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
            state: Yup.string().required('Required'),
            postalCode: Yup.string()
              .required('Required')
              .matches(/^[0-9]{5}$/, 'Must be a valid 5-digit postal code'),
            yearsAtAddress: Yup.number()
              .required('Required')
              .min(0, 'Must be at least 0 years')
              .max(10, 'Max of 10 years allowed')
          })
        ),
      //   jobTitle: Yup.string(),
      //   annualIncome: Yup.number().typeError('Must be a number')
    }),
    onSubmit: (values) => {
        navigate('/applyLoan/selectType');

      alert('Form submitted successfully!')
      console.log(values)
    },
  })
  const calculateTotalYears = () => {
    const currentYears = parseInt(formData.currentAddress.yearsAtAddress) || 0;
    const previousYears = formData.previousAddresses.reduce((total, address) => {
      return total + (parseInt(address.yearsAtAddress) || 0);
    }, 0);
    return currentYears + previousYears;
  };

  const totalYears = calculateTotalYears();

  return (
    <div className="container">
    <div className="container form-container my-5">
      <h2 className="form-title mb-4">Customer Details</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-section">
          <h5 className="section-title">Personal Information</h5>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label>First Name *</label>
              <input type="text" className="form-control" {...formik.getFieldProps('firstName')} />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-danger">{formik.errors.firstName}</div>
              ) : null}
            </div>
            <div className="col-md-4 mb-3">
              <label>Last Name *</label>
              <input type="text" className="form-control" {...formik.getFieldProps('lastName')} />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-danger">{formik.errors.lastName}</div>
              ) : null}
            </div>
            <div className="col-md-4 mb-3">
              <label>Legal Full Name *</label>
              <input
                type="text"
                className="form-control"
                {...formik.getFieldProps('legalFullName')}
              />
              {formik.touched.legalFullName && formik.errors.legalFullName ? (
                <div className="text-danger">{formik.errors.legalFullName}</div>
              ) : null}
            </div>
            <div className="col-md-4 mb-3">
              <label>Gender *</label>
              <div role="group" aria-labelledby="gender-group" className="form-check-inline-group">
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="gender"
                    id="genderMale"
                    value="Male"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="genderMale" className="form-check-label">
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="gender"
                    id="genderFemale"
                    value="Female"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="genderFemale" className="form-check-label">
                    Female
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="gender"
                    id="genderOther"
                    value="Other"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="genderOther" className="form-check-label">
                    Other
                  </label>
                </div>
              </div>
              {formik.touched.gender && formik.errors.gender ? (
                <div className="text-danger">{formik.errors.gender}</div>
              ) : null}
            </div>
            <div className="col-md-4 mb-3">
              <label>Date of Birth *</label>
              <input type="date" className="form-control" {...formik.getFieldProps('birthDate')} />
              {formik.touched.birthDate && formik.errors.birthDate ? (
                <div className="text-danger">{formik.errors.birthDate}</div>
              ) : null}
            </div>
            <div className="col-md-4 mb-3">
              <label>Marital Status *</label>
              <div
                role="group"
                aria-labelledby="marital-status-group"
                className="form-check-inline-group"
              >
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="maritalStatus"
                    id="maritalSingle"
                    value="Single"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="maritalSingle" className="form-check-label">
                    Single
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="maritalStatus"
                    id="maritalMarried"
                    value="Married"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="maritalMarried" className="form-check-label">
                    Married
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="maritalStatus"
                    id="maritalDivorced"
                    value="Divorced"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label htmlFor="maritalDivorced" className="form-check-label">
                    Divorced
                  </label>
                </div>
              </div>
              {formik.touched.maritalStatus && formik.errors.maritalStatus ? (
                <div className="text-danger">{formik.errors.maritalStatus}</div>
              ) : null}
            </div>
            {formik.values.maritalStatus === 'Married' && (
              <div className="col-md-4 mb-3">
                <label>Spouse Name *</label>
                <input
                  type="text"
                  className="form-control"
                  {...formik.getFieldProps('spouseName')}
                />
                {formik.touched.spouseName && formik.errors.spouseName ? (
                  <div className="text-danger">{formik.errors.spouseName}</div>
                ) : null}
              </div>
            )}

            <div className="col-md-4 mb-3">
              <label>Nationality *</label>
              <input
                type="text"
                className="form-control"
                {...formik.getFieldProps('nationality')}
              />
              {formik.touched.nationality && formik.errors.nationality ? (
                <div className="text-danger">{formik.errors.nationality}</div>
              ) : null}
            </div>

            <div className="col-md-4 mb-3">
              <label>Nationality Type *</label>
              <select className="form-control" {...formik.getFieldProps('nationalityType')}>
                <option value="" label="Select Nationality Type" />
                <option value="Citizen" label="Citizen" />
                <option value="Resident" label="Resident" />
                <option value="Visitor" label="Visitor" />
              </select>
              {formik.touched.nationalityType && formik.errors.nationalityType ? (
                <div className="text-danger">{formik.errors.nationalityType}</div>
              ) : null}
            </div>
            <div className="col-md-4 mb-3">
              <label>Nationality ID *</label>
              <input
                type="text"
                className="form-control"
                {...formik.getFieldProps('nationalityId')}
              />
              {formik.touched.nationalityId && formik.errors.nationalityId ? (
                <div className="text-danger">{formik.errors.nationalityId}</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h5 className="section-title">Contact Details</h5>
          <div className="row">
            
            <div className="col-md-4 mb-3">
              <label>Email Address *</label>
              <input type="email" className="form-control" {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="col-md-4 mb-3">
              <label>Phone Number *</label>
              <input type="text" className="form-control" {...formik.getFieldProps('phone')} />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-danger">{formik.errors.phone}</div>
              ) : null}
            </div>
            <div></div>
            <div className="col-md-4 mb-3">
              <label>State *</label>
              <input type="text" className="form-control" {...formik.getFieldProps('state')} />
              {formik.touched.state && formik.errors.state ? (
                <div className="text-danger">{formik.errors.state}</div>
              ) : null}
            </div>
            <div className="col-md-4 mb-3">
              <label>City *</label>
              <input type="text" className="form-control" {...formik.getFieldProps('city')} />
              {formik.touched.city && formik.errors.city ? (
                <div className="text-danger">{formik.errors.city}</div>
              ) : null}
            </div>

            <div className="col-md-4 mb-3">
              <label>Postal/Zip Code *</label>
              <input type="text" className="form-control" {...formik.getFieldProps('postalCode')} />
              {formik.touched.postalCode && formik.errors.postalCode ? (
                <div className="text-danger">{formik.errors.postalCode}</div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="form-section">
        {/* Current Address Section */}
        <h5 className="section-title">Current Address</h5>
        <div className="row">
          <div className="col-md-12 mb-3">
            <label>Address</label>
            <textarea
              className="form-control"
              name="address"
              value={formData.currentAddress.address}
              onChange={(e) => handleInputChange(e, 'currentAddress')}
              rows="3"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.currentAddress.city}
              onChange={(e) => handleInputChange(e, 'currentAddress')}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>State</label>
            <input
              type="text"
              className="form-control"
              name="state"
              value={formData.currentAddress.state}
              onChange={(e) => handleInputChange(e, 'currentAddress')}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Postal Code</label>
            <input
              type="text"
              className="form-control"
              name="postalCode"
              value={formData.currentAddress.postalCode}
              onChange={(e) => handleInputChange(e, 'currentAddress')}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>How long have you lived at the above address? (Years)</label>
            <input
              type="number"
              className="form-control"
              name="yearsAtAddress"
              value={formData.currentAddress.yearsAtAddress}
              onChange={(e) => handleInputChange(e, 'currentAddress')}
            />
          </div>
        </div>
  
        {formData.previousAddresses.map((address, index) => (
            <div key={index} className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h5 className="section-title">Previous Address {index + 1}</h5>
    <FaMinusCircle
      onClick={() => removePreviousAddress(index)} // Remove this address section
      style={{ cursor: 'pointer', color: 'red' }}
    />
  </div>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label>Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={address.address}
                    onChange={(e) => handleInputChange(e, 'previousAddress', index)}
                    rows="3"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={address.city}
                    onChange={(e) => handleInputChange(e, 'previousAddress', index)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={address.state}
                    onChange={(e) => handleInputChange(e, 'previousAddress', index)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={(e) => handleInputChange(e, 'previousAddress', index)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label>How long have you lived at the above address? (Years)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="yearsAtAddress"
                    value={address.yearsAtAddress}
                    onChange={(e) => handleInputChange(e, 'previousAddress', index)}
                  />
                </div>
              </div>
            </div>
          ))}
    
          {/* Button to Add Another Previous Address */}
          <button className="btn btn-primary" type="button" onClick={addPreviousAddress}>
            Add Previous Address
          </button>
    
          {/* Show total years and message if less than 10 years 
          // <div className="total-years-message">
          //   {totalYears < 10 && (
          //     <p className="text-danger">
          //       You need {10 - totalYears} more years of address history.
          //     </p>
          //   )}
          // </div>*/}
      </div>
        
        <div className="form-section">
          <div className="col-md-4 mb-3">
            <label>Employment Status*</label>
            <div role="group" aria-labelledby="gender-group" className="form-check-inline-group">
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="employerStatus"
                  id="employed"
                  value="employed"
                  className="form-check-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="employed" className="form-check-label">
                  Employed
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="employerStatus"
                  id="self-employed"
                  value="self-employed"
                  className="form-check-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="self-employed" className="form-check-label">
                  Self employed
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="employerStatus"
                  id="unemployed"
                  value="unemployed"
                  className="form-check-input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <label htmlFor="unemployed" className="form-check-label">
                  UnEmployed
                </label>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'end' }}>
          Submit
        </button>
      </form>
      <div className="right-section">
      <p>Additional Content or Leave Empty</p>
    </div>
    </div>
    </div>
  )
}

export default CustomerDetailsForm
