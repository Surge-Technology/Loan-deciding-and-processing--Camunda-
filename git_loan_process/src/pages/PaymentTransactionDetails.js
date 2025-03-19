/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import axios from "axios";

const transactionsData = [
  {
    uanId: "",
    transactionStatus: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    loanAccountNumber: "",
    loanAmount: 0,
    paymentType: "",
    transactionAmount: 0,
    balanceAmount: 0,
    email: "",
    version: "",
  },
];

export default function PaymentTransactionDetails({ onClose }) {
  const [transactions, setTransactions] = useState(transactionsData);

  useEffect(() => {
    axios
      .get("http://localhost:8080/loanTransaction/allTransactions")
      .then((res) => {
        console.log("API Response:", res.data);

        // Ensure transactions are handled as an array
        if (Array.isArray(res.data)) {
          setTransactions(res.data);
        } else {
          setTransactions([res.data]);
        }
      })
      .catch((err) => {
        console.error("Error getting Loan Details:", err);
      });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-center mb-4">
          Transaction Details
        </h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">UAN ID</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Loan Account No</th>
                  <th className="border p-2">Loan Amount</th>
                  <th className="border p-2">Payment Type</th>
                  <th className="border p-2">Transaction Amount</th>
                  <th className="border p-2">Balance Amount</th>
                  <th className="border p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{transaction.uanId}</td>
                    <td className="border p-2">{transaction.date}</td>
                    <td className="border p-2">{transaction.loanAccountNumber}</td>
                    <td className="border p-2">{transaction.loanAmount}</td>
                    <td className="border p-2">{transaction.paymentType}</td>
                    <td className="border p-2">{transaction.transactionAmount}</td>
                    <td className="border p-2">{transaction.balanceAmount}</td>
                    <td className="border p-2">{transaction.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No transactions available.</p>
        )}

        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
