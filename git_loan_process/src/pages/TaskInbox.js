/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../css/customerForm.css'
import { CButton, CRow, CSpinner } from '@coreui/react'
import { Button, CircularProgress } from '@mui/material'
import { FaArrowLeft, FaUpload } from 'react-icons/fa6'
import { FaUndo } from 'react-icons/fa'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from "react-router-dom"
// import ActiveTaskList from './LoanAmountDetails'
 
 
const TaskInbox = () => {
  const [tasks, setTasks] = useState([]);
  const URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    loadUser();
  }, []);
  // sessionStorage.setItem('email', 'john.abi@gmail.com');
 
  const loadUser = async () => {
    try {
      const email = sessionStorage.getItem('email');
      console.log(" Login Email from sessionstorage ", email)
      const response = await axios.get(`${URL}/getActiveTasks?user=underWriter`);
      // alert("email User Name"+email);
      setTasks(response.data);
      console.log("resssss" + JSON.stringify(response.data), tasks);
 
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  // const handleViewClick = (taskId) => {
  //   // Set the userId in sessionStorage when "View" is clicked
  //   sessionStorage.setItem('taskId', taskId);
  //   console.log(taskId);
 
  // }
 
 
 
  return (
 
    <div className="container mt-4 approver-list-container">
 
 
      <div className="card p-4 main-content">
 
 
        <div className="d-flex justify-content-between align-items-center mb-3 page-content">
          <table className="table table-striped table-lg">
            <thead className="thead-dark ">
              <tr>
                <th>Task ID</th>
                <th>Task Name</th>
                <th>Assignee</th>
                {/* <th>Created Date</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? ( // Add a check for the array length
                tasks.map((task) => (
                  <tr key={task.taskId}>
                    <td>{task.taskId}</td>
                    <td>{task.taskName}</td>
                    <td>{task.assignee}</td>
                    {/* <td>{task.createdDate}</td> */}
                    <td>
                      <Link
                        className="btn btn-success w-75"
                        to={`/loanApproval`}
                        // onClick={() => handleViewClick(task.taskId)}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
 
}
 
export default TaskInbox