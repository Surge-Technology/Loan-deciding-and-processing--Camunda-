/* eslint-disable prettier/prettier */

import { CButton, CFormLabel, CFormSelect } from '@coreui/react'
import { Input } from '@mui/material'
import axios from 'axios'
import { ErrorMessage, Form, Formik } from 'formik'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { PropaneSharp } from '@mui/icons-material'
import { version } from 'core-js'

const TransactionPopUp = ({ transactionDetails, onClose, onSuccess }) => {
    console.log("transactionDetails in Popup");

    const data = {
        loanId: "",
        uanId: "",
        transactionStatus: "",
        date: "",
        loanAccountNumber: "",
        loanAmount: "",
        paymentMethod: "",
        transactionAmount: "",
        balanceAmount: "",
        email: "",
        version: ""
    }
    const [loanId, setTransactionData] = useState(transactionDetails.loanId);
    const [loader, setLoader] = useState(false);
    const [state, setState] = useState(data);

    const nav = useNavigate();

    console.log("transctionDetails", transactionDetails);

    useEffect(() => {
        setLoader(true);
        axios.get(`http://localhost:8080/loanTransaction/loanId/${loanId}`)
            .then((res) => {
                setLoader(false);
                console.log("API Response:", res.data);
                setState({
                    loanId: res.data.loanId,
                    uanId: res.data.uanId,
                    transactionStatus: res.data.transactionStatus,
                    date: res.data.date,
                    loanAccountNumber: res.data.loanAccountNumber,
                    loanAmount: res.data.loanAmount,
                    paymentMethod: res.data.paymentMethod,
                    transactionAmount: res.data.transactionAmount,
                    balanceAmount: res.data.balanceAmount,
                    email: res.data.email,
                    version: res.data.version
                })
            })
            .catch((err) => {
                console.error("Error getting transaction Details:", err);
            });
    }, [loanId])

    const handleDownload = () => {
        axios.get(`http://localhost:8080/loanTransaction/download/loanId/${loanId}`, {
            responseType: 'blob', // Ensure response is treated as a file
        })
            .then((res) => {
                console.log(res);

                // Create a Blob URL to download the file
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Repayment_Schedule.pdf');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Successfully downloaded report',
                    showConfirmButton: true,
                });
            })
            .catch((err) => {
                console.error('Error downloading report:', err);
                Swal.fire('Error occurred. Please try again later.', '', 'error');
            });
    }


    return (
        <>

            {/* ✅ Applicant & Loan Details Section */}
            <Row className="mb-3">
                <Col md={6}>
                    <CFormLabel>UAN Id:</CFormLabel>
                    <Input type="text" value={state.uanId || ''} readOnly fullWidth />
                </Col>
                <Col md={6}>
                    <CFormLabel>Account Number:</CFormLabel>
                    <Input type="text" value={state.loanAccountNumber || ''} readOnly fullWidth />
                </Col>
            </Row>


            <Row className="mb-3">
                <Col md={6}>
                    <CFormLabel>Loan Amount:</CFormLabel>
                    <Input type="text" value={state.loanAmount || ''} readOnly fullWidth />
                </Col>

                <Col md={6}>
                    <CFormLabel>balance Amount:</CFormLabel>
                    <Input type="text" value={state.balanceAmount || ''} readOnly fullWidth />
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <CFormLabel>Transaction Status:</CFormLabel>
                    <Input type="text" value={state.transactionStatus || ''} readOnly fullWidth />
                </Col>
                <Col md={6}>
                    <CFormLabel>Transaction Amount:</CFormLabel>
                    <Input type="text" value={state.transactionAmount || ''} readOnly fullWidth />
                </Col>


            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <CFormLabel>Payment Method:</CFormLabel>
                    <Input type="text" value={state.paymentMethod || ''} readOnly fullWidth />
                </Col>
                <Col md={6}>
                    <CFormLabel>Email:</CFormLabel>
                    <Input type="text" value={state.email || ''} readOnly fullWidth />
                </Col>

            </Row>


            {/* ✅ Action Buttons */}
            <div className="text-center mt-3">
                <CButton color="danger" className="me-3" onClick={onClose}>
                    Cancel
                </CButton>
                <CButton type="submit" color="primary" onClick={handleDownload}>
                    Download PDF
                </CButton>
            </div>
        </>
    )
}



export default TransactionPopUp
