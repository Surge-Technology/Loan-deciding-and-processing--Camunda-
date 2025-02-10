/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { FaArrowLeft, FaUpload, FaUndo } from 'react-icons/fa'
import { CButton } from '@coreui/react' // Assuming you're using CoreUI for CButton
import '../css/customerForm.css'
import '../css/loanApproval.css'
import '../css/LoanApplicationForm.css'
import { saveAs } from 'file-saver';

import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import { Download } from '@mui/icons-material'
import { FaDownload } from 'react-icons/fa';
const LoanApplicationForm = () => {
  const [loanStatus, setLoanStatus] = useState('')
  const [creditScore, setCreditScore] = useState('')
  const [incomeVerificationStatus, setIncomeVerificationStatus] = useState('')
  const [collateralStatus, setCollateralStatus] = useState('')
  const [riskAssessment, setRiskAssessment] = useState('')
  const [approvalStage, setApprovalStage] = useState({
    loanOfficerReview: false,
    underwriter: false,
    legalReview: false,
    finalApproval: false,
  })

  const [underwriterDecision, setUnderwriterDecision] = useState('')
  const [legalReviewStatus, setLegalReviewStatus] = useState('')
  const [finalDecision, setFinalDecision] = useState('')
  const [notes, setNotes] = useState('')
  const [isCustomerDataAvailable, setIsCustomerDataAvailable] = useState(false) // Placeholder for your actual state
  // const [formik, setFormik] = useState({
  //  handleSubmit: () => {
  //   e.preventDefault(e);
  //   const dataToSubmit = { loanStatus, creditScore, notes };
  //   console.log("Submitted Data:", dataToSubmit);
  //   setFormData(dataToSubmit);
  //   }
  //  }); // Placeholder for form submission
  const URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate()
  const handleCheckboxChange = (event) => {
    setApprovalStage({
      ...approvalStage,
      [event.target.name]: event.target.checked,
    })
  }

  const handleRadioChange = (setter) => (event) => {
    setter(event.target.value)
  }

  const handleLoadData = () => {
    const data = {
      loanStatus: 'pending',
      creditScore: 'good',
      notes: 'This is a preloaded note.',
    }
    setLoanStatus(data.loanStatus)
    setCreditScore(data.creditScore)
    setNotes(data.notes)
  }

  const handleReset = () => {
    setLoanStatus('')
    setCreditScore('')
    setNotes('')
  }

  const handlePrevious = () => {
    navigate(-1)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSubmit = { loanStatus, creditScore, notes }
    console.log('Submitted Data:', dataToSubmit)
    setFormData(dataToSubmit)
  }
  const [showClarificationInput, setShowClarificationInput] = useState(false)
  const [downloadFiles, setDownloadFiles] = useState([])
  // const handleFileDownload = async (fileName, fileData) => {
  //   try {
  //     const blob = new Blob([fileData], { type: 'application/octet-stream' });
  
  //     // Automatically trigger download with FileSaver.js
  //     saveAs(blob, fileName);
  //   } catch (error) {
  //     console.error('Error downloading the file:', error);
  //   }
  // };
  // useEffect(() => {
  //   const fetchDownloadFiles = async (emailId) => {
  //     try {
  //       // API endpoint with dynamic emailId
  //       const response = await fetch(`http://localhost:8080/getJsonDataByEmail?emailId=${emailId}`);
  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status}`);
  //       }

  //       const data = await response.json();

  //       // Extracting only the `Files` part from the response
  //       const filesData = data.Files;

  //       // Log or return the files data
  //       console.log(filesData);
  //       return filesData;
  //     } catch (error) {
  //       console.error("Error fetching files data:", error);
  //       return null;
  //     }
  //   };

  //   fetchDownloadFiles();
  // }, []);
  // const handleDownloadAll = () => {
  //   // Iterate over the files and trigger the download for each file
  //   downloadFiles.forEach((file) => {
  //     handleFileDownload(file);
  //   });
  // };
  // const handleFileDownload = (fileName) => {
  //   const fileUrl = `http://localhost:8080/api/download/${fileName}`; // Adjust the API endpoint for downloading
  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.download = fileName;
  //   link.click();
  // };

  const formik = useFormik({
    initialValues: {
      loanStatus: '',
      creditScore: '',
      incomeVerificationStatus: '',
      collateralStatus: '',
      riskAssessment: '',
      approvalStage: {
        loanOfficerReview: false,
        underwriter: false,
        legalReview: false,
        finalApproval: false,
      },
      underwriterDecision: '',
      legalReviewStatus: '',
      finalDecision: '',

      clarificationDetails: '',
      notes: '',
      // isCustomerDataAvailable: false,
    },

    onSubmit: async (values) => {
      if (values.finalDecision === 'approved') {
        sessionStorage.setItem('finalDecision', values.finalDecision)

        navigate('/LoanDisbursementForm')
      } else {
        const formData = {
          finalDecision: values.finalDecision,
          clarificationDetails:
            values.finalDecision === 'needClarification' ? values.clarificationDetails : '',
        }

        try {
          const response = await axios.post(`${URL}/loanApproval`, formData)
          console.log('API Response:', response)
          response
          navigate('/taskInbox')
        } catch (error) {
          console.error('Error during API submission:', error)
        }
      }
    },
  })
  const [fileName, setFileName] = useState('')
  const [message, setMessage] = useState('Click here to download file')
  const [fileMetadata, setFileMetadata] = useState([]);

  const [emailId, setEmailId] = useState(null)
  const handleDownload = async () => {
    try {
      // First API Call: Get the email ID
      const emailResponse = await fetch(`${URL}/getEmail`, {
        method: 'GET',
      })

      if (!emailResponse.ok) {
        console.error('Failed to fetch email:', emailResponse.statusText)
        return
      }

      const emailId = await emailResponse.text() // Assuming the response is plain text
      console.log('Email ID:', emailId)

      // Second API Call: Use email ID as a parameter
      const downloadResponse = await fetch(
        `${URL}/downloadEmail?emailId=${emailId}`,
        {
          method: 'GET',
        },
      )
      if (downloadFiles) {
        setTimeout(() => {
          setMessage('Files downloaded'); // Update the message after download
        }, 1000);
  
        // Using Axios to make the file metadata request
        try {
          const metadataResponse = await axios.get(
            `${URL}/fileMetadata?emailId=${emailId}`,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Set the header for multipart/form-data
              },
            }
          );
  
          // Check if the response is successful
          if (metadataResponse.status === 200) {
            const metadata = metadataResponse.data; // Assuming the response is JSON
            setFileMetadata(metadata); // Store file metadata to render
          } else {
            console.error('Failed to fetch file metadata:', metadataResponse.statusText);
          }
  
        } catch (error) {
          console.error('Error fetching file metadata:', error);
        }
      } else {
        console.error('Failed to download file:', downloadResponse.statusText);
        return;
      }
    } catch (error) {
      console.error('Error in API calls:', error);
    }
  }

  const handleFileDownload = async (fileId) => {
    try {
      const response = await axios.get(`${URL}/download/${fileId}`, {
        responseType: 'blob', // Important to handle binary file responses
      });
  
      // Extract the file name from the response or metadata if necessary
      const fileName = `file_${fileId}.png`; // This can be dynamic, use the response or metadata to set it
  
      // Use saveAs function to trigger download
      saveAs(response.data, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the file");
    }
  };
  
  // Inside your map function
  {fileMetadata.map(file => (
    <div key={file.fileId}>
      <Button onClick={() => handleDownload(file.fileId)}>Download</Button>
    </div>
  ))}
  
  return (
    <div className="container mt-4">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="form-title mb-4 mx-auto text-center">Loan Approval</h2>

          <Box textAlign="center" p={3}>
            <IconButton color="secondary" onClick={handleDownload}>
              <Download />
            </IconButton>
            <Typography variant="body1" mt={2}>
            {message && <div>{message}</div>}            </Typography>
            
          </Box>
          <div className="file-metadata-container">
      {fileMetadata.map((file, index) => (
        <div key={index} className="file-item">
          <span className="file-info">
            <strong>Category:</strong> {file.documentCategory} <br />
            <strong>File Name:</strong> {file.fileName}
          </span>
          <div className="download-btn">
            <FaDownload
              onClick={() => handleFileDownload(file.fileId)} // Example: handle based on fileName or fileId
              title={`Download ${file.fileName}`}
              className="download-icon"
            />
          </div>
        </div>
      ))}
    </div>
    

        </div>
        <form onSubmit={formik.handleSubmit} id="myForm">
          {/* Loan Status */}

          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4 pl-4">
                <InputLabel className="custom-label pl-8">Loan Status</InputLabel>
              </div>
              <div className="col-md-6">
                <RadioGroup
                  name="loanStatus"
                  className="radio-group"
                  value={formik.values.loanStatus}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="pending"
                    control={<Radio />}
                    label="Pending"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="approved"
                    control={<Radio />}
                    label="Approve"
                  />
                  <FormControlLabel
                    value="rejected"
                    className="radio-label-spacing"
                    control={<Radio />}
                    label="Reject"
                  />
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Credit Score */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <InputLabel className="custom-label">Credit Score</InputLabel>
              </div>
              <div className="col-md-4">
                <RadioGroup
                  name="creditScore"
                  className="radio-group"
                  value={formik.values.creditScore}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="good"
                    control={<Radio />}
                    label="Good"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="fair"
                    control={<Radio />}
                    label="Fair"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="poor"
                    control={<Radio />}
                    label="Poor"
                  />
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Income Verification Status */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <InputLabel className="custom-label">Income Verification Status</InputLabel>
              </div>
              <div className="col-md-4">
                <RadioGroup
                  name="incomeVerificationStatus"
                  className="radio-group"
                  value={formik.values.incomeVerificationStatus}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="pending"
                    control={<Radio />}
                    label="Pending"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="verified"
                    control={<Radio />}
                    label="Verified"
                  />
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Collateral Status */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <InputLabel className="custom-label">Collateral Status</InputLabel>
              </div>
              <div className="col-md-6">
                <RadioGroup
                  name="collateralStatus"
                  className="radio-group"
                  value={formik.values.collateralStatus}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="approve"
                    control={<Radio />}
                    label="Approve"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="pending"
                    control={<Radio />}
                    label="Pending"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="notApplicable"
                    control={<Radio />}
                    label="Not Applicable"
                  />
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <InputLabel className="custom-label">Risk Assessment</InputLabel>
              </div>
              <div className="col-md-6">
                <RadioGroup
                  name="riskAssessment"
                  className="radio-group"
                  value={formik.values.riskAssessment}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="low"
                    control={<Radio />}
                    label="Low"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="medium"
                    control={<Radio />}
                    label="Medium"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="high"
                    control={<Radio />}
                    label="High"
                  />
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Approval Stage (Checkbox) */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <Typography className="custom-label">Approval Stage</Typography>
              </div>
              <div className="col-md-6">
                <FormGroup row>
                  <FormControlLabel
                    className="radio-group"
                    control={
                      <Checkbox
                        checked={formik.values.approvalStage.loanOfficerReview}
                        onChange={formik.handleChange}
                        name="approvalStage.loanOfficerReview"
                      />
                    }
                    label="Loan Officer Review"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.approvalStage.underwriter}
                        onChange={formik.handleChange}
                        name="approvalStage.underwriter"
                      />
                    }
                    label="Underwriter"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.approvalStage.legalReview}
                        onChange={formik.handleChange}
                        name="approvalStage.legalReview"
                      />
                    }
                    label="Legal Review"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.approvalStage.finalApproval}
                        onChange={formik.handleChange}
                        name="approvalStage.finalApproval"
                      />
                    }
                    label="Final Approval"
                  />
                </FormGroup>
              </div>
            </div>
          </div>

          {/* Underwriter Decision */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <InputLabel className="custom-label">Underwriter Decision</InputLabel>
              </div>
              <div className="col-md-6">
                <RadioGroup
                  name="underwriterDecision"
                  className="radio-group"
                  value={formik.values.underwriterDecision}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="approve"
                    control={<Radio />}
                    label="Approve"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="reject"
                    control={<Radio />}
                    label="Reject"
                  />
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Legal Review Status */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <InputLabel className="custom-label">Legal Review Status</InputLabel>
              </div>
              <div className="col-md-6">
                <RadioGroup
                  name="legalReviewStatus"
                  className="radio-group"
                  value={formik.values.legalReviewStatus}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="complete"
                    control={<Radio />}
                    label="Complete"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="pending"
                    control={<Radio />}
                    label="Pending"
                  />
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Final Decision */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <InputLabel className="custom-label">Final Decision</InputLabel>
              </div>
              <div className="col-md-6">
                <RadioGroup
                  name="finalDecision"
                  className="radio-group"
                  value={formik.values.finalDecision}
                  onChange={(event) => {
                    formik.handleChange(event) // Update Formik's value
                    if (event.target.value === 'needClarification') {
                      setShowClarificationInput(true) // Show clarification input field
                    } else {
                      setShowClarificationInput(false) // Hide clarification input field
                    }
                  }}
                  row
                >
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="approved"
                    control={<Radio />}
                    label="Approve"
                  />
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="rejected"
                    control={<Radio />}
                    label="Reject"
                  />{' '}
                  <FormControlLabel
                    className="radio-label-spacing"
                    value="needClarification"
                    control={<Radio />}
                    label="Need Clarification"
                  />
                </RadioGroup>
                {showClarificationInput && (
                  <div className="clarification-input mt-3">
                    <InputLabel className="custom-label">Clarification Details</InputLabel>
                    <TextField
                      name="clarificationDetails"
                      value={formik.values.clarificationDetails}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section mt-4 custom-form-section">
            <div className="row mt-3">
              <div className="col-md-4">
                <InputLabel className="custom-label">Notes</InputLabel>
              </div>
              <div className="col-md-6">
                <TextField
                  className="radio-label-spacing"
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            {/* Cancel Button */}
            <Button
              variant="contained" // Solid style
              color="error"
              type="button"
              onClick={() => formik.resetForm()} // Resets form to initial values
            >
              Cancel
            </Button>

            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={formik.isSubmitting} // Disables the button while submitting
            >
              Submit
              {/*  {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Next'}*/}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoanApplicationForm
