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
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import IconButton from '@mui/material/IconButton';
import { number } from 'prop-types'
import { toast } from 'react-toastify'


const EducationalLoan = () => {
    const [state, setState] = useState({
        educationalLoanId: '',
        panNumber: '',
        aadharNumber: '',
        gardianFirstName: '',
        gardianLastName: '',
        relation: '',
        education: '',
        passOutYear: '',
        marksObtained: '',
        collegeName: '',
        newCourse: '',
        duration: '',
        instituteName: '',
        tutionFee: '',
        booksFee: '',
        accommodation: '',
        visa: '',
        examFee: '',
        totalAmount: '',
        securityDeposit: '',
            city: '',
            state: '',
            country: '',
            address: '',
            pincode: '',
    })

    const initialValues = { ...state }
    const params = useParams();
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);

    //const [totalFee, setTotalFee] = useState('');

    // Define Yup validation schema
    const validationSchema = Yup.object().shape({
        panNumber: Yup.string()
            .required('PAN number is required')
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
        aadharNumber: Yup.string()
            .required('Aadhaar number is required')
            .matches(/^\d{12}$/, "Aadhaar number can only contain numbers")
            .min(12, 'Must be exactly 12 digits').max(12, 'Must be exactly 12 digits'),
        purpose: Yup.string().required('PAN number is required'),
        city: Yup.string().required('city is required'),
        state: Yup.string().required('state is required'),
        country: Yup.string().required('country is required'),
        address: Yup.string().required('Address is required'),
        pincode: Yup.string()
            .matches(/^\d{5,6}$/, 'Pincode must be valid')
            .min(6, 'Must be exactly 6 digits').max(6, 'Must be exactly 6 digits')
            .required('Pincode is required'),
        //existingLoans: Yup.string().required('city is required'),
        gardianFirstName: Yup.string().required('Gardian First Name is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
        gardianLastName: Yup.string().required('Gardian Last Name is required').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed"),
        relation: Yup.string().required('mention relation with student'),
        education: Yup.string().required('Education passed is required'),
        passOutYear: Yup.number().required('Pass Out Year is required'),
        marksObtained: Yup.number().required('Pass Out Year is required'),
        collegeName: Yup.string().required('Education passed is required'),
        newCourse: Yup.string().required('New Course is required'),
        duration: Yup.string().required('Pass Out Year is required'),
        instituteName: Yup.string().required('institute Name is required'),
        tutionFee: Yup.string()
            .matches(/^\d+$/, "Tuition fee can only contain numbers"),
        booksFee: Yup.string()
            .matches(/^\d+$/, "Books fee can only contain numbers"),
        accommodation: Yup.string()
            .matches(/^\d+$/, "Accomodation fee can only contain numbers"),
        visa: Yup.string()
            .matches(/^\d+$/, "VISA fee can only contain numbers"),
        examFee: Yup.string()
            .matches(/^\d+$/, "Examination fee can only contain numbers"),
        securityDeposit: Yup.string()
            .matches(/^\d+$/, "security Deposit can only contain numbers"),
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }))

        if (['tutionFee', 'booksFee', 'accommodation', 'visa', 'examFee', 'securityDeposit'].includes(name)) {

            setState((prevState) => ({
                ...prevState,
                [name]: value,
            }))
            const tutionfee = name === 'tutionFee' ? Number(value) : Number(state.tutionFee || 0);
            const booksfee = name === 'booksFee' ? Number(value) : Number(state.booksFee || 0);
            const accommodationfee = name === 'accommodation' ? Number(value) : Number(state.accommodation || 0);
            const visafee = name === 'visa' ? Number(value) : Number(state.visa || 0);
            const examfee = name === 'examFee' ? Number(value) : Number(state.examFee || 0);
            const securityDepositfee = name === 'securityDeposit' ? Number(value) : Number(state.securityDeposit || 0);

            console.log(" Fee Dataa ", tutionfee, booksfee, accommodationfee, examfee, visafee, securityDepositfee);

            if (tutionfee || booksfee || accommodationfee || visafee || examfee || securityDepositfee) {
                const total = tutionfee + booksfee + accommodationfee + visafee + examfee + securityDepositfee;
                //setTotalFee(total);
                setState((prevState) => ({
                    ...prevState,
                    totalAmount: total,
                }));
                console.log("Total Fee", state.totalAmount,total);
            }

        }
    }



    // const fileHandleChange=(e)=>{
    //     let file =URL.createObjectURL(e.target.files[0]);
    //     setDocumentImage(file);
    //     let formdata = new FormData();
    //     formdata.append('image', e.target.files[0]);
    //     axios.post(`${process.env.REACT_APP_BASE_URL}/panCard/image/upload`,formdata).then((res)=>{
    //        setState((prevState)=>({
    //         ...prevState,
    //         panCardImageNameForApi:res.data.imageName
    //       })) 
    //     }).catch(err=>{
    //       Swal.fire(err.response.data.message,'Please try again later');
    //     })  
    //   }

    const handlePrevious = (e) => {
        navigate(`/applyLoan/selectType/${params.id}`)
    }

    const SubmitData = (values) => {
        let payload = {
            ...values,
            loanType: "Educational Loan",
            educationalLoanId: Number(state.educationalLoanId),
            totalAmount: state.totalAmount,
            permanentAddress: {
                city: state.city,
                state: state.state,
                country: state.country,
                address: state.address,
                pincode: state.pincode,
            },
        }
        console.log('Payload that will be submitted is :', payload)

        //if (isSubmitting) return;
        //setIsSubmitting(true);
        // axios
        //     .post(`http://localhost:8080/submitCustomerDetails`, payload)
        //     // .then((res) => {
        //     //     console.log('response from backend ', res);
        //     //     Swal.fire('Success', 'Customer created successfully', 'success');
        //     // })

        //     .then((res) => {
        //         console.log('response from backend ', res)

        //         // Show success alert
        //         Swal.fire({
        //             title: 'Success',
        //             text: 'Account created successfully',
        //             icon: 'success',
        //             confirmButtonText: 'OK',
        //         }).then(() => {
        //            navigate(`/applyloan/reviewPage/${params.id}`);
        //             // Clear form after the OK button is clicked
        //             //   document.getElementById('myForm').reset();
        //         })
        //     })

        //     .catch((err) => {
        //         console.error('Error sending data:', err.response ? err.response.data : err.message)
        //         Swal.fire('Error', 'Please try again', 'error')
        //     })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center mt-2 mb-2" style={{ width: '100%', maxWidth: '1200px' }}  >
                <CRow className="d-flex justify-content-center align-items-center " style={{ width: '90%', maxWidth: '1200px' }} >
                    <CCol>
                        <CCard
                            className="mb-3 d-flex justify-content-center align-items-center"
                            style={{
                                maxWidth: '980px',
                                backgroundImage: `url(src/assets/images/educationpic.jpg)`,
                                backgroundSize: 'cover',      // Ensures the image covers the entire card
                                backgroundPosition: 'center', // Centers the background image
                                height: '65em',
                            }}
                        >
                            <CRow className="g-0">
                                {/* <CCol md={6}>
                                    <CCardImage src="src/assets/images/home.jpg" style={{ height: '40rem' , width: '60rem'}} />
                                </CCol> */}

                                <CCol md={12}>
                                    <CCardBody>
                                        <CCardTitle >
                                            {' '}
                                            <h3>
                                                <span className="material-icons-outlined" style={{ paddingRight: " 250px", paddingLeft: "2px" }}>
                                                    <IconButton style={{ color: '#314D1C', size: 'xl4' }}
                                                        onClick={() => navigate(`/applyLoan/selectType/${params.id}`)}>
                                                        <ArrowCircleLeftIcon /></IconButton>
                                                </span>
                                                <strong><em>Educational Loan Form</em></strong>
                                            </h3>

                                        </CCardTitle>
                                        <Formik
                                            initialValues={state}
                                            validationSchema={validationSchema} // Use the validation schema
                                            onSubmit={SubmitData}
                                        >
                                            {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
                                                <Form id="myForm" onSubmit={handleSubmit}>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >ID Proofs:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }} >
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="panNumber"
                                                                floatingLabel="PAN Number"
                                                                className="transparent-input"
                                                                value={values.panNumber}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.panNumber && !!errors.panNumber}
                                                            />
                                                            <ErrorMessage
                                                                name="panNumber"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="aadharNumber"
                                                                floatingLabel="Aadhar Number"
                                                                className="transparent-input"
                                                                value={values.aadharNumber}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.aadharNumber && !!errors.aadharNumber}
                                                            />
                                                            <ErrorMessage
                                                                name="aadharNumber"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Educational Information:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: '3' }}>
                                                        <CCol md={3} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="education"
                                                                floatingLabel="Education Qalification"
                                                                className="transparent-input"
                                                                value={values.education}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.education && !!errors.education}
                                                            />
                                                            <ErrorMessage
                                                                name="education"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={2} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="passOutYear"
                                                                floatingLabel="Year of Pass"
                                                                className="transparent-input"
                                                                value={values.passOutYear}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.passOutYear && !!errors.passOutYear}
                                                            />
                                                            <ErrorMessage
                                                                name="passOutYear"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={2} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="marksObtained"
                                                                floatingLabel="Marks(%)"
                                                                className="transparent-input"
                                                                value={values.marksObtained}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.marksObtained && !!errors.marksObtained}
                                                            />
                                                            <ErrorMessage
                                                                name="marksObtained"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={5} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="collegeName"
                                                                floatingLabel="Name of the college/university"
                                                                className="transparent-input"
                                                                value={values.collegeName}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.collegeName && !!errors.collegeName}
                                                            />
                                                            <ErrorMessage
                                                                name="collegeName"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Course Details:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: '3' }}>
                                                        <CCol md={3} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="newCourse"
                                                                floatingLabel="Name of the Course"
                                                                className="transparent-input"
                                                                value={values.newCourse}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.newCourse && !!errors.newCourse}
                                                            />
                                                            <ErrorMessage
                                                                name="newCourse"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={3} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="duration"
                                                                floatingLabel="Duration (months/Yearrs)"
                                                                className="transparent-input"
                                                                value={values.duration}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.duration && !!errors.duration}
                                                            />
                                                            <ErrorMessage
                                                                name="duration"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={6} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="instituteName"
                                                                floatingLabel="Name of the college/university"
                                                                className="transparent-input"
                                                                value={values.instituteName}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.instituteName && !!errors.instituteName}
                                                            />
                                                            <ErrorMessage
                                                                name="instituteName"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Estimated Expenditure :<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: '6' }}>
                                                        <CCol md={2} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="tutionFee"
                                                                floatingLabel="Tution fee"
                                                                className="transparent-input"
                                                                value={values.tutionFee}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.tutionFee && !!errors.tutionFee}
                                                            />
                                                            <ErrorMessage
                                                                name="tutionFee"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={2} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="booksFee"
                                                                floatingLabel="Books"
                                                                className="transparent-input"
                                                                value={values.booksFee}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.booksFee && !!errors.booksFee}
                                                            />
                                                            <ErrorMessage
                                                                name="booksFee"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={2} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="accommodation"
                                                                floatingLabel="Accomodation"
                                                                className="transparent-input"
                                                                value={values.accommodation}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.accommodation && !!errors.accommodation}
                                                            />
                                                            <ErrorMessage
                                                                name="accommodation"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={2} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="examFee"
                                                                floatingLabel="Exam fee"
                                                                className="transparent-input"
                                                                value={values.examFee}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.examFee && !!errors.examFee}
                                                            />
                                                            <ErrorMessage
                                                                name="examFee"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={2} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="visa"
                                                                floatingLabel="VISA"
                                                                className="transparent-input"
                                                                value={values.visa}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.visa && !!errors.visa}
                                                            />
                                                            <ErrorMessage
                                                                name="visa"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol md={2} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="securityDeposit"
                                                                floatingLabel="SecurityDeposit"
                                                                className="transparent-input"
                                                                value={values.securityDeposit}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.securityDeposit && !!errors.securityDeposit}
                                                            />
                                                            <ErrorMessage
                                                                name="securityDeposit"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow className="mb-2 mt-2">
                                                        <CCol md={12} className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="totalAmount"
                                                                floatingLabel="Total amount of Expenditure: Rs."
                                                                className="transparent-input"
                                                                value={state.totalAmount}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.totalAmount && !!errors.totalAmount}
                                                            />
                                                            <ErrorMessage
                                                                name="totalAmount"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Gardian Information:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }}>
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="suretyFirstName"
                                                                floatingLabel="First Name"
                                                                className="transparent-input"
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
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="suretyLastName"
                                                                floatingLabel="Last Name"
                                                                className="transparent-input"
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
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="relation"
                                                                className="transparent-input"
                                                                floatingLabel="Relationship with Student"
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
                                                        <CCol className="text-start" >
                                                            <div >Permanent Address:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                                        </CCol>
                                                    </CRow>

                                                    <CRow >
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="address"
                                                                className="transparent-input"
                                                                value={values.address}
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
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="city"
                                                                className="transparent-input"
                                                                value={values.city}
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
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="state"
                                                                className="transparent-input"
                                                                value={values.state}
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
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                id="floatingInput"
                                                                name="country"
                                                                className="transparent-input"
                                                                value={values.country}
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
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="pincode"
                                                                floatingLabel="Pincode"
                                                                className="transparent-input"
                                                                value={values.pincode}
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
                                                    <CRow className="mb-2">

                                                    </CRow>

                                                    <CRow>
                                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">

                                                            <CButton
                                                                id='cancel'
                                                                type="reset"
                                                                color="danger"
                                                            //onClick={handlePrevious}
                                                            >
                                                                Cancel
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

export default EducationalLoan
