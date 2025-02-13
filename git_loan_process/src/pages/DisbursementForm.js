/* eslint-disable prettier/prettier */

import { CButton, CModal, CModalHeader, CModalBody } from '@coreui/react';
import { TextField } from '@mui/material';
import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';

const URL = import.meta.env.VITE_BASE_URL;

const DisbursementForm = ({ loanAccountNumber, loanAmount, onClose, onSuccess }) => {
  const [state, setState] = useState({
    loanAccountNumber: loanAccountNumber || '',
    applicantName: '',
    loanAmount: loanAmount || '',
    tenure: '',
    interestRate: '',
  });
  
  useEffect(() => {
    axios
      .post(`${URL}/calculateTenureInterest`, { loanAccountNumber })
      .then((res) => {
        setState({
          loanAccountNumber: res.data.loanAccountNumber,
          applicantName: res.data.applicantName,
          loanAmount: res.data.loanAmount,
          tenure: res.data.tenure,
          interestRate: res.data.interestRate,
        });
      })
      .catch((err) => {
        console.error('Error:', err);
        Swal.fire('Error', 'Failed to fetch loan details. Please try again.', 'error');
      });
  }, [loanAccountNumber]);
  const processInstance = localStorage.getItem('processId');
  console.log("process Instance id retrived",processInstance);
  
  const submitForm = () => {
    axios
      .post(`${URL}/ManagerEnd?processInstanceId=${processInstance}`, { loanAccountNumber: state.loanAccountNumber })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Disbursement Successful!',
          text: 'Loan has been successfully disbursed.',
        }).then(() => {
          onSuccess();
        });
      })
      .catch((err) => {
        Swal.fire('Error', err.response?.data?.message || 'Please try again later.', 'error');
      });
  };

  return (
    <CModal visible onClose={onClose} size="lg" centered>
      <CModalHeader className="bg-primary text-white">
        <b>Disbursement Loan Details</b>
      </CModalHeader>
      <CModalBody>
        <Card className="p-3 shadow-lg">
          <Formik initialValues={state} onSubmit={submitForm}>
            {() => (
              <Form>
                <Row className="mb-3">
                  <Col md={12}>
                    <TextField
                      label="Applicant Name"
                      variant="outlined"
                      fullWidth
                      value={state.applicantName}
                      InputProps={{ readOnly: true }}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <TextField
                      label="Loan Account Number"
                      variant="outlined"
                      fullWidth
                      value={state.loanAccountNumber}
                      InputProps={{ readOnly: true }}
                    />
                  </Col>
                  <Col md={6}>
                    <TextField
                      label="Loan Amount"
                      variant="outlined"
                      fullWidth
                      value={`₹ ${state.loanAmount}`}
                      InputProps={{ readOnly: true }}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <TextField
                      label="Tenure (Years)"
                      variant="outlined"
                      fullWidth
                      value={state.tenure}
                      InputProps={{ readOnly: true }}
                    />
                  </Col>
                  <Col md={6}>
                    <TextField
                      label="Interest Rate (%)"
                      variant="outlined"
                      fullWidth
                      value={`${state.interestRate} %`}
                      InputProps={{ readOnly: true }}
                    />
                  </Col>
                </Row>

                <div className="text-center mt-3">
                  <CButton type="button" color="danger" size="sm" className="me-2" onClick={onClose}>
                    Cancel
                  </CButton>
                  <CButton type="submit" color="primary" size="sm">
                    Approve
                  </CButton>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </CModalBody>
    </CModal>
  );
};

export default DisbursementForm;
