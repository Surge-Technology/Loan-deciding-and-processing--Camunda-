/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup' // Import Yup for validation
import moment from 'moment'
import axios from 'axios'
import Swal from 'sweetalert2'
import './dashboard.css'
import { NavLink, useParams } from 'react-router-dom'
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
    CNavItem,
    CNavLink,
    CCardImageOverlay,
    CCardText,
} from '@coreui/react'
import { Container } from '@mui/material'
import BasicDetails from './BasicDetails'
import FinancialDetails from './FinancialDetails'

const ReviewPage = () => {

    const [state, setState] = useState({
        BasicDetails: {
            customerId: '',
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
        },
        FinancialDetails: {
            financeId: '',
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
        },
        LoanDetails: {
            loanId: '',
            loanAmount: '',
            loanpurpose: '',
            payemntPlan: '',
            emiAmount: '',
            interest: '',
            suretyFirstName: '',
            suretyLastName: '',
            relation: '',
        },
        loanType: {
            loanType: '',
            homeLoanId: '',
            panNumber: '',
            aadharNumber: '',
            purpose: '',
            // creditScore: '',
            existingLoans: '',
            areaOfLand: '',
            builtArea: '',
            landCost: '',
            costOfExpense: '',
            city: '',
            state: '',
            country: '',
            address: '',
            pincode: '',
        }
       

    })

    const params = useParams();
    const navigate = useNavigate();
    const [loanType, setLoanType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [homeLoanId, setHomeLoanId] = useState('')

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


    // const handlePrevious = (e) => {
    //     navigate(`/applyLoan/loanDetails/${params.id}`)
    // }

    const SubmitData = (values) => {
        let payload = {
            ...values,
            BasicDetails: {
                customerId: Number(state.customerId),
                firstName: state.firstName,
                lastName: state.lastName,
                dob: String(moment(values.birthDate).format('MM-DD-YYYY')),
                nationality: state.nationality,
                gender: state.gender,
                maritalStatus: state.maritalStatus,
                phone: state.phone,
                email: state.email,
                address: state.address,
                city: state.city,
                state: state.state,
                country: state.country,
                pincode: state.pincode,
                occupation: state.occupation,
                annualIncome: state.annualIncome,
            },
            FinancialDetails: {
                financeId: Number(state.financeId),
                company: state.company,
                employmentType: state.employmentType,
                designation: state.designation,
                dateOfJoining: String(moment(values.dateOfJoining).format('MM-DD-YYYY')),
                experience: state.experience,
                contactPerson: state.contactPerson,
                contactNumber: state.contactNumber,
                salary: state.salary,
                annualIncome: state.annualIncome,
                bankName: state.bankName,
                bankBranch: state.bankBranch,
                accountNumber: state.accountNumber,
                ifscCode: state.ifscCode,
                workaddress: state.address,
                workcity: state.city,
                workstate: state.state,
                workcountry: state.country,
                workpincode: state.pincode,
            },
            LoanDetails: {
                loanType: state.loanType,
                loanId: state.loanId,
                loanAmount: state.loanAmount,
                loanpurpose: state.loanpurpose,
                payemntPlan: state.payemntPlan,
                emiAmount: state.emiAmount,
                interest: state.interest,
                suretyFirstName: state.suretyFirstName,
                suretyLastName: state.suretyLastName,
                relation: state.relation,
            },
            HomeLoanDetails:{
                panNumber:state.panNumber,
                aadharNumber:state.aadharNumber,
                purpose:state.purpose,
                existingLoans:state.existingLoans,
                areaOfLand:state.areaOfLand,
                builtArea:state.builtArea,
                landCost:state.landCost,
                costOfExpense:state.costOfExpense,
                    city: state.city,
                    state: state.state,
                    country: state.country,
                    address: state.address,
                    pincode: state.pincode,
            }
        }
        console.log('Payload that will be submitted is :', payload)

        // if (isSubmitting) return;
        // setIsSubmitting(true);
        // console.log("entered...", params.id, payload);
        //     axios.post(`http://localhost:8080/claimAndCompleteTask`, payload)
        //         // .then((res) => {
        //         //     console.log('response from backend ', res);
        //         //     Swal.fire('Success', 'Customer created successfully', 'success');
        //         // })

        //         .then((res) => {
        //             console.log('response from backend ', res)

        //             // Show success alert
        //             Swal.fire({
        //                 title: 'Success',
        //                 text: 'Account created successfully',
        //                 icon: 'success',
        //                 confirmButtonText: 'OK',
        //             }).then(() => {
        //                 navigate('/home');
        //                 // Clear form after the OK button is clicked
        //                 //   document.getElementById('myForm').reset();
        //             })
        //         })

        //         .catch((err) => {
        //             console.error('Error sending data:', err.response ? err.response.data : err.message)
        //             Swal.fire('Error', 'Please try again', 'error')
        //         })
        // }
    }

    const getBasicDetails = () => {
        axios.get(`http://localhost:8080/getCustomerDetails/${params.id}`).then((res) => {
            console.log("response from background ###########" + res.data);
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

    const getFinancialDetails = () => {
        axios.get(`http://localhost:8080/getFinancialDetailsByCustomerId/${params.id}`).then((res) => {
            console.log("response from background ###########" + res.data);
            let financialDetails = res.data[0];
            console.log("financialDetails-------", financialDetails);
            console.log(JSON.stringify(res.data[0].company), JSON.stringify(res.data[0].designation), JSON.stringify(res.data[0].employmentType));
            console.log("financialDetails.company", financialDetails.company, financialDetails.employmentType);
            //setFinanceId(financialDetails.financeId);
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

    const getLoanDetails = () => {
        axios.get(`http://localhost:8080/getLoanDetailsByCustomerId/${params.id}`).then((res) => {
            console.log("response from background ###########" + res.data);
            let loanDetails = res.data[0];
            console.log("loanDetails-------", loanDetails);
            console.log(JSON.stringify(res.data[0].company), JSON.stringify(res.data[0].designation), JSON.stringify(res.data[0].employmentType));
            console.log("loanDetails.loanId", loanDetails.loanId, loanDetails.loanAmount);
            //setLoanId(loanDetails.loanId);
            setState((prevState) => ({
                ...prevState,
                loanId: loanDetails.loanId,
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
    const gethomeLoanDetails = () => {
        // axios.get(`http://localhost:8080/getHomeLoanDetailsByCustomerId/${params.id}`).then((res) => {
        //     console.log("response from background ###########" + res.data);
        //     let loanDetails = res.data[0];
        //     console.log("loanDetails-------", loanDetails);
        //     console.log(JSON.stringify(res.data[0].company), JSON.stringify(res.data[0].designation), JSON.stringify(res.data[0].employmentType));
        //     console.log("loanDetails.loanId", loanDetails.loanId, loanDetails.loanAmount);
        //     //setLoanId(loanDetails.loanId);
        //     setState((prevState) => ({
        //         ...prevState,
        //         loanId: loanDetails.loanId,
        //         loanAmount: loanDetails.loanAmount,
        //         loanpurpose: loanDetails.loanpurpose,
        //         payemntPlan: loanDetails.payemntPlan,
        //         emiAmount: loanDetails.emiAmount,
        //         interest: loanDetails.interest,
        //         suretyFirstName: loanDetails.suretyFirstName,
        //         suretyLastName: loanDetails.suretyLastName,
        //         relation: loanDetails.relation,
        //     })
        //     )
        // }).catch(err => {
        //     console.error("Error sending data:", err.response ? err.response.data : err.message);
        //     setState((prevState) => ({ ...prevState }));

        //     Swal.fire(
        //         err.response.data.message,
        //         'Please try again '
        //     )
        // })
        axios.get(`http://localhost:8080/getHomeLoanDetailsByCustomerId/${params.id}`)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const homeLoanDetails = res.data[0];
            setHomeLoanId(homeLoanDetails.homeLoanId);
            setState(homeLoanDetails);
            console.log('Fetched existing home loan details:', homeLoanDetails);
          } else {
            console.log('No existing loan found, ready for new submission');
          }
        })
        .catch((err) => {
          console.error('Error fetching home loan data:', err.response ? err.response.data : err.message);
          Swal.fire('Error', 'Unable to fetch existing loan data. Please try again.', 'error');
        });
    }
    useEffect(() => {
        window.scrollTo(0, 0);
        getBasicDetails();
        getFinancialDetails();
        getLoanDetails();
        gethomeLoanDetails();

    }, [])

    return (
        <>
            <div >
                <CRow className="mb=2 mt=2">
                    <CCol md={12} className="text-center mb-2 mt-3">
                        <h3><strong>Loan Application</strong></h3>
                    </CCol>
                </CRow>
            </div>

            <Container className="mb=2 md=2 d-flex justify-content-center align-items-center mt-8"
                style={{ width: '100%', maxWidth: '2048px' }} >

                <CCard className="mb-3"
                    style={{
                        width: '100%',
                        maxWidth: '2048px',
                        backgroundImage: `url(src/assets/images/loanImg.jpg)`,
                        backgroundSize: 'cover',      // Ensures the image covers the entire card
                        backgroundPosition: 'start', // Centers the background image
                        height: '100%',             // Set a height for the card to match the image
                    }}>
                    <CCardBody>
                        <CCardTitle className='mb-2 mt-2'> <strong><em>Basic Customer Details:</em></strong> </CCardTitle>
                        <Formik
                            initialValues={state}
                            //validationSchema={params.id == "new" ? validationSchema : null} // Use the validation schema
                            onSubmit={SubmitData}
                        >
                            {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
                                <Form id="myForm" onSubmit={handleSubmit}>
                                    <CRow>
                                        <CCol className="text-start" >
                                            <div style={{ color: 'black' }}>Personal Details:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                        </CCol>
                                    </CRow>
                                    <CRow xs={{ gutter: 2 }}>
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="firstName"
                                                floatingLabel="First Name"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="lastName"
                                                floatingLabel="Last Name"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            {params.id == "new" ?
                                                <>
                                                    <CFormInput
                                                        type="date"
                                                        name="birthDate"
                                                        floatingLabel="DOB"
                                                        className='transparent-input'
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
                                                        className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="nationality"
                                                floatingLabel="Nationality"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormSelect
                                                name="gender"
                                                floatingLabel="Gender"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormSelect
                                                name="maritalStatus"
                                                floatingLabel="Marital Status"
                                                className='transparent-input'
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
                                    <CRow className=" mt-2">
                                        <CCol className="text-start" >
                                            <div style={{ color: 'black' }}>Contact Details:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                        </CCol>
                                    </CRow>
                                    <CRow xs={{ gutter: 2 }} >
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="phone"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="email"
                                                className='transparent-input'
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
                                            <div style={{ color: 'black' }}>Address:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="address"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="city"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="state"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="country"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="pincode"
                                                className='transparent-input'
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
                                            <div style={{ color: 'black' }}>Employment Details:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="occupation"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="annualIncome"
                                                className='transparent-input'
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
                                    <CCardTitle className="mb-2 mt-3" style={{ color: 'black' }}>
                                        <strong><em>Financial Details:</em></strong> </CCardTitle>
                                    <CRow>
                                        <CCol className="text-start dark-label"  >
                                            <div style={{ color: 'black' }}>Employment Information:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="company"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormSelect
                                                name="employmentType"
                                                floatingLabel="Select the type of employment"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="designation"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="date"
                                                name="dateOfJoining"
                                                className='transparent-input'
                                                floatingLabel="Date of joining"
                                                value={state.birthDate ? new Date(state.birthDate).toISOString().split('T')[0] : ""}
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
                                        <CCol className='dar-label'>
                                            <CFormInput
                                                type="number"
                                                name="experience"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="contactPerson"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="contactNumber"
                                                className='transparent-input'
                                                value={state.contactnumber}
                                                floatingClassName="mb-2"
                                                floatingLabel="Contact Number"
                                                placeholder="Contact Number"
                                                onChange={handleInputChange}
                                                onChangeCapture={handleChange}
                                                onBlur={handleBlur}
                                                invalid={touched.contactNumber && !!errors.contactNumber}
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
                                            <div style={{ color: 'black' }}>Financial Information:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-2 mt-2">
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="salary"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="annualIncome"
                                                className='transparent-input'
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
                                            <div style={{ color: 'black' }}>Bank Details:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                        </CCol>
                                    </CRow >
                                    <CRow xs={{ gutter: 2 }} >
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="bankName"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="bankBranch"
                                                floatingLabel="Bank Branch"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="accountNumber"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="ifscCode"
                                                className='transparent-input'
                                                floatingLabel="IFSC Number"
                                                value={state.ifscCode}
                                                onChange={handleInputChange}
                                                onChangeCapture={handleChange}
                                                onBlur={handleBlur}
                                                invalid={touched.ifscCode && !!errors.ifscCode}
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
                                            <div style={{ color: 'black' }} >Work Address:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                        </CCol>
                                    </CRow>
                                    <CRow>
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="workaddress"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="workcity"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="workstate"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                id="floatingInput"
                                                name="workcountry"
                                                className='transparent-input'
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
                                        <CCol className='dark-label'>
                                            <CFormInput
                                                type="text"
                                                name="workpincode"
                                                className='transparent-input'
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
                                    <CCardTitle className="mb-2 mt-3" style={{ color: 'black' }}>
                                        <strong><em>Loan Details:</em></strong> </CCardTitle>
                                    <CRow>
                                        <CRow >
                                            <CCol className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    name="loanAmount"
                                                    className='transparent-input'
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
                                            <CCol className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    name="loanpurpose"
                                                    className='transparent-input'
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
                                        <CRow  >
                                            <CCol md={3} className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    name="interest"
                                                    className='transparent-input'
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
                                            <CCol md={5} className='dark-label'>
                                                <CFormSelect
                                                    name="payemntPlan"
                                                    floatingLabel="Terms (in months)"
                                                    className='transparent-input'
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
                                            <CCol md={4} className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    name="emiAmount"
                                                    className='transparent-input'
                                                    floatingLabel="EMI Amount"
                                                    value={state.emiAmount}
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
                                                <div style={{ color: 'black' }}>Surety Person Information:</div>
                                            </CCol>
                                        </CRow>
                                        <CRow >
                                            <CCol className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    name="suretyFirstName"
                                                    className='transparent-input'
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
                                            <CCol className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    name="suretyLastName"
                                                    floatingLabel="Last Name"
                                                    className='transparent-input'
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
                                                    className='transparent-input'
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
                                            <CCol className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    id="floatingInput"
                                                    name="workaddress"
                                                    className='transparent-input'
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
                                        <CCardTitle className="mb-2 mt-3" style={{ color: 'black' }}>
                                            <strong><em>Loan Type Application Form:</em></strong> </CCardTitle>
                                        {/* <CCardTitle className="mb-2 mt-3" style={{ color: 'black' }}>
                                        <strong><em>
                                            <span> {state.loanType} </span> Application Form:</em></strong> </CCardTitle> */}
                                        <CRow xs={{ gutter: 1 }}>
                                            <CCol className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    id="floatingInput"
                                                    name="loanType"
                                                    className='transparent-input'
                                                   //value={"Home Loan" || state.loanType}
                                                    value={values.loanType}
                                                    floatingClassName="mb-2"
                                                    floatingLabel="Type of Loan Selected: "
                                                    // onChange={handleInputChange}
                                                    // onChangeCapture={handleChange}
                                                    // onBlur={handleBlur}
                                                    invalid={touched.workaddress && !!errors.workaddress}
                                                    readOnly
                                                />
                                                <ErrorMessage
                                                    name="loanType"
                                                    component="div"
                                                    className="errmsg text-danger"
                                                ></ErrorMessage>
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
                                        <CRow xs={{ gutter: 2 }} className='mt-2 mb-2'>
                                            <CCol md={4} className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    name="creditScore"
                                                    floatingLabel="What is your Credit Score (CIBIL)"
                                                    className="transparent-input"
                                                    value={values.creditScore}
                                                    onChange={handleInputChange}
                                                    onChangeCapture={handleChange}
                                                    onBlur={handleBlur}
                                                    invalid={touched.creditScore && !!errors.creditScore}
                                                />
                                                <ErrorMessage
                                                    name="creditScore"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </CCol>
                                            <CCol md={8} className='dark-label'>
                                                <CFormInput
                                                    type="text"
                                                    name="existingLoans"
                                                    floatingLabel="Please mention any outstanding loans or credit card loans you currently have"
                                                    className="transparent-input"
                                                    value={values.existingLoans}
                                                    onChange={handleInputChange}
                                                    onChangeCapture={handleChange}
                                                    onBlur={handleBlur}
                                                    invalid={touched.existingLoans && !!errors.existingLoans}
                                                />
                                                <ErrorMessage
                                                    name="existingLoans"
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </CCol>
                                        </CRow>
                                        {state.loanType = "home" ?
                                            <>
                                                <CRow xs={{ gutter: 1 }} className="mb-2 mt-2">
                                                    <CCol className='dark-label'>
                                                        <CFormSelect
                                                            name="purpose"
                                                            floatingLabel="Select the purpose of home loan"
                                                            className="transparent-input"
                                                            value={values.purpose}
                                                            onChange={handleInputChange}
                                                            onChangeCapture={handleChange}
                                                            onBlur={handleBlur}
                                                            invalid={touched.purpose && !!errors.purpose}
                                                            options={[
                                                                { value: 'select', label: 'Select' },
                                                                { value: 'purchase', label: 'Purchase' },
                                                                { value: 'construction', label: 'Construction' },
                                                                { value: 'imporvement', label: 'Improvement' },
                                                                { value: 'Other', label: 'Other' },
                                                            ]}
                                                        />
                                                        <ErrorMessage name="purpose" component="div" className="text-danger" />
                                                    </CCol>
                                                </CRow>
                                            </> : null}
                                            
                                        {state.loanType = "Home Loan" || state.loanType == "Mortgage Loan" ?
                                            <>
                                            <CRow>
                                                        <CCol className="text-start" >
                                                            <div >Property Details:<span style={{ color: 'red', fontSize: '20px' }}>*</span></div>
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }}>
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="areaOfLand"
                                                                floatingLabel="Area Of Land (sq.mtrs)"
                                                                className="transparent-input"
                                                                value={values.areaOfLand}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.areaOfLand && !!errors.areaOfLand}
                                                            />
                                                            <ErrorMessage
                                                                name="areaOfLand"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="builtArea"
                                                                floatingLabel="Built-Up Area (sq.mtrs)"
                                                                className="transparent-input"
                                                                value={values.builtArea}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.builtArea && !!errors.builtArea}
                                                            />
                                                            <ErrorMessage
                                                                name="builtArea"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                                    <CRow xs={{ gutter: 2 }} className="mb-2 mt-2">
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="landCost"
                                                                floatingLabel={state.loanType = "Home Loan" ? "Cost of Land: Rs." :"Estimated value of a property: Rs." }
                                                                className="transparent-input"
                                                                value={values.landCost}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.landCost && !!errors.landCost}
                                                            />
                                                            <ErrorMessage
                                                                name="landCost"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                        <CCol className='dark-label'>
                                                            <CFormInput
                                                                type="text"
                                                                name="costOfExpense"
                                                                floatingLabel={state.loanType = "Home Loan" ? "Cost of Expenses: Rs." :"Value at which the property is bought: Rs." }
                                                                className="transparent-input"
                                                                value={values.costOfExpense}
                                                                onChange={handleInputChange}
                                                                onChangeCapture={handleChange}
                                                                onBlur={handleBlur}
                                                                invalid={touched.costOfExpense && !!errors.costOfExpense}
                                                            />
                                                            <ErrorMessage
                                                                name="costOfExpense"
                                                                component="div"
                                                                className="text-danger"
                                                            />
                                                        </CCol>
                                                    </CRow>
                                            </>: null }



                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">

                                            {/* <CButton
                                                id='cancel'
                                                type="button"
                                                color="danger"
                                                onClick={() => document.getElementById('myForm').reset()}
                                            >
                                                Cancel
                                            </CButton> */}
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
                </CCard>

            </Container >
        </>
    )
}

export default ReviewPage
