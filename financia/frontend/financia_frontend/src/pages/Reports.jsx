// src/pages/Reports.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// Predefined month names
const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Helper: Format a date string as "DD MMM YYYY"
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const Reports = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions for selected month/year
  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter transactions for the selected month and year
      const filtered = res.data.filter(tx => {
        const txDate = new Date(tx.date);
        return (
          txDate.getMonth() === selectedMonth &&
          txDate.getFullYear() === selectedYear
        );
      });
      setTransactions(filtered);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      toast.error('Failed to fetch transactions');
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Export transactions as Excel
  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }
    const data = transactions.map((tx, index) => ({
      'S.N': index + 1,
      'Date': formatDate(tx.date),
      'Type': tx.type,
      'Category': tx.category,
      'Description': tx.description || '',
      'Amount (NPR)': tx.amount,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `Report_${monthNames[selectedMonth]}_${selectedYear}.xlsx`);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Toaster position="top-center" />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800">
          {/* Header with Month/Year Picker and Download Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-24 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              These are your transactions for {monthNames[selectedMonth]}, {selectedYear}.
            </h2>
            <div className="flex flex-col sm:flex-row items-center space-x-2 mt-4 sm:mt-0">
              <div className="flex items-center space-x-2">
                <label className="text-gray-800 dark:text-gray-100">Select Month:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                >
                  {monthNames.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
                <label className="text-gray-800 dark:text-gray-100">Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                >
                  {Array.from({ length: 7 }, (_, i) => currentDate.getFullYear() - 5 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleExport}
                className="mt-2 sm:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Download Report
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          {transactions.length > 0 ? (
            <div className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">S.N</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Amount (NPR)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={tx._id} className="border-b dark:border-gray-600">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{formatDate(tx.date)}</td>
                      <td className="py-2 px-4 capitalize">{tx.type}</td>
                      <td className="py-2 px-4">{tx.category}</td>
                      <td className="py-2 px-4">{tx.description || 'N/A'}</td>
                      <td className="py-2 px-4">NPR {tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-600 dark:text-gray-300">
              Oopss... you have no transactions for this month.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;
