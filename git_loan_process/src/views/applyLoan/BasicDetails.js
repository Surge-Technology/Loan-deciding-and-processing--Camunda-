/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup' // Import Yup for validation
import moment from 'moment'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
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

const BasicDetails = () => {
    const [state, setState] = useState({
        customerId:'',
        firstName: "",
        lastName: "",
        birthDate: "",
        nationality: "",
        gender: "",
        maritalStatus: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        occupation: "",
        annualIncome: "",
    })

    const initialValues = { ...state }
    const navigate = useNavigate()
    const params = useParams()
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define Yup validation schema
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
        lastName: Yup.string().required('Last Name is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
        birthDate: Yup.string().required("Birth date is required").test(
            "DOB",
            "Age must be at least 18 years",
            (date) => moment().diff(moment(date), "years") >= 18
        ),
        nationality: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required('Nationality is required'),
        gender: Yup.string()
            .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
            .required('Gender is required'),
        maritalStatus: Yup.string()
            .oneOf(['married', 'unmarried'], 'Invalid marital status')
            .required('Marital Status is required'),
        phone: Yup.string()
            .min(10, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!')
            .matches(/^\d+$/, 'Phone must be numeric')
            .required('Phone number is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        city: Yup.string().required('city is required'),
        state: Yup.string().required('state is required'),
        country: Yup.string().required('country is required'),

        address: Yup.string().required('Address is required'),
        pincode: Yup.string()
            .matches(/^\d{5,6}$/, 'Pincode must be valid')
            .min(6, 'Must be exactly 6 digits').max(6, 'Must be exactly 6 digits')
            .required('Pincode is required'),
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
            [name]: value
        }))
    }

    const SubmitData = (values) => {
        let payload = {
            ...values,
            customerId: Number(state.customerId),
            dob: String(moment(values.birthDate).format('MM-DD-YYYY')),
        }
        console.log('Payload that will be submitted is :', payload)

        if (params.id == "new") {
            if (isSubmitting) return;
            setIsSubmitting(true);
            console.log("entered...",params.id,payload);
            axios
                .post(`http://localhost:8080/claimAndCompleteTask`, payload)
                // .then((res) => {
                //     console.log('response from backend ', res);
                //     Swal.fire('Success', 'Customer created successfully', 'success');
                // })

                .then((res) => {
                    console.log('response from backend ', res)
                    let id = JSON.stringify(res.data);
                    // Show success alert
                    Swal.fire({
                        title: 'Success',
                        text: 'Account created successfully',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        navigate(`/applyLoan/financialDetails/${id}`);
                        // Clear form after the OK button is clicked
                        //   document.getElementById('myForm').reset();
                    })
                })

                .catch((err) => {
                    console.error('Error sending data:', err.response ? err.response.data : err.message)
                    Swal.fire('Error', 'Please try again', 'error')
                })
        } else {
            navigate(`/applyLoan/financialDetails/${params.id}`);

        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (params.id !== "new") {
            axios.get(`http://localhost:8080/getCustomerDetails/${params.id}`).then((res) => {
                console.log("response from background ###########" + res);
                let customerDetails = res.data;
                console.log(JSON.stringify(res.data.firstName), JSON.stringify(res.data.lastName), JSON.stringify(res.data.dob));
                console.log("customerDetails.firstName", customerDetails.firstName, customerDetails.gender);
                setState((prevState) => ({
                    ...prevState,
                    customerId: customerDetails.customerId,
                    firstName: customerDetails.firstName,
                    lastName: customerDetails.lastName,
                    birthDate: customerDetails.dob,
                    nationality: customerDetails.nationality,
                    gender: customerDetails.gender,
                    maritalStatus: customerDetails.maritalStatus,
                    phone: customerDetails.phone,
                    email: customerDetails.email,
                    address: customerDetails.address,
                    city: customerDetails.city,
                    state: customerDetails.state,
                    country: customerDetails.country,
                    pincode: customerDetails.pincode,
                    occupation: customerDetails.occupation,
                    annualIncome: customerDetails.annualIncome,
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
                                    <CCardImage src={params.id == "new" ? "src/assets/images/registor.jpg" : "src/assets/images/customer.jpg"} style={{ height: '100%' }} />
                                </CCol>
                                <CCol md={6}>
                                    <CCardBody>
                                        <CCardTitle className="mt-3 mb-3">
                                            {' '}
                                            <strong>{params.id == "new" ? "Create new Customer" : "Basic Customer Details"}</strong>
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
                                                            <div >Personal Details:<span style={{color:'red', fontSize:'20px'}}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }}>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="firstName"
                                                                floatingLabel="First Name"
                                                                value={state.firstName}
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
                                                                value={state.lastName}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.lastName && !!errors.lastName}
                                                            />
                                                            <ErrorMessage
                                                                name="lastName"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                                                        <CCol>
                                                            {params.id == "new" ?
                                                                <>
                                                                    <CFormInput
                                                                        type="date"
                                                                        name="birthDate"
                                                                        floatingLabel="DOB"
                                                                        selected={state.birthDate ? new Date(state.birthDate) : null}
                                                                        onChange={(e) => { dateHandleChange("birthDate", e) }}
                                                                        onChangeCapture={handleChange}
                                                                        onBlur={handleBlur}
                                                                        invalid={touched.birthDate && !!errors.birthDate}
                                                                    />
                                                                    <ErrorMessage
                                                                        name="birthDate"
                                                                        component="div"
                                                                        className="text-danger"
                                                                    />
                                                                </> :
                                                                <>
                                                                    <CFormInput
                                                                        type="date"
                                                                        name="birthDate"
                                                                        floatingLabel="DOB"
                                                                        value={state.birthDate ? new Date(state.birthDate).toISOString().split('T')[0] : ""}
                                                                        onChange={(e) => { dateHandleChange("birthDate", e) }}
                                                                        onChangeCapture={handleChange}
                                                                        onBlur={handleBlur}
                                                                        invalid={touched.birthDate && !!errors.birthDate}
                                                                    />
                                                                    <ErrorMessage
                                                                        name="birthDate"
                                                                        component="div"
                                                                        className="text-danger"
                                                                    />
                                                                </>}
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="nationality"
                                                                floatingLabel="Nationality"
                                                                value={state.nationality}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.nationality && !!errors.nationality}
                                                            />
                                                            <ErrorMessage
                                                                name="nationality"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }}>
                                                        <CCol>
                                                            <CFormSelect
                                                                name="gender"
                                                                floatingLabel="Gender"
                                                                value={state.gender}
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
                                                            <CFormSelect
                                                                name="maritalStatus"
                                                                floatingLabel="Marital Status"
                                                                value={state.maritalStatus}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
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
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Contact Details:<span style={{color:'red', fontSize:'20px'}}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="phone"
                                                                value={state.phone}
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
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="email"
                                                                value={state.email}
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
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Address:<span style={{color:'red', fontSize:'20px'}}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="address"
                                                                value={state.address}
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
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="city"
                                                                value={state.city}
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
                                                                name="state"
                                                                value={state.state}
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
                                                                name="country"
                                                                value={state.country}
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
                                                    </CRow>
                                                    <CRow className="mb-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="pincode"
                                                                floatingLabel="Pincode"
                                                                value={state.pincode}
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
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Employment Details:<span style={{color:'red', fontSize:'20px'}}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="occupation"
                                                                floatingLabel="Occupation"
                                                                value={state.occupation}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.occupation && !!errors.occupation}
                                                            />
                                                            <ErrorMessage
                                                                name="occupation"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="annualIncome"
                                                                floatingLabel="Annual Income"
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
                                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">

                                                            <CButton
                                                                id='cancel'
                                                                type="button"
                                                                color="danger"
                                                                onClick={() => document.getElementById('myForm').reset()}
                                                            >
                                                                Cancel
                                                            </CButton>
                                                            <CButton id="bttn" type="submit" disabled={isSubmitting} >
                                                                {/* {isSubmitting ? <CSpinner /> : 'Submit'} */}
                                                                {params.id == "new" ? "Submit" : "Next"}
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

export default BasicDetails
