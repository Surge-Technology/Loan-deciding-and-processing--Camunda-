/* eslint-disable prettier/prettier */
import React, { useRef, useState } from 'react'
import { CButton, CCloseButton, CFormInput } from '@coreui/react'
import { FaArrowLeft, FaUndo, FaUpload } from 'react-icons/fa'
import { Box, Button, IconButton, Typography } from '@mui/material'
import {
  AttachFile,
  CloseRounded,
  UploadRounded,
  CloudUpload,
  RemoveCircleOutlineRounded,
  RemoveCircleOutlineSharp,
  CheckCircle,
  Close,
} from '@mui/icons-material'
import '../css/customerForm.css'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

const DocumentUpload = () => {
  const location = useLocation()
  const { personalData, employmentData, bankDetails, assetsDetail, houseHold, liabilities } =
    location.state || {}
  console.log('Full Data from Assets:', personalData)
  console.log('Received Employment Data:', employmentData)
  console.log('Received Bank Details:', bankDetails)
  console.log('Received Assets Detail:', assetsDetail)
  console.log('Received Household Detail:', houseHold)
  console.log('Received liabilitiesValue Detail:', liabilities)

  const [selectedTypes, setSelectedTypes] = useState([])
  const [otherFiles, setOtherFiles] = useState([])
  const [comments, setComments] = useState('')
  const [isCustomerDataAvailable, setIsCustomerDataAvailable] = useState(false)
  const [isFirstConsentChecked, setIsFirstConsentChecked] = useState(false)
  const [isSecondConsentChecked, setIsSecondConsentChecked] = useState(false)
  const [formData, setFormData] = useState({
    selectedTypes: [],
    comments: '',
    otherFiles: [],
    isFirstConsentChecked: false,
    isSecondConsentChecked: false,
  })

  const navigate = useNavigate()

  const handleFirstConsentChange = (event) => {
    setIsFirstConsentChecked(event.target.checked)
    setFormData((prevData) => ({
      ...prevData,
      isFirstConsentChecked: event.target.checked,
    }))
  }

  const handleSecondConsentChange = (event) => {
    setIsSecondConsentChecked(event.target.checked)
    setFormData((prevData) => ({
      ...prevData,
      isSecondConsentChecked: event.target.checked,
    }))
  }

  const [files, setFiles] = useState({
    idProof: null,
    drivingLicense: null,
    aadharCard: null,
    panCard: null,
    // taxProof: [],
  })
  //multipart

  const handleFileChange = (e, field, fieldId = null) => {
    const file = e.target.files[0]
    const fieldKey = fieldId ? `${field}-${fieldId}` : field

    if (file) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [fieldKey]: file,
      }))
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [fieldKey]: 'pending', // Mark as pending
      }))
    }
  }

  const emailId = personalData?.contactInfo?.email || ''

  const [fileData, setFileData] = useState({})
  const URL = import.meta.env.VITE_BASE_URL;
