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
import { number } from 'prop-types'

const LoanDetails = () => {
    const [state, setState] = useState({
        //loanId: '',
        loanAmount: '',
        loanpurpose: '',
        payemntPlan: '',
        // emiAmount: '',
        interest: '',
        suretyFirstName: '',
        suretyLastName: '',
        relation: '',
    })

    const [loanId,setLoanId] = useState('');
    const [emiAmount, setEmiamount] = useState('');

    const initialValues = { ...state }
    const params = useParams();
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define Yup validation schema
    const validationSchema = Yup.object().shape({
        loanAmount: Yup.number()
            .required('Salary is required')
            .min(0, 'Salary cannot be negative'),
        loanpurpose: Yup.string().required('Loan purpose is required'),
        payemntPlan: Yup.number()
            .oneOf(['1', '3', '6', '12'], 'select valid option')
            .required('Payment terms is required'),
        suretyFirstName: Yup.string().required('First Name is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
        suretyLastName: Yup.string().required('Last Name is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
        relation: Yup.string().required('mention relation with applicant'),
    })

    const calculateEMI = (loanAmount, interestRate, termInMonths) => {
        const monthlyInterestRate = interestRate / 12 / 100; // Annual interest to monthly
        const numInstallments = termInMonths;
        if (monthlyInterestRate === 0) return loanAmount / numInstallments; // No interest case
        const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numInstallments)) /
            (Math.pow(1 + monthlyInterestRate, numInstallments) - 1);
        return emi.toFixed(2);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));

        if (name == "payemntPlan") {
            console.log("paymentPlan", e.target.value);
            const loanAmount = Number(state.loanAmount) || '';
            const interestRate = Number(state.interest) || '';
            const termInMonths = Number(e.target.value) || '';
            console.log("loanAmount", loanAmount, "interestRate", interestRate, "termInMonths", termInMonths);

            if (loanAmount && termInMonths) {
                const emi = calculateEMI(loanAmount, interestRate, termInMonths);
                // Now you can do something with the emi value, e.g., set it in state.
                setEmiamount(emi);
                console.log("emiAmount", emi, emiAmount);
            }
        }
    };
    // const update


    const handlePrevious = (e) => {
        navigate(`/applyLoan/financialDetails/${params.id}`)
    }

    const SubmitData = (values) => {
        let payload = {
            ...values,
            emiAmount: emiAmount,
        }
        console.log('Payload that will be submitted is :', payload)
        //navigate(`/applyLoan/selectType/${params.id}`);

        if (loanId == '') {
            if (isSubmitting) return;
            setIsSubmitting(true);
            axios
                .post(`http://localhost:8080/saveLoanDetails?customerId=${params.id}`, payload)
                // .then((res) => {
                //     console.log('response from backend ', res);
                //     Swal.fire('Success', 'Customer created successfully', 'success');
                // })

                .then((res) => {
                    console.log('response from backend ', res)

                    // Show success alert
                    Swal.fire({
                        
                        text: 'Loan details saved',
                        icon: 'success',
                        timer: '3000',
                        //confirmButtonText: 'OK',
                        showCancelButton: false,
                    }).then(() => {
                        navigate(`/applyLoan/selectType/${params.id}`);
                        // Clear form after the OK button is clicked
                        //   document.getElementById('myForm').reset();
                    })
                })

                .catch((err) => {
                    console.error('Error sending data:', err.response ? err.response.data : err.message)
                    Swal.fire('Error', 'Please try again', 'error')
                })
        } else {
            navigate(`/applyLoan/selectType/${params.id}`);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (params.id !== "new") {
            axios.get(`http://localhost:8080/getLoanDetailsByCustomerId/${params.id}`).then((res) => {
                console.log("response from background ###########" + res.data);
                let loanDetails = res.data[0];
                console.log("loanDetails-------", loanDetails);
                console.log(JSON.stringify(res.data[0].company), JSON.stringify(res.data[0].designation), JSON.stringify(res.data[0].employmentType));
                console.log("loanDetails.loanId", loanDetails.loanId, loanDetails.loanAmount);
                setLoanId(loanDetails.loanId);
                setState((prevState) => ({
                    ...prevState,
                    //loanId: loanDetails.loanId,
                    loanAmount: loanDetails.loanAmount,
                    loanpurpose: loanDetails.loanpurpose,
                    payemntPlan: loanDetails.payemntPlan,
                    emiAmount: loanDetails.emiAmount,
                    interest: loanDetails.interest,
                    suretyFirstName: loanDetails.suretyFirstName,
                    suretyLastName: loanDetails.suretyLastName,
                    relation: loanDetails.relation,
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

    }, [params.id])

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
                                    <CCardImage src="src/assets/images/loan.jpg" style={{ height: '100%' }} />
                                </CCol>
                                <CCol md={6}>
                                    <CCardBody>
                                        <CCardTitle className="mt-3 mb-3">
                                            {' '}
                                            <h4><strong>Loan Details</strong></h4>
                                        </CCardTitle>
                                        <Formik
                                            initialValues={state}
                                            validationSchema={params.id == "new" ? validationSchema : null} // Use the validation schema
                                            onSubmit={SubmitData}
                                        >
                                            {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
                                                <Form id="myForm" onSubmit={handleSubmit}>
                                                    {/* <CRow>
                                                        <CCol className="text-start mb-2 mt-2" >
                                                            <div >Employment Information:</div>
                                                        </CCol>
                                                    </CRow> */}
                                                    <CRow xs={{ gutter: 2 }} >
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="loanAmount"
                                                                floatingLabel="Desired Loan Amount"
                                                                value={state.loanAmount}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.loanAmount && !!errors.loanAmount}
                                                            />
                                                            <ErrorMessage
                                                                name="loanAmount"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow className="mb-2 mt-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="loanpurpose"
                                                                floatingLabel="What is the purpose of Loan"
                                                                value={state.loanpurpose}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.loanpurpose && !!errors.loanpurpose}
                                                            />
                                                            <ErrorMessage name="loanpurpose" component="div" className="text-danger" />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 3 }} >

                                                        <CCol md={3}>
                                                            <CFormInput
                                                                type="text"
                                                                name="interest"
                                                                floatingLabel="Interest(%)"
                                                                value={state.interest}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.interest && !!errors.interest}
                                                            />
                                                            <ErrorMessage
                                                                name="intrest"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={5}>
                                                            <CFormSelect
                                                                name="payemntPlan"
                                                                floatingLabel="Terms (in months)"
                                                                value={state.payemntPlan}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.payemntPlan && !!errors.payemntPlan}
                                                                options={[
                                                                    { value: 'select', label: 'Select' },
                                                                    { value: '1', label: 'Monthly' },
                                                                    { value: '3', label: '3 Months' },
                                                                    { value: '6', label: '6 Months' },
                                                                    { value: '12', label: '12 Months' },
                                                                ]}
                                                            />
                                                            <ErrorMessage name="paymentPlan" component="div" className="paymentPlan" />
                                                        </CCol>
                                                        <CCol md={4}>
                                                            <CFormInput
                                                                type="text"
                                                                name="emiAmount"
                                                                floatingLabel="EMI Amount"
                                                                value={emiAmount || state.emiAmount}
                                                                //onChange={handleInputChange}
                                                                //onChangeCapture={handleChange}
                                                                //onBlur={handleBlur}
                                                                invalid={touched.emiAmount && !!errors.emiAmount}
                                                                readOnly
                                                            />
                                                            <ErrorMessage
                                                                name="emiAmount"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start mb-2 mt-2">
                                                            <div >Surety Person Information:</div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }}>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="suretyFirstName"
                                                                floatingLabel="First Name"
                                                                value={state.suretyFirstName}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.suretyFirstName && !!errors.suretyFirstName}
                                                            />
                                                            <ErrorMessage
                                                                name="suretyFirstName"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="suretyLastName"
                                                                floatingLabel="Last Name"
                                                                value={state.suretyLastName}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.suretyLastName && !!errors.suretyLastName}
                                                            />
                                                            <ErrorMessage
                                                                name="suretyLastName"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow className="mb-2 mt-2">
                                                        <CCol>
                                                            <CFormInput
                                                                type="text"
                                                                name="relation"
                                                                floatingLabel="Relationship with Applicant"
                                                                value={state.relation}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.relation && !!errors.relation}
                                                            />
                                                            <ErrorMessage
                                                                name="relation"
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

export default LoanDetails
