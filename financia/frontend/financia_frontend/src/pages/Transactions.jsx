// src/pages/Transactions.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import TransactionForm from '../components/TransactionForm'; // For updating transactions
import NewTransactionForm from '../components/NewTransactionForm'; // For adding new transactions

// Predefined month names for dropdown and display
const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Helper: Get today's date as YYYY-MM-DD (for date pickers)
const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return `${yyyy}-${mm}-${dd}`;
};

// Helper: Format a date string as "DD MMM"
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
};

const Transactions = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null); // { action: 'delete' | 'update', tx }
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // New state for adding a transaction (Income/Expense)
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [newTransactionType, setNewTransactionType] = useState('expense'); // default type

  // Fetch transactions for selected month and year
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter transactions for selected month and year
      const filtered = res.data.filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          txDate.getMonth() === selectedMonth &&
          txDate.getFullYear() === selectedYear
        );
      });
      setTransactions(filtered);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers for deletion, updating, and adding new transactions
  const handleDelete = async (tx) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/transactions/${tx._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transaction deleted');
      fetchData();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error('Failed to delete transaction');
    }
    setConfirmAction(null);
  };

  const handleUpdate = (tx) => {
    setConfirmAction({ action: 'update', tx });
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { 
        ...updatedData, 
        type: confirmAction.tx.type, 
        amount: Number(updatedData.amount)
      };
      console.log("Update payload:", payload); // For debugging
      await axios.put(`http://localhost:5000/api/transactions/${confirmAction.tx._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transaction updated');
      fetchData();
    } catch (err) {
      console.error('Error updating transaction:', err.response ? err.response.data : err.message);
      toast.error('Failed to update transaction');
    }
    setConfirmAction(null);
    setShowUpdateForm(false);
  };

  const handleNewTransactionSubmit = async (transactionData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/transactions', transactionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transaction added successfully');
      fetchData();
    } catch (err) {
      console.error('Error adding transaction:', err.response ? err.response.data : err.message);
      toast.error('Failed to add transaction');
    }
    setShowNewTransactionModal(false);
  };

  const openNewTransactionModal = (type) => {
    setNewTransactionType(type);
    setShowNewTransactionModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900" data-testid="transactions-page">
      <Toaster position="top-center" />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 pt-24" data-testid="transactions-main">
          {/* Header with Month/Year Picker */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6" data-testid="transactions-header">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              These are the Transactions You've made in {monthNames[selectedMonth]}, {selectedYear}.
            </h2>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <label className="text-gray-800 dark:text-gray-100">Select Month:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                data-testid="month-selector"
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
                data-testid="year-selector"
              >
                {Array.from({ length: 7 }, (_, i) => currentDate.getFullYear() - 5 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons for Adding New Transactions */}
          <div className="flex items-center justify-center space-x-4 mb-6" data-testid="new-transaction-buttons">
            <button
              onClick={() => openNewTransactionModal('income')}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              data-testid="add-income-button"
            >
              <FiArrowUp className="mr-2" /> Add Income
            </button>
            <button
              onClick={() => openNewTransactionModal('expense')}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              data-testid="add-expense-button"
            >
              <FiArrowDown className="mr-2" /> Add Expense
            </button>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-x-auto mb-6" data-testid="transactions-table">
            {transactions.length > 0 ? (
              <table className="min-w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">S.N</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">Amount (NPR)</th>
                    <th className="py-2 px-4 text-left">Update</th>
                    <th className="py-2 px-4 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={tx._id} className="border-b dark:border-gray-600" data-testid={`transaction-row-${index}`}>
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{formatDate(tx.date)}</td>
                      <td className="py-2 px-4 capitalize">{tx.type}</td>
                      <td className="py-2 px-4">{tx.description || 'N/A'}</td>
                      <td className="py-2 px-4">{tx.category}</td>
                      <td className="py-2 px-4">NPR {tx.amount}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleUpdate(tx)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                          data-testid="update-transaction-button"
                        >
                          Update
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => setConfirmAction({ action: 'delete', tx })}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          data-testid="delete-transaction-button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-center text-gray-600 dark:text-gray-300" data-testid="empty-table">
                Oopss... you have no transactions for this month.
              </div>
            )}
          </div>

          {/* Confirmation Modal for Delete */}
          {confirmAction && confirmAction.action === 'delete' && (
            <div className="fixed inset-0 flex items-center justify-center z-50" data-testid="delete-confirmation-modal">
              <div className="absolute inset-0 bg-black opacity-50" onClick={() => setConfirmAction(null)}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                <p className="text-lg text-gray-800 dark:text-gray-100 mb-4">
                  Are you sure you want to delete this transaction?
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    data-testid="delete-cancel-button"
                  >
                    No
                  </button>
                  <button
                    onClick={() => handleDelete(confirmAction.tx)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    data-testid="delete-confirm-button"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Modal for Update */}
          {confirmAction && confirmAction.action === 'update' && !showUpdateForm && (
            <div className="fixed inset-0 flex items-center justify-center z-50" data-testid="update-confirmation-modal">
              <div className="absolute inset-0 bg-black opacity-50" onClick={() => setConfirmAction(null)}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                <p className="text-lg text-gray-800 dark:text-gray-100 mb-4">
                  Are you sure you want to update this transaction?
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    data-testid="update-cancel-button"
                  >
                    No
                  </button>
                  <button
                    onClick={() => setShowUpdateForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    data-testid="update-confirm-button"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Update Transaction Form Modal */}
          {showUpdateForm && confirmAction && confirmAction.action === 'update' && (
            <TransactionForm
              transaction={confirmAction.tx}
              onClose={() => {
                setShowUpdateForm(false);
                setConfirmAction(null);
              }}
              onSubmit={handleUpdateSubmit}
              data-testid="update-transaction-form-modal"
            />
          )}

          {/* New Transaction Modal */}
          {showNewTransactionModal && (
            <NewTransactionForm
              transactionType={newTransactionType}
              onClose={() => setShowNewTransactionModal(false)}
              onSubmit={handleNewTransactionSubmit}
              data-testid="new-transaction-form-modal"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Transactions;