console.log("---url---",URL);

  const uploadFile = async (field, fieldId = null) => {
    const fieldKey = fieldId ? `${field}-${fieldId}` : field
    const file = files[fieldKey]

    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('documentCategory', field)
    formData.append('emailId', emailId)

    try {
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [fieldKey]: 'uploading',
      }))

      const response = await axios.post(`${URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // Log 1: After receiving the upload response
      console.log('Upload Response:', response.data)

      if (response.status === 200) {
        const fileId = response.data[0].id // Extract the ID
        console.log('Extracted file ID:', fileId)
        // Log 2: Setting the fileData state
        setFileData((prevFiles) => {
          const updatedFileData = {
            ...prevFiles,
            [fieldKey]: { ...prevFiles[fieldKey], fileId },
          }
          console.log('Updated fileData after setting ID:', updatedFileData) // Log 2
          return updatedFileData
        })

        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [fieldKey]: 'uploaded',
        }))

        console.log('Upload successful. File ID set for fieldKey:', fileId) // Additional Info
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [fieldKey]: 'error',
      }))
    }
  }

  //remove file
  const handleRemoveFile = async (field, fileKey) => {
    const file = files[field] // Retrieve the file from state
    if (!file) return
    const documentCategory = (fileKey || field).split('-')[0] // Always extract the prefix
    console.log('field:', field, 'fileKey:', documentCategory)

    const formData = new FormData()
    // formData.append("file", file);
    formData.append('documentCategory', field || documentCategory) // The category of the file
    formData.append('emailId', emailId) // Provide email ID dynamically

    try {
      // Make DELETE API call with query parameters
      const response = await axios.delete(`${URL}/delete`, {
        params: {
          // Send parameters as query string
          documentCategory: documentCategory,
          emailId: emailId, // Include additional parameters if needed
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 200) {
        // removeFile();
        Swal.fire({
          text: `${field} file removed successfully!`,
          icon: 'success',
          confirmButtonText: 'OK',
        })
        if (inputRefs.current[field]) {
          inputRefs.current[field].value = '' // Clear the input field
        }

        // Update local state to remove the file
        const updatedFiles = { ...files }
        delete updatedFiles[field]
        setFiles(updatedFiles)
        //filekey
        const updatedUploadStatus = { ...uploadStatus }
        delete updatedUploadStatus[fileKey]
        setUploadStatus(updatedUploadStatus)

        setFiles((prevFiles) => {
          const updatedFiles = { ...prevFiles }
          delete updatedFiles[fileKey] // Remove the file from state
          return updatedFiles
        })

        setUploadStatus((prevStatus) => {
          const updatedStatus = { ...prevStatus }
          updatedStatus[fileKey] = 'removed' // Update status to 'removed'
          return updatedStatus
        })
      } else {
        Swal.fire({
          title: 'Error!',
          text: `Failed to remove ${field} file. Please try again.`,
          icon: 'error',
          confirmButtonText: 'Retry',
        })
      }
    } catch (error) {
      console.error(`Error removing file ${field}:`, error)
      Swal.fire({
        title: 'Error!',
        text: `Failed to remove ${field} file. Please try again.`,
        icon: 'error',
        confirmButtonText: 'Retry',
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const emailId = personalData?.contactInfo?.email || ''
    const filesMetadata1 = formData.otherFiles.map((file, index) => ({
      name: file.name,
      fileType: file.type,
      //  fileIndex: `file_${index}`,
    }))
    const filesMetadata = ['idProof', 'drivingLicense', 'aadharCard', 'panCard', 'taxProof']
      .map((field) => {
        if (files[field]) {
          return {
            documentCategory: field,
            file: files[field], // Include the actual file object
          }
        }
        return null
      })
      .filter((file) => file !== null) // Remove null entries
    const fullData = {
      personalData,
      employmentData,
      bankDetails,
      assetsDetail,
      houseHold,
      liabilities,
      Files: {
        //   selectedTypes: formData.selectedTypes,
        //   comments: formData.comments,
        //  otherFiles: filesMetadata,
        isFirstConsentChecked: formData.isFirstConsentChecked,
        isSecondConsentChecked: formData.isSecondConsentChecked,
      },
    }

    console.log('Full Data to Submit:', fullData, emailId)
    // formDataToSubmit.append('fullData', fullData); // Add fullData as JSON string

    const sendFormData = new FormData()

    sendFormData.append('personalData', JSON.stringify(fullData.personalData))
    sendFormData.append('employmentData', JSON.stringify(fullData.employmentData))
    sendFormData.append('bankDetails', JSON.stringify(fullData.bankDetails))
    sendFormData.append('assetsDetail', JSON.stringify(fullData.assetsDetail))
    sendFormData.append('houseHold', JSON.stringify(fullData.houseHold))
    sendFormData.append('liabilities', JSON.stringify(fullData.liabilities))

    const jsonData = JSON.stringify(fullData, null, 2)

    // const blob = new Blob([jsonData], { type: 'application/json' });

    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'payload.json';

    // link.click();
    // console.log("fulldata------->1 before post:", fullData);

    const response = await axios.post(`${URL}/saveApplicantDetails`, fullData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('fullData------------1>', fullData)

    if (response.status == 200) {
      Swal.fire({
        text: 'Your account has been created successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/home')
      })
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to submit application. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry',
      })
    }

    // console.log("Form Data Submitted: ", dataToSubmit);
    // alert("Form submitted successfully!");
  }

  const handlePrevious = () => {
    navigate(-1)
  }

  const handleReset = () => {
    setSelectedTypes([])
    setOtherFiles([])
    setComments('')
    setIsFirstConsentChecked(false)
    setIsSecondConsentChecked(false)
  }

  const handleLoadData = () => {
    // Sample JSON Data (can be fetched from an API or database)
    const sampleData = {
      selectedTypes: ['Income Proof', 'Other Proof'],
      comments: 'This is a sample comment.',
      otherFiles: [{ name: 'document1.pdf' }, { name: 'document2.jpg' }],
      isFirstConsentChecked: true,
      isSecondConsentChecked: true,
    }

    // Load data into the form fields
    setFormData(sampleData)
    setSelectedTypes(sampleData.selectedTypes)
    setComments(sampleData.comments)
    setOtherFiles(sampleData.otherFiles)
    setIsFirstConsentChecked(sampleData.isFirstConsentChecked)
    setIsSecondConsentChecked(sampleData.isSecondConsentChecked)

    setIsCustomerDataAvailable(true) // Indicate data has been loaded
  }
  const inputRefs = useRef({})

  const removeFile = (fieldKey, field) => {
    console.log('fieldKey:', fieldKey, 'field.....', field)

    // Clear the file input field by resetting its value using the ref
    if (inputRefs.current[fieldKey]) {
      inputRefs.current[fieldKey].value = '' // Clear the input field
    }

    // Remove the file from state for the specific fieldKey
    setFiles((prevFiles) => {
      const newFiles = { ...prevFiles }
      delete newFiles[fieldKey] // Remove the file from the files state
      return newFiles
    })

    // Reset the upload status for the fieldKey
    setUploadStatus((prevStatus) => {
      const newStatus = { ...prevStatus }
      newStatus[fieldKey] = 'notUploaded' // Reset the status for this field
      return newStatus
    })
  }

  const [uploadedFiles, setUploadedFiles] = useState([])

  const [uploadStatus, setUploadStatus] = useState('')

  const handleMultiFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      file, // Store the actual file object
      status: 'pending', // Status: pending/uploaded
    }))

    setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]) // Using uploadedFiles

    event.target.value = null // Reset file input
  }

  const handleFileUpload = async () => {
    for (const [index, fileObj] of uploadedFiles.entries()) {
      // Skip if already uploaded
      if (fileObj.status === 'uploaded') continue;
  
      if (uploadedFiles.length === 0) return;
  
      try {
        // const emailResponse = await fetch('http://localhost:8080/getEmail', { method: 'GET' });
  
        // if (!emailResponse.ok) {
        //   console.error('Failed to fetch email:', emailResponse.statusText);
        //   return;
        // }
  
        // const emailId = await emailResponse.text(); // Assuming the response is plain text
        // console.log('Email ID:', emailId);
  
        const formData = new FormData();
  
        // Append files to form data
        uploadedFiles.forEach((fileObj) => {
          formData.append('file', fileObj.file, fileObj.file.name);
        });
  
        formData.append('documentCategory', 'taxProof');
        formData.append('emailId', emailId);
  
        // Send multiple files for upload
        const response = await axios.post(`${URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        console.log('Upload response:', response.data);
        if (response.status === 200) {
          // Update uploadStatus after successful upload
          setUploadStatus((prevStatus) => {
            const updatedStatus = { ...prevStatus };
            uploadedFiles.forEach((fileObj) => {
              updatedStatus[fileObj.name] = 'uploaded';
            });
            return updatedStatus;
          });
  
          Swal.fire({
            text: 'Files uploaded successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
  
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to upload files. Please try again.',
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        }
  
        // Update uploaded files state
        const updatedFiles = uploadedFiles.map((file, index) => ({
          ...file,
          id: response.data[index]?.id,
          status: 'uploaded',
        }));
  
        setUploadedFiles(updatedFiles);
      } catch (error) {
        console.error('Error uploading files:', error);
        // Handle error (e.g., show a toast message)
      }
    }
  };
  


  const handleFileDelete = async (fileId, index) => {
    if (!fileId) {
      console.error('File ID is undefined')
      return
    }

    try {
      const response = await axios.delete(`${URL}/delete/${fileId}`)

      if (response.status === 200) {
        // Remove the file from the list after deletion
        setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)) // Changed to uploadedFiles
        Swal.fire({
          text: `File deleted successfully!`,
          icon: 'success',
          confirmButtonText: 'OK',
        })
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete file. Please try again.',
        icon: 'error',
        confirmButtonText: 'Retry',
      })
    }
  }

  const handleRemoveFile1 = async (documentCategory) => {
    // const emailResponse = await fetch('http://localhost:8080/getEmail', {
    //   method: 'GET',
    // })

    // if (!emailResponse.ok) {
    //   console.error('Failed to fetch email:', emailResponse.statusText)
    //   return
    // }

    // const emailId = await emailResponse.text() // Assuming the response is plain text
    // console.log('Email ID:', emailId)

    try {
      // Make an API call to remove all files of the given documentCategory
      const response = await axios.delete(`${URL}/deleteMultiple`, {
        params: {
          documentCategory, // Pass the documentCategory as query parameter
          emailId, // Pass the emailId as query parameter
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        console.log(`All files under category ${documentCategory} removed successfully.`)
        setUploadedFiles([]) // Changed to uploadedFiles
        // notifyDeleteSuccess();

        // Remove input fields and icons dynamically
        const inputFields = document.querySelectorAll(
          `input[type="file"][id^="${documentCategory}-"]`,
        )
        inputFields.forEach((input) => {
          input.value = '' // Clear the input field
        })
        removeFile()
        alert('All files removed successfully!')
      } else {
        console.error('Error removing files:', response.data)
      }
    } catch (error) {
      console.error('Failed to remove files:', error)
    }
  }
  const removeFileFromRow = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }
  return (
    <div className="container mt-4">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center">
          {/* Go Back Button */}
          <CButton color="success" onClick={handlePrevious} title="Go Back">
            <FaArrowLeft />
          </CButton>

          {/* Form Title */}
          <h2 className="form-title mb-4 mx-auto text-center">Document Upload</h2>

          {/* Load Data and Reset Buttons */}
          <div className="d-flex">
            {!isCustomerDataAvailable && (
              <>
                {/* Load Data Button */}
                <CButton color="info" className="me-2" onClick={handleLoadData} title="Load Data">
                  <FaUpload />
                </CButton>

                {/* Reset Button */}
                <CButton color="danger" onClick={handleReset} title="Reset Form">
                  <FaUndo />
                </CButton>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} id="documentUploadForm">
          <form style={{ marginLeft: '245px' }}>
           {['idProof', 'drivingLicense', 'aadharCard', 'panCard'].map((field) => (
  <div className="row mt-3" key={field}>
    <div className="col-md-10">
      <div style={{ marginBottom: '10px' }}>
        <label
          htmlFor={`formFileSm-${field}`}
          style={{ textTransform: 'uppercase', marginBottom: '8px' }}
        >
          {field.replace(/([A-Z])/g, ' $1').trim()}
        </label>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <CFormInput
          name={field}
          id={`formFileSm-${field}`}
          type="file"
          onChange={(e) => handleFileChange(e, field)}
          size="sm"
          style={{ backgroundColor: 'rgb(246,246,246)' }}
          ref={(el) => (inputRefs.current[field] = el)} // Store ref to input element
        />

        {/* Show Upload Icon or "File Uploaded" text based on status */}
        {files[field] && (
          <>
            {uploadStatus[field] === 'uploaded' ? (
              <CheckCircle
                style={{
                  color: 'green',
                  marginLeft: '10px',
                  fontSize: '24px',
                }}
                aria-label="uploaded"
              />
            ) : (
              <IconButton
                onClick={() => uploadFile(field)}
                style={{ color: 'green', marginLeft: '10px' }}
                aria-label="upload"
              >
                <UploadRounded />
              </IconButton>
            )}

            {/* Remove Icon (always stays in place) */}
            <IconButton
              onClick={() => handleRemoveFile(field)}
              style={{ color: 'red', marginLeft: '10px' }}
              aria-label="remove"
            >
              <CloseRounded />
            </IconButton>
          </>
        )}
      </div>

      {/* Show file name and remove button only if the file is not uploaded */}
      {files[field] && uploadStatus[field] !== 'uploaded' && (
        <div
          style={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ marginRight: '10px' }}>{files[field].name}</span>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => removeFile(field)}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  </div>
))}


            {/* Multi-File Upload for Tax Proof */}
            {/* Multi-File Upload for Tax Proof */}
            <div className="container mt-4">
             <div>
                    <label
                     
                      style={{ textTransform: 'uppercase' }}
                    >
                     Tax Proof
                    </label>
                  </div>
              <Box sx={{ mt: 2, p: 1, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Upload Files
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFile />}
                  sx={{ marginRight: 2 }}
                >
                  Choose Files
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="application/pdf, image/*"
                    onChange={handleMultiFileChange}
                  />
                </Button>

                {uploadedFiles.length > 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CloudUpload />}
                    sx={{ marginRight: 28 }}
                    onClick={handleFileUpload}
                  >
                    Upload Files
                  </Button>
                )}

                {uploadedFiles.length > 0 && (
                  <IconButton
                    variant="outlined"
                    color="secondary"
                    startIcon={<CCloseButton />}
                    onClick={() => handleRemoveFile1('taxProof')} // Call handleRemoveFile1 with 'others' as the argument
                  >
                    <RemoveCircleOutlineRounded />
                  </IconButton>
                )}

                {uploadedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      Files:
                    </Typography>
                    {uploadedFiles.map((fileObj, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {fileObj.file.name} - {fileObj.file.type || 'Unknown Type'}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => {
                            // If the file is still pending, remove it from the list
                            if (fileObj.status === 'pending') {
                              removeFileFromRow(index)
                            } else {
                              // If the file is uploaded, call handleFileDelete
                              handleFileDelete(fileObj.id, index)
                            }
                          }}
                        >
                          {/* Show Close icon before upload and Remove icon after upload */}
                          {fileObj.status === 'pending' ? (
                            <RemoveCircleOutlineSharp /> // Show Close icon before upload
                          ) : (
                            <Close /> // Show Remove icon after upload
                          )}
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </div>
          </form>
          {/* Consent Section */}
          <div className="form-section mt-8">
            <Typography variant="h5" gutterBottom>
              Consent of the Borrower
            </Typography>

            {/* First Checkbox for Consent */}
            <div className="form-check mt-4">
              <input
                type="checkbox"
                id="firstConsent"
                checked={isFirstConsentChecked}
                onChange={handleFirstConsentChange}
                className="form-check-input"
                required
              />
              <label htmlFor="firstConsent" className="form-check-label mb-4">
                I authorize the lending company to obtain my personal and credit information about
                me from my employer and credit bureau. Just add a tick below so that the customer
                can authenticate his/her approval. I hereby agree that the above information is true
                and accurate.
              </label>
            </div>

            {/* Second Checkbox for Consent */}
            <div className="form-check">
              <input
                type="checkbox"
                id="secondConsent"
                checked={isSecondConsentChecked}
                onChange={handleSecondConsentChange}
                className="form-check-input"
                required
              />
              <label htmlFor="secondConsent" className="form-check-label">
                I hereby agree that the above information is true and accurate.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-center">
            <CButton color="primary" type="submit">
              Submit
            </CButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DocumentUpload
