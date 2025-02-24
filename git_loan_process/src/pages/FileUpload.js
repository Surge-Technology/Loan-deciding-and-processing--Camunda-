/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaUpload } from 'react-icons/fa'
import { Box, Button, IconButton, Typography } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css';
import {
  AttachFile,
  Close,
  
  CloudUpload,
  Delete,
  
  Done,
 
  RemoveCircleOutlineRounded,
  RemoveCircleOutlineSharp,
} from '@mui/icons-material'
import '../css/customerForm.css'
import { CloseButton } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { CCloseButton } from '@coreui/react'

const FileUpload = () => {
  const [files, setFiles] = useState([])
  const [clarificationData, setClarificationData] = useState('')
  const notifyUploadSuccess = () => toast.success("Files uploaded successfully!");
  const notifyDeleteSuccess = () => toast.success("All files removed successfully!");
  const URL = import.meta.env.VITE_BASE_URL;

  // const [clarificationData, setClarificationData] = useState({});
  const [taskId, setTaskId] = useState(""); // Store taskId in state
  const [uploadStatus, setUploadStatus] = useState("");
  // const URL = "your_api_url"; // Replace with actual URL

  useEffect(() => {
    const fetchClarification = async () => {
      try {
        const response = await axios.get(`${URL}/clarification`);
        console.log("API Response Data:", response.data);

        setClarificationData(response.data);

        // Ensure taskIds is an array and extract the first taskId
        if (response.data.taskIds && response.data.taskIds.length > 0) {
          setTaskId(response.data.taskIds[0]); // Store taskId in state
          console.log("Task ID:", response.data.taskIds[0]);
        } else {
          console.log("No active tasks found");
        }
      } catch (error) {
        console.error("Error fetching clarification data:", error);
      }
    };

    fetchClarification();
  }, []);

  useEffect(() => {
    if (clarificationData && Object.keys(clarificationData).length > 0) {
      formik.setValues({
        applicationNo: clarificationData.loanAccountNumber || "",
        loanType: clarificationData.loanType || "",
        comments: "",
        files: [],
        Clarification: clarificationData.clarificationDetails || "",
      });
    }
  }, [clarificationData]);

  const formik = useFormik({
    initialValues: {
      applicationNo: "",
      loanType: "",
      comments: "",
      files: [],
      Clarification: "",
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          applicationNo: values.applicationNo,
          loanType: values.loanType,
          comments: values.comments,
          Clarification: values.Clarification,
        };

        if (!taskId) {
          console.error("No taskId available, cannot submit data.");
          return;
        }

        const response = await axios.post(
          `${URL}/clarification/${taskId}`,
          payload
        );
        if (response) {
          Swal.fire({
            text: 'Thanks for your submitting!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
window.close();
            // window.location.href = '/home' // Redirect after success
          })
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to submit your application. Please try again.',
            icon: 'error',
            confirmButtonText: 'Retry',
          })
        }
      } catch (error) {
        console.error('API Error:', error)
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Retry',
        })
      }

        console.log("Clarification Submitted:", response.data);
     
    },
  });
  
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      file, // Store the actual file object
      status: 'pending', // Status: pending/uploaded
    }))
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])

    event.target.value = null // Reset file input
  }

  const processInstance = localStorage.getItem('processId');
  console.log("process Instance id retrived",processInstance);
  
  const handleFileUpload = async () => {
    for (const [index, fileObj] of files.entries()) {
      if (fileObj.status === 'uploaded') continue

      if (files.length === 0) return

      try {
         await axios.post(`${URL}/upload`, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        if (!emailResponse.ok) {
          console.error('Failed to fetch email:', emailResponse.statusText)
          return
        }

        const emailId = await emailResponse.text() // Assuming the response is plain text
        console.log('Email ID:', emailId)

        const formData = new FormData()

        // Append files to the form data
        files.forEach((fileObj) => {
          formData.append('file', fileObj.file, fileObj.file.name)
        })

        formData.append('documentCategory', 'others')
        formData.append('emailId', emailId) // Assuming `emailId` is already set

        // Send multiple files to backend for upload
        const response = await axios.post(`${URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        console.log('Upload response:', response.data)
        if (response.status === 200) {
          // Successful upload
          Swal.fire({
            text: 'Files uploaded successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          setUploadStatus('');
        } else {
          // Error during upload
          Swal.fire({
            title: 'Error!',
            text: 'Failed to upload files. Please try again.',
            icon: 'error',
            confirmButtonText: 'Retry',
          });
        }
        // Assuming response.data is an array of objects containing the `id` for each uploaded file
        const updatedFiles = files.map((file, index) => ({
          ...file,
          id: response.data[index]?.id, // Map `id` from response to the corresponding file
          status: 'uploaded',
        }))
        notifyUploadSuccess();

        setFiles(updatedFiles) // Update the state with the new file info
      } catch (error) {
        console.error('Error uploading files:', error)
        // Handle error (e.g., show a toast message)
      }
    }
  }

  const handleFileDelete = async (fileId, index) => {
    if (!fileId) {
      console.error('File ID is undefined')
      return
    }

    try {
      const response = await axios.delete(`${URL}/delete/${fileId}`)

      if (response.status === 200) {
        // Remove the file from the list after deletion
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
        Swal.fire({
          text: `File with ID ${fileId} deleted successfully!`,
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
    const emailResponse = await fetch(`${URL}/getEmailId`, {
      method: 'GET',
    })

    if (!emailResponse.ok) {
      console.error('Failed to fetch email:', emailResponse.statusText)
      return
    }

    const emailId = await emailResponse.text() // Assuming the response is plain text
    console.log('Email ID:', emailId)
 
    try {
      // Make an API call to remove all files of the given documentCategory
      const response = await axios.delete(`${URL}/deleteMultiple`, {
        params: {
          documentCategory, // Pass the documentCategory as query parameter
          emailId,          // Pass the emailId as query parameter
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log(`All files under category ${documentCategory} removed successfully.`);
        setFiles([]);
        notifyDeleteSuccess();

        // Remove input fields and icons dynamically
        const inputFields = document.querySelectorAll(`input[type="file"][id^="${documentCategory}-"]`);
        inputFields.forEach((input) => {
          input.value = ''; // Clear the input field
        });
        removeFile();
        alert("All files removed successfully!");
      } else {
        console.error('Error removing files:', response.data);
      }
    } catch (error) {
      console.error('Failed to remove files:', error);
    }
  };
  // Remove a file from the list
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  // Display uploaded files
  {
    files.length > 0 && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          Uploaded Files:
        </Typography>
        {files.map((file, index) => (
          <Typography key={index} variant="body2">
            {file.name}
          </Typography>
        ))}
      </Box>
    )
  }

  //file upload->get email
  const getEmail = async () => {
    const emailResponse = await fetch(`${URL}/getEmailId`, {
      method: 'GET',
    })

    if (!emailResponse.ok) {
      console.error('Failed to fetch email:', emailResponse.statusText)
      return
    }

    const emailId = await emailResponse.text() // Assuming the response is plain text
    console.log('Email ID:', emailId)
  }

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="form-title mb-4 mx-auto text-center">
            <span>File Upload Form</span>
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          {/* Application Number */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="applicationNo">Application No</label>
              <input
                type="text"
                id="applicationNo"
                name="applicationNo"
                disabled
                className="form-control"
                value={formik.values.applicationNo}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="loanType">Loan Type</label>
              <input
                type="text"
                id="loanType"
                name="loanType"
                disabled
                className="form-control"
                value={formik.values.loanType}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Clarification */}
          <div className="col-md-6">
            <label htmlFor="clarification">Clarification</label>
            <input
              type="text"
              id="clarification"
              name="clarification"
              className="form-control"
              disabled
              value={formik.values.Clarification}
              onChange={formik.handleChange}
            />
          </div>

          {/* File Upload */}
          <div className="container mt-4">
            <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
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
                  onChange={handleFileChange}
                />
              </Button>
              
            
              {files.length > 0 && (

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
                {files.length > 0 && (
                <IconButton
                 variant="outlined"
        color="secondary"
        startIcon={<CCloseButton/>}
                onClick={() => handleRemoveFile1("others")} // Call handleRemoveFile1 with 'others' as the argument
                       >
                <RemoveCircleOutlineRounded />
              </IconButton>
                )}
               {/* Remove All Icon */}
              
       
             {/* Remove All Icon 
             <IconButton
               onClick={() => handleRemoveFile1("others")}
               className="remove-all-icon"
               sx={{
                
                 right: 10,
               
               }}
             >
               <Delete />
             </IconButton>
           */}

              {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Files:
                  </Typography>
                  {files.map((fileObj, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {fileObj.file.name} - {fileObj.file.type || "Unknown Type"}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => {
                          // If the file is still pending, remove it from the list
                          if (fileObj.status === "pending") {
                            removeFile(index);
                          } else {
                            // If the file is uploaded, call handleFileDelete
                            handleFileDelete(fileObj.id, index);
                          }
                        }}
                      >
                        {/* Show Close icon before upload and Remove icon after upload */}
                        {fileObj.status === "pending" ? (
                          <RemoveCircleOutlineSharp/> // Show Close icon before upload
                        ) : (
                          <RemoveCircleOutlineRounded /> // Show Remove icon after upload
                        )}
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
              
              
            </Box>
          </div>

          {/* Comments */}
          <div className="mb-3">
            <label htmlFor="comments">Comments</label>
            <textarea
              id="comments"
              name="comments"
              className="form-control"
              value={formik.values.comments}
              onChange={formik.handleChange}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="d-md-flex justify-content-md-end mt-3">
            <button type="submit" className="btn btn-primary">
              <FaUpload /> Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FileUpload
//uploadfile changes