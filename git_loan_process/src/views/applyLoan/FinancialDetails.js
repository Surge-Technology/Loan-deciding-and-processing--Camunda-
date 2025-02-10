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

const FinancialDetails = () => {
    const [state, setState] = useState({
        //financeId: '',
        company: '',
        employmentType: '',
        designation: '',
        dateOfJoining: '',
        experience: '',
        contactPerson: '',
        contactNumber: '',
        salary: '',
        annualIncome: '',
        bankName: '',
        bankBranch: '',
        accountNumber: '',
        ifscCode: '',
        workaddress: '',
        workcity: '',
        workstate: '',
        workcountry: '',
        workpincode: '',
    })
    const [financeId,setFinanceId] = useState('');

    const initialValues = { ...state }
    const params = useParams();
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define Yup validation schema
    const validationSchema = Yup.object().shape({
        company: Yup.string().required('Company name is required'),
        employmentType: Yup.string()
            .oneOf(['casual', 'full-time', 'part-time', 'apprenticeship', 'traineeship', 'Traineeship', 'internship'], 'Invalid Employment Type')
            .required('Employment Types is required'),
        designation: Yup.string().required('Job Title is required'),
        dateOfJoining: Yup.string().required("Joining date is required"),
        experience: Yup.string().matches(/^\d+$/, 'experience must be numeric').required('Nationality is required'),
        contactPerson: Yup.string().required('Contact person is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
        contactNumber: Yup.string()
            .min(10, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!')
            .matches(/^\d+$/, 'Contact number must be numeric')
            .required('Contact number is required'),
        salary: Yup.number()
            .required('Salary is required')
            .min(0, 'Salary cannot be negative'),
        annualIncome: Yup.number()
            .required('Annual income is required')
            .min(0, 'Income cannot be negative'),
        bankName: Yup.string().required('Bank name is required'),
        bankBranch: Yup.string().required('Bank branch is required'),
        accountNumber: Yup.string()
            .required('Bank account number is required')
            .matches(/^\d{9,18}$/, 'Bank account number must be between 9 and 18 digits'),
        ifscCode: Yup.string()
            .required('IFSC code is required')
            .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC code is invalid'),
        workcity: Yup.string().required('city is required'),
        workstate: Yup.string().required('state is required'),
        workcountry: Yup.string().required('country is required'),
        workaddress: Yup.string().required('Address is required'),
        workpincode: Yup.string()
            .matches(/^\d{5,6}$/, 'Pincode must be valid')
            .min(6, 'Must be exactly 6 digits').max(6, 'Must be exactly 6 digits')
            .required('Pincode is required'),
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
            [name]: value
        }))
    }

    const handlePrevious = (e) => {
        navigate(`/applyLoan/basicDetails/${params.id}`)
    }

    const SubmitData = (values) => {
        let payload = {
            ...values,
            customerId: params.id,
            financeId: Number(state.financeId),
            dateOfJoining: String(moment(values.dateOfJoining).format('MM-DD-YYYY')),
        }
        console.log('Payload that will be submitted is :', payload)

        if (financeId == '') {
        if (isSubmitting) return;
        setIsSubmitting(true);
        axios
            .post(`http://localhost:8080/saveFinancialDetails?customerId=${params.id}`, payload)
            // .then((res) => {
            //     console.log('response from backend ', res);
            //     Swal.fire('Success', 'Customer created successfully', 'success');
            // })

            .then((res) => {
                console.log('response from backend ', res)

                // Show success alert
                Swal.fire({
                   
                    text: 'finance details saved',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    navigate(`/applyLoan/loanDetails/${params.id}`);
                    // Clear form after the OK button is clicked
                    //   document.getElementById('myForm').reset();
                })
            })

            .catch((err) => {
                console.error('Error sending data:', err.response ? err.response.data : err.message)
                Swal.fire('Error', 'Please try again', 'error')
            })
        }else {
            navigate(`/applyLoan/loanDetails/${params.id}`)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (params.id !== "new") {
            axios.get(`http://localhost:8080/getFinancialDetailsByCustomerId/${params.id}`).then((res) => {
                console.log("response from background ###########" + res.data);
                let financialDetails = res.data[0];
                console.log("financialDetails-------",financialDetails);
                console.log(JSON.stringify(res.data[0].company), JSON.stringify(res.data[0].designation), JSON.stringify(res.data[0].employmentType));
                console.log("financialDetails.company", financialDetails.company, financialDetails.employmentType);
                setFinanceId(financialDetails.financeId);
                setState((prevState) => ({
                    ...prevState,
                    financeId: financialDetails.financeId,
                    company: financialDetails.company,
                    employmentType: financialDetails.employmentType,
                    designation: financialDetails.designation,
                    dateOfJoining: financialDetails.dateOfJoining,
                    experience: financialDetails.experience,
                    contactPerson: financialDetails.contactPerson,
                    contactNumber: financialDetails.contactNumber,
                    salary: financialDetails.salary,
                    annualIncome: financialDetails.annualIncome,
                    bankName: financialDetails.bankName,
                    bankBranch: financialDetails.bankBranch,
                    accountNumber: financialDetails.accountNumber,
                    ifscCode: financialDetails.ifscCode,
                    workaddress: financialDetails.workaddress,
                    workcity: financialDetails.workcity,
                    workstate: financialDetails.workstate,
                    workcountry: financialDetails.workcountry,
                    workpincode: financialDetails.workpincode,
                })
                )
            }).catch(err => {
                console.error("Error sending data:", err.response ? err.response.data : err.message);
                setState((prevState) => ({ ...prevState }));
                Swal.fire(
                    err.response.data.message,
                    'Please try again '
                )
            })
        }
    }, [])

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center mt-2">
                <CRow>
                    <CCol>
                        <CCard
                            className="mb-3 d-flex justify-content-center align-items-center"
                            style={{ maxWidth: '980px' }}
                        >
                            <CRow className="g-0">
                                <CCol md={6}>
                                    <CCardImage src="src/assets/images/financial.png" style={{ height: '100%' }} />
                                </CCol>
                                <CCol md={6}>
                                    <CCardBody>
                                        <CCardTitle className="mt-3 mb-3">
                                            {' '}
                                            <h4><strong>Financial Details</strong></h4>
                                        </CCardTitle>
                                        <Formik
                                            initialValues={state}
                                            validationSchema={params.id == "new" ? validationSchema : null} // Use the validation schema
                                            onSubmit={SubmitData}
                                        >
                                            {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
                                                <Form id="myForm" onSubmit={handleSubmit}>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Employment Information:</div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="company"
                                                                floatingLabel="Company Name"
                                                                value={state.company}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.company && !!errors.company}
                                                            />
                                                            <ErrorMessage
                                                                name="company"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow className="mb-2 mt-2">
                                                        <CCol>
                                                            <CFormSelect
                                                                name="employmentType"
                                                                floatingLabel="Select the type of employment"
                                                                value={state.employmentType}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.employmentType && !!errors.employmentType}
                                                                options={[
                                                                    { value: 'select', label: 'Select' },
                                                                    { value: 'casual', label: 'Casual' },
                                                                    { value: 'full-time', label: 'Full-time' },
                                                                    { value: 'part-time', label: 'Part-time' },
                                                                    { value: 'apprenticeship', label: 'Apprenticeship' },
                                                                    { value: 'traineeship', label: 'Traineeship' },
                                                                    { value: 'internship', label: 'Internship' },
                                                                ]}
                                                            />
                                                            <ErrorMessage name="employmentType" component="div" className="text-danger" />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="designation"
                                                                floatingLabel="Job title"
                                                                value={state.designation}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.designation && !!errors.designation}
                                                            />
                                                            <ErrorMessage
                                                                name="designation"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="date"
                                                                name="dateOfJoining"
                                                                floatingLabel="Date of joining"
                                                                selected={state.dateOfJoining ? new Date(values.dateOfJoining) : null}
                                                                onChange={(e) => { dateHandleChange("dateOfJoining", e) }}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.dateOfJoining && !!errors.dateOfJoining}
                                                            />
                                                            <ErrorMessage
                                                                name="dateOfJoining"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>

                                                    </CRow>
                                                    <CRow >
                                                        <CCol>
                                                            <CFormInput
                                                                type="number"
                                                                name="experience"
                                                                floatingLabel="How many years of experience you have"
                                                                value={state.experience}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.experience && !!errors.experience}
                                                            />
                                                            <ErrorMessage
                                                                name="experience"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="contactPerson"
                                                                value={state.contactPerson}
                                                                floatingClassName="mb-2"
                                                                floatingLabel="Contact Person"
                                                                placeholder="Contact Person"
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.contactPerson && !!errors.contactPerson}
                                                            />
                                                            <ErrorMessage
                                                                name="contactPerson"
                                                                component="div"
                                                                className="errmsg text-danger"
                                                            ></ErrorMessage>
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="contactNumber"
                                                                value={state.contactNumber}
                                                                floatingClassName="mb-2"
                                                                floatingLabel="Contact Number"
                                                                placeholder="Contact Number"
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                // invalid={touched.contactNumber && !!errors.contactNumber}
                                                            />
                                                            <ErrorMessage
                                                                name="contactNumber"
                                                                component="div"
                                                                className="errmsg text-danger"
                                                            ></ErrorMessage>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Financial Information:</div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow className="mb-2 mt-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="salary"
                                                                floatingLabel="Gross Salary"
                                                                value={state.salary}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.salary && !!errors.salary}
                                                            />
                                                            <ErrorMessage
                                                                name="salary"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="annualIncome"
                                                                floatingLabel="Annual CTC"
                                                                value={state.annualIncome}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.annualIncome && !!errors.annualIncome}
                                                            />
                                                            <ErrorMessage
                                                                name="annualIncome"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Bank Details:</div>
                                                        </CCol>
                                                    </CRow >
                                                    <CRow xs={{ gutter: 2 }} >
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="bankName"
                                                                floatingLabel="Bank Name"
                                                                value={state.bankName}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.bankName && !!errors.bankName}
                                                            />
                                                            <ErrorMessage
                                                                name="bankName"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="bankBranch"
                                                                floatingLabel="Bank Branch"
                                                                value={state.bankBranch}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.bankBranch && !!errors.bankBranch}
                                                            />
                                                            <ErrorMessage
                                                                name="bankBranch"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="accountNumber"
                                                                floatingLabel="Account Number"
                                                                value={state.accountNumber}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.accountNumber && !!errors.accountNumber}
                                                            />
                                                            <ErrorMessage
                                                                name="accountNumber"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="ifscCode"
                                                                floatingLabel="IFSC Number"
                                                                value={state.ifscCode}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                // invalid={touched.ifscCode && !!errors.ifscCode}
                                                            />
                                                            <ErrorMessage
                                                                name="ifscCode"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Work Address:</div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="workaddress"
                                                                value={state.workaddress}
                                                                floatingClassName="mb-2"
                                                                floatingLabel="Street address"
                                                                placeholder="Street address"
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.workaddress && !!errors.workaddress}
                                                            />
                                                            <ErrorMessage
                                                                name="workaddress"
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
                                                                name="workcity"
                                                                value={state.workcity}
                                                                floatingClassName="mb-2"
                                                                floatingLabel="City"
                                                                placeholder="City"
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.workcity && !!errors.workcity}
                                                            />
                                                            <ErrorMessage name="workcity" component="div" className="text-danger" />
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="workstate"
                                                                value={state.workstate}
                                                                floatingClassName="mb-2"
                                                                floatingLabel="State"
                                                                placeholder="State"
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.workstate && !!errors.workstate}
                                                            />
                                                            <ErrorMessage name="workstate" component="div" className="text-danger" />
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="workcountry"
                                                                value={state.workcountry}
                                                                floatingClassName="mb-2"
                                                                floatingLabel="Country"
                                                                placeholder="Country"
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.workcountry && !!errors.workcountry}
                                                            />
                                                            <ErrorMessage
                                                                name="workcountry"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow className="mb-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="workpincode"
                                                                floatingLabel="Pincode"
                                                                value={state.workpincode}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.workpincode && !!errors.workpincode}
                                                            />
                                                            <ErrorMessage
                                                                name="workpincode"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>

                                                    <CRow>
                                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">

                                                            <CButton
                                                                id='cancel'
                                                                type="button"
                                                                color="danger"
                                                                onClick={handlePrevious}
                                                            >
                                                                Previous
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

export default FinancialDetails
