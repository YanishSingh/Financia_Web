// src/pages/Budget.jsx
import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiMoreVertical } from 'react-icons/fi';

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

const Budgets = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]); // All transactions for selected period
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { action: 'delete', budget }

  // Fetch budgets for the selected month and year based on startDate
  const fetchBudgets = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/budgets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter budgets by startDate (adjust logic as needed)
      const filtered = res.data.filter(budget => {
        const start = new Date(budget.startDate);
        return (
          start.getMonth() === selectedMonth &&
          start.getFullYear() === selectedYear
        );
      });
      setBudgets(filtered);
    } catch (err) {
      console.error('Error fetching budgets:', err);
    }
  }, [selectedMonth, selectedYear]);

  // Fetch transactions for the selected month/year
  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter transactions to only those whose date falls within the selected month/year
      const filtered = res.data.filter(tx => {
        const txDate = new Date(tx.date);
        return (
          txDate.getMonth() === selectedMonth &&
          txDate.getFullYear() === selectedYear
        );
      });
      setExpenses(filtered);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, [fetchBudgets, fetchTransactions]);

  // Handler for deleting a budget
  const handleDeleteBudget = async (budget) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/budgets/${budget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Budget deleted successfully');
      fetchBudgets();
    } catch (err) {
      toast.error('Failed to delete budget');
      console.error('Delete budget error:', err);
    }
    setConfirmAction(null);
  };

  // Handler for opening update modal (after confirmation)
  const handleOpenUpdate = (budget) => {
    setSelectedBudget(budget);
    setConfirmAction(null);
    setShowUpdateModal(true);
  };

  // Handler for update form submission
  const handleUpdateBudget = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { 
        ...updatedData, 
        totalBudget: Number(updatedData.totalBudget) 
      };
      await axios.put(`http://localhost:5000/api/budgets/${selectedBudget._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Budget updated successfully');
      fetchBudgets();
    } catch (err) {
      toast.error('Failed to update budget');
      console.error('Update budget error:', err);
    }
    setShowUpdateModal(false);
    setSelectedBudget(null);
  };

  // For each budget, calculate the sum of expenses that belong to the same category
  // and fall within the budget's start and end dates.
  const getSpentForBudget = (budget) => {
    const start = new Date(budget.startDate);
    const end = new Date(budget.endDate);
    const relevantExpenses = expenses.filter(tx => 
      tx.type === 'expense' &&
      tx.category === budget.category &&
      new Date(tx.date) >= start &&
      new Date(tx.date) <= end
    );
    const sumSpent = relevantExpenses.reduce((acc, tx) => acc + Number(tx.amount), 0);
    return sumSpent;
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Toaster position="top-center" />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800">
          {/* Header with Month/Year Picker */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-24 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              These are the Budgets you've set for {monthNames[selectedMonth]}, {selectedYear}.
            </h2>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
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
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Add New Budget
              </button>
            </div>
          </div>

          {/* Budget Cards */}
          {budgets.length === 0 ? (
            <div className="p-4 text-center text-gray-600 dark:text-gray-300">
              Oopss... you have no budgets for this month.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const spent = getSpentForBudget(budget);
                const warningThreshold = 0.8 * budget.totalBudget;
                return (
                  <div key={budget._id} className="relative bg-white dark:bg-gray-700 shadow rounded-lg p-4">
                    {/* Three-dots menu */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => setConfirmAction({ action: 'menu', budget })}
                        className="text-gray-600 dark:text-gray-300"
                      >
                        <FiMoreVertical size={20} />
                      </button>
                      {confirmAction &&
                        confirmAction.action === 'menu' &&
                        confirmAction.budget._id === budget._id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border rounded shadow-lg z-10">
                            <button
                              onClick={() => {
                                setSelectedBudget(budget);
                                setConfirmAction(null);
                                setShowUpdateModal(true);
                              }}
                              className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              Update Budget
                            </button>
                            <button
                              onClick={() => setConfirmAction({ action: 'delete', budget })}
                              className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              Delete Budget
                            </button>
                          </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {budget.category}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Budget: NPR {budget.totalBudget}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      From: {new Date(budget.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      To: {new Date(budget.endDate).toLocaleDateString()}
                    </p>
                    {spent >= budget.totalBudget ? (
  <div className="mt-2 p-2 bg-red-200 text-red-800 rounded">
    You've spent NPR {spent} out of NPR {budget.totalBudget}. You've exceeded your budget!
  </div>
) : spent >= warningThreshold ? (
  <div className="mt-2 p-2 bg-yellow-200 text-yellow-800 rounded">
    Your Budget for {budget.category} is about to reach! You've spent NPR {spent} out of NPR {budget.totalBudget}.
  </div>
) : null}

                  </div>
                );
              })}
            </div>
          )}

          {/* Confirmation Modal for Delete */}
          {confirmAction && confirmAction.action === 'delete' && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black opacity-50" onClick={() => setConfirmAction(null)}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                <p className="text-lg text-gray-800 dark:text-gray-100 mb-4">
                  Are you sure you want to delete this budget?
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  >
                    No
                  </button>
                  <button
                    onClick={() => handleDeleteBudget(confirmAction.budget)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Budget Modal */}
          {showAddModal && (
            <BudgetForm
              onClose={() => setShowAddModal(false)}
              onSubmit={async (data) => {
                try {
                  const token = localStorage.getItem('token');
                  await axios.post('http://localhost:5000/api/budgets', data, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  toast.success('Budget added successfully');
                  fetchBudgets();
                } catch (error) {
                  toast.error('Failed to add budget');
                }
                setShowAddModal(false);
              }}
            />
          )}

          {/* Update Budget Modal */}
          {showUpdateModal && selectedBudget && (
            <BudgetForm
              budget={selectedBudget}
              onClose={() => {
                setShowUpdateModal(false);
                setSelectedBudget(null);
              }}
              onSubmit={handleUpdateBudget}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// BudgetForm Component for adding and updating budgets
const BudgetForm = ({ budget, onClose, onSubmit }) => {
  const isUpdate = Boolean(budget);
  const [totalBudget, setTotalBudget] = useState(budget ? budget.totalBudget : '');
  const [category, setCategory] = useState(budget ? budget.category : 'Grocery');
  const [startDate, setStartDate] = useState(budget ? budget.startDate.slice(0, 10) : getTodayDate());
  const [endDate, setEndDate] = useState(budget ? budget.endDate.slice(0, 10) : getTodayDate());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }
    onSubmit({ totalBudget: Number(totalBudget), category, startDate, endDate });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {isUpdate ? 'Update Budget' : 'Add Budget'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Total Budget (NPR)</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="Grocery">Grocery</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Travelling Expenses">Travelling Expenses</option>
              <option value="Fees">Fees</option>
              <option value="Rent">Rent</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Personal Use">Personal Use</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Government Fees">Government Fees</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
              required
              // Future dates allowed here.
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
              required
              min={startDate}  // Prevent selecting an end date before start date
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              {isUpdate ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Budgets;
