/* eslint-disable prettier/prettier */
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useRef, useState } from 'react'
import { usePDF } from 'react-to-pdf'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jsPDF } from "jspdf";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';


const PaymentScheduleReport = (props) => {
  const data = {
    loanAmount: '',
    interest: '',
    tenure: ''
  }

  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [repaymentType, setRepaymentType] = useState('bullet')
  const [schedule, setSchedule] = useState([])
  const [initialData, setInitialData] = useState(data);
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const nav = useNavigate();

 

  const reportRef = useRef();

  
  const generateReport = () => {
    setShowReport(true);
    axios
      .get(`http://localhost:8080/repaymentSchedule/loanAccountNumber/${accountNumber}`)
      .then((res) => {
        console.log(res.data);
        // Ensure the response data is stored as an array
        setReportData(res.data.map(item => ({
          installmentNo: item.installmentNo,
          date: item.installmentDate,  // Handle undefined date
          amount: item.installmentAmount,  // Fix typo from 'ammount' to 'amount'
          principal: item.principal,
          tenure:item.tenure,
          interestRate: item.interest,
          closingPrincipal: item.closingPrincipal,
        })));
      })
      .catch((err) => console.error('Error getting Loan Details:', err));
  }

  const downloadPDF = () => {
    axios.get(`http://localhost:8080/repaymentSchedule/download/${accountNumber}`, {
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
  };



  const sendReport = () => {
    alert('API Call...')
  }

  const location = useLocation();
  const { accountNumber } = location.state || {}; // Get the account number from state


  useEffect(() => {
    axios
      .get(`http://localhost:8080/repaymentSchedule/loanAccountNumber/${accountNumber}`)
      .then((res) => {
        console.log(res.data[0]);
        setInitialData({
          loanAmount: res.data[0].closingPrincipal,
          interest: res.data[0].interest,
          tenure:res.data[0].tenure,
        })
      })
      .catch((err) => console.error('Error getting Loan Details:', err));
  }, []);

  useEffect(() => {
    console.log("datara", initialData, reportData);
  }, [initialData, reportData])

  return (
    <div className="container mt-5">
      <h1 className="text-center">Repayment Schedule Generator</h1>
      <div className="mb-3">
        <label>Loan Amount</label>
        <input
          type="number"
          className="form-control"
          value={initialData.loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Interest Rate (%)</label>
        <input
          type="number"
          className="form-control"
          value={initialData.interest}
          onChange={(e) => setInterestRate(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Loan Term (years)</label>
        <input
          type="number"
          className="form-control"
          value={initialData.tenure}
          onChange={(e) => setLoanTerm(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Repayment Type</label>
        <select
          className="form-control"
          value={repaymentType}
          onChange={(e) => setRepaymentType(e.target.value)}
        >
          <option value="bullet">Bullet Repayment</option>
          <option value="interest-only">Interest-Only</option>
          <option value="amortized">Amortized</option>
        </select>
      </div>
      <div className="text-center mb-3">
        <button className="btn btn-primary me-2" onClick={generateReport}>
          Generate Report
        </button>
      </div>
      {showReport && (
        <div>
          <h3 className="text-center">Repayment Schedule</h3>
          <div className="text-center mb-3" ref={reportRef}>
            <button className="btn btn-success me-2" onClick={downloadPDF}>
              Download Report
            </button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Installment.No</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Closing Principal</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 && (reportData.map((item, index) => (
                <tr key={index}>
                  <td>{item.installmentNo}</td>
                  <td>{item.date}</td>
                  <td>{item.amount}</td>
                  <td>{item.principal}</td>
                  <td>{item.interestRate}</td>
                  <td>{item.closingPrincipal}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PaymentScheduleReport
