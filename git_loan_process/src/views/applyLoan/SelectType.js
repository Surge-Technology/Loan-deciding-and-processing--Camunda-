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
} from '@coreui/react'
import { Container } from '@mui/material'

const SelectType = () => {

    const params = useParams();
    const navigate = useNavigate();


    // const handleInputChange = (e) => {
    //     const { name, value } = e.target
    //     setState((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }))
    // }


    // const handlePrevious = (e) => {
    //     navigate(`/applyLoan/loanDetails/${params.id}`)
    // }

    const handleApplyHomeLoan = (loanType) => {

        navigate("/checkCustomer")
    }
    const handleApplyLoan = (loanType) => {
        let type={
loan:loanType
        }
console.log(type,"loan Type>>>>>>>>>");

        axios.post('http://localhost:8080/SelectLoanType',type)
          .then((response) => {
            
            if (response.status !== 200) {
              throw new Error('Network response was not ok');
            }
            return response.data; // Axios responses already return JSON data in the 'data' property
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error('There was a problem with the fetch operation:', error.message);
          });
      }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <CRow>
                <CCol md={12} className=" text-center">
                    <h4><strong>Select Loan Type</strong></h4>
                </CCol>
            </CRow>
            <Container className="d-flex justify-content-center align-items-center mt-3">

                <CRow xs={{ gutter: 3 }}>
                    <CCol md={4} className="ml-6 mr-6 mr-7 mb-4 text-end">
                        <div className="mx-3" style={{ padding: '3px 3px', listStyle: 'none' }}>
                            <CNavItem >
                                <CNavLink to={`/checkCustomer`} as={NavLink}>
                                    <CCardImage
                                        className="rounded-rectangle shadow-sm hover-zoom"
                                        src="\src\assets\images\hmloan.jpg"
                                        onClick={() => handleApplyHomeLoan('home')}

                                        //onClick={navigate(`/loanTypes/homeLoan/${params.id}`)}
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            padding: '3px 3px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                        }
                                        }
                                    ></CCardImage>
                                </CNavLink>
                            </CNavItem>
                        </div>
                    </CCol>
                    <CCol md={4} className="ml-6 mr-6 mr-7 mb-4 text-center">
                        <div className="mx-3 " style={{ padding: '3px 3px', listStyle: 'none' }}>
                            <CNavItem >
                            {/*                                <CNavLink to={`/loanTypes/personalLoan/${params.id}`} as={NavLink}>
                                */}
                                 <CNavLink to={`/checkCustomer`} as={NavLink}>

                                 <CCardImage
                                        className="rounded-rectangle shadow-sm hover-zoom"
                                        src="\src\assets\images\personalLoan.jpg"
                                       // onClick={navigate(`/loanTypes/personalLoan/${params.id}`)}
                                       onClick={() => handleApplyLoan('personalLoan')}
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            padding: '3px 3px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                        }
                                        }
                                    ></CCardImage>
                                </CNavLink>
                            </CNavItem>
                        </div>
                    </CCol>
                    <CCol md={4} className="ml-6 mr-6 mr-7 mb-4 text-start">
                        <div className="mx-3" style={{ padding: '3px 3px', listStyle: 'none' }}>
                            <CNavItem >
                            <CNavLink to={`/checkCustomer`} as={NavLink}>

                                {/*  <CNavLink to={`/loanTypes/educationalLoan/${params.id}`} as={NavLink}>*/}
                                    <CCardImage
                                        className="rounded-rectangle shadow-sm hover-zoom"
                                        src="\src\assets\images\eduloanpic.jpg"
                                        //onClick={navigate(`/loanTypes/educationalLoan/${params.id}`)}
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            padding: '3px 3px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                        }
                                        }
                                    ></CCardImage>
                                </CNavLink>
                            </CNavItem>
                        </div>
                    </CCol>
                
                    <CCol md={6}  className="ml-6 mr-6 mr-7 mb-4 text-end">
                        <div className="mx-3" style={{ padding: '3px 3px', listStyle: 'none' }}>
                            <CNavItem >
                            <CNavLink to={`/checkCustomer`} as={NavLink}>

                                {/*  <CNavLink to={`/loanTypes/vehicalLoan/${params.id}`} as={NavLink}>*/}
                                    <CCardImage
                                        className="rounded-rectangle shadow-sm hover-zoom"
                                        src="\src\assets\images\vehicle-loan.png"
                                        //onClick={navigate(`/loanTypes/vehicalLoan/${params.id}`)}
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            padding: '3px 3px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                        }
                                        }
                                    ></CCardImage>
                                </CNavLink>
                            </CNavItem>
                        </div>
                    </CCol>
                    <CCol md={6} className="ml-6 mr-6 mr-7 mb-4">
                        <div className="mx-3 " style={{ padding: '3px 3px', listStyle: 'none' }}>
                            <CNavItem >
                            <CNavLink to={`/checkCustomer`} as={NavLink}>

                               {/*   <CNavLink to={`/loanTypes/mortageLoan/${params.id}`} as={NavLink}>*/}
                                    <CCardImage
                                        className="rounded-rectangle shadow-sm hover-zoom"
                                        src="\src\assets\images\mortage.jpg"
                                        //onClick={navigate(`/loanTypes/mortageLoan/${params.id}`)}
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            padding: '3px 3px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                        }
                                        }
                                    ></CCardImage>
                                </CNavLink>
                            </CNavItem>
                        </div>
                    </CCol>
                </CRow>
            </Container >
        </>
    )
}

export default SelectType
