/* eslint-disable prettier/prettier */
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

const CompanyDetailsForm = () => {
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
      employeeDoj: '',
      yearsOfExperience: '',
      isCurrent: false,
    },
    validationSchema: Yup.object().shape({
      companyName: Yup.string()
        .required('Company Name is required')
        .max(100, 'Company Name cannot exceed 100 characters'),
      contactPersonName: Yup.string()
        .required('Contact Person Name is required')
        .max(50, 'Contact Person Name cannot exceed 50 characters'),
      companyContactNumber: Yup.string()
        .required('Contact Number is required')
        .matches(/^\d{10}$/, 'Contact Number must be exactly 10 digits'),
      companyContactEmail: Yup.string()
        .required('Contact Email is required')
        .email('Invalid email address'),
      employmentType: Yup.string()
        .required('Employment Type is required'),
      grossSalary: Yup.number()
        .required('Gross Salary is required')
        .positive('Gross Salary must be a positive number'),
      annualIncome: Yup.number()
        .required('Annual Income is required')
        .positive('Annual Income must be a positive number'),
      designation: Yup.string()
        .required('Designation is required')
        .max(50, 'Designation cannot exceed 50 characters'),
      employeeDoj: Yup.date()
        .required('Date of Joining is required')
        .max(new Date(), 'Date of Joining cannot be in the future'),
      yearsOfExperience: Yup.number()
        .required('Years of Experience is required')
        .positive('Years of Experience must be a positive number')
        .max(50, 'Years of Experience cannot exceed 50 years'),
    }),
    onSubmit: (values) => {
      console.log('Form Submitted:', values);
    },
  });

  return (
    <div className="container my-5">
      <div className="card shadow-lg">
        <div className="card-header" style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a' }}>
          <h4>Employment Details</h4>
        </div>
        <div className="card-body">
          <form onSubmit={formik.handleSubmit}>
            <fieldset className="border p-3 mb-3">

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('companyName')}
                  />
                  {formik.touched.companyName && formik.errors.companyName ? (
                    <div className="text-danger">{formik.errors.companyName}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Contact Person Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('contactPersonName')}
                  />
                  {formik.touched.contactPersonName && formik.errors.contactPersonName ? (
                    <div className="text-danger">{formik.errors.contactPersonName}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Contact Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('companyContactNumber')}
                  />
                  {formik.touched.companyContactNumber && formik.errors.companyContactNumber ? (
                    <div className="text-danger">{formik.errors.companyContactNumber}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Contact Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    {...formik.getFieldProps('companyContactEmail')}
                  />
                  {formik.touched.companyContactEmail && formik.errors.companyContactEmail ? (
                    <div className="text-danger">{formik.errors.companyContactEmail}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Employment Type *</label>
                  <select className="form-control" {...formik.getFieldProps('employmentType')}>
                    <option value="" label="Select Employment Type" />
                    <option value="Permanent" label="Permanent" />
                    <option value="Contract" label="Contract" />
                    <option value="Internship" label="Internship" />
                  </select>
                  {formik.touched.employmentType && formik.errors.employmentType ? (
                    <div className="text-danger">{formik.errors.employmentType}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Gross Salary *</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('grossSalary')}
                  />
                  {formik.touched.grossSalary && formik.errors.grossSalary ? (
                    <div className="text-danger">{formik.errors.grossSalary}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Annual Income *</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('annualIncome')}
                  />
                  {formik.touched.annualIncome && formik.errors.annualIncome ? (
                    <div className="text-danger">{formik.errors.annualIncome}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Designation *</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('designation')}
                  />
                  {formik.touched.designation && formik.errors.designation ? (
                    <div className="text-danger">{formik.errors.designation}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Employee DOJ *</label>
                  <input
                    type="date"
                    className="form-control"
                    {...formik.getFieldProps('employeeDoj')}
                  />
                  {formik.touched.employeeDoj && formik.errors.employeeDoj ? (
                    <div className="text-danger">{formik.errors.employeeDoj}</div>
                  ) : null}
                </div>

                <div className="col-md-4 mb-3">
                  <label>Years of Experience *</label>
                  <input
                    type="number"
                    className="form-control"
                    {...formik.getFieldProps('yearsOfExperience')}
                  />
                  {formik.touched.yearsOfExperience && formik.errors.yearsOfExperience ? (
                    <div className="text-danger">{formik.errors.yearsOfExperience}</div>
                  ) : null}
                </div>
              </div>
            </fieldset>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
