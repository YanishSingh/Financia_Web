// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TransactionForm from '../components/TransactionForm';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { FaLightbulb, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const tips = [
  "Save at least 20% of your income every month.",
  "Track your daily expenses to understand your spending habits.",
  "Invest in diversified assets for long-term growth.",
  "Create a realistic budget and stick to it.",
  "Avoid impulse purchases—wait 24 hours before buying.",
  "Maintain an emergency fund for unexpected expenses.",
  "Review subscriptions and cancel unused ones.",
  "Plan your retirement early for better financial security.",
  "Use cash instead of credit to prevent overspending.",
  "Regularly review and adjust your budget."
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [randomTip, setRandomTip] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('expense'); // default type

  // Graph filter state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Retrieve user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
    }
  }, []);

// Fetch transactions and update chart based on selected month/year
const fetchData = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/transactions', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allTransactions = res.data;
    // Sort transactions descending by date and take 5 most recent for table
    const sortedTransactions = allTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setTransactions(sortedTransactions.slice(0, 5));

    // Filter transactions for selected month/year
    const filtered = allTransactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === selectedMonth &&
        txDate.getFullYear() === selectedYear
      );
    });
    
    // Log the filtered transactions for debugging
    console.log(`Filtered transactions for ${monthNames[selectedMonth]}, ${selectedYear}:`, filtered);

    // Group income and expense by day
    const incomeByDay = {};
    const expenseByDay = {};
    filtered.forEach((tx) => {
      const day = new Date(tx.date).getDate();
      if (tx.type === 'income') {
        incomeByDay[day] = (incomeByDay[day] || 0) + Number(tx.amount);
      } else if (tx.type === 'expense') {
        expenseByDay[day] = (expenseByDay[day] || 0) + Number(tx.amount);
      }
    });

    // Create a combined sorted list of days
    const daysSet = new Set([
      ...Object.keys(incomeByDay).map(Number),
      ...Object.keys(expenseByDay).map(Number)
    ]);
    const sortedDays = Array.from(daysSet).sort((a, b) => a - b);

    // Build data arrays for income and expense
    const incomeValues = sortedDays.map(day => incomeByDay[day] || 0);
    const expenseValues = sortedDays.map(day => expenseByDay[day] || 0);

    const chartDataComputed = {
      labels: sortedDays,
      datasets: [
        {
          label: 'Daily Income',
          data: incomeValues,
          borderColor: 'rgba(34,197,94,1)', // green
          backgroundColor: 'rgba(34,197,94,0.2)',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Daily Expenses',
          data: expenseValues,
          borderColor: 'rgba(220,38,38,1)', // red
          backgroundColor: 'rgba(220,38,38,0.2)',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };

    // Log the computed chart data for debugging
    console.log('Computed Chart Data:', chartDataComputed);

    setChartData(chartDataComputed);
  } catch (err) {
    console.error('Error fetching transactions:', err);
  }
}, [selectedMonth, selectedYear]);

useEffect(() => {
  fetchData();
}, [fetchData]);

  // Set a random tip initially and update every 2 minutes
  useEffect(() => {
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
    const tipInterval = setInterval(() => {
      setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 120000);
    return () => clearInterval(tipInterval);
  }, []);

  const handleAddExpense = () => {
    setFormType('expense');
    setShowForm(true);
  };

  const handleAddIncome = () => {
    setFormType('income');
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/transactions', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      setShowForm(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  // Helper: Format a date string as "DD MMM"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900" data-testid="dashboard-page">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800" data-testid="dashboard-main">
          {/* Welcome Section */}
          <div className="mb-6 pt-20" data-testid="dashboard-welcome">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
            {user && (
              <p className="mt-2 text-xl font-bold text-gray-600 dark:text-gray-300">
                Hello, {user.name}! Ready to take control of your finances?
              </p>
            )}
          </div>

          {/* Add Expense & Add Income Buttons */}
          <div className="flex space-x-4 mb-6" data-testid="transaction-buttons">
            <button
              onClick={handleAddExpense}
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              data-testid="add-expense-button"
            >
              <FaArrowDown className="mr-2" /> Add Expense
            </button>
            <button
              onClick={handleAddIncome}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              data-testid="add-income-button"
            >
              <FaArrowUp className="mr-2" /> Add Income
            </button>
          </div>

          {/* Recent Transactions Table Header */}
          <div className="mb-4" data-testid="recent-transactions-header">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Recent Transactions
            </h2>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-x-auto" data-testid="transactions-table">
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
                    <th className="py-2 px-4 text-left">Status</th>
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
                        {tx.type === 'income' ? (
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500" data-testid="income-status">
                            <FaArrowUp className="text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500" data-testid="expense-status">
                            <FaArrowDown className="text-white" />
                          </div>
                        )}
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

          {/* Graph Header with Month/Year Picker */}
          <div className="flex justify-between items-center mb-4" data-testid="graph-header">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Daily Income & Expenses ({monthNames[selectedMonth]} {selectedYear})
            </h2>
            <div className="flex items-center space-x-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                data-testid="graph-month-selector"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                data-testid="graph-year-selector"
              >
                {Array.from({ length: 7 }, (_, i) => currentDate.getFullYear() - 5 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Line Graph Section */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4 mb-6" data-testid="chart-container">
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  animation: { duration: 0 },
                  scales: {
                    y: { display: false },
                    x: { display: true },
                  },
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `NPR ${context.parsed.y}`;
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                No transaction data available.
              </p>
            )}
          </div>

          {/* Random Finance Tip Section */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6" data-testid="finance-tip">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
              <FaLightbulb className="mr-2 text-yellow-500" /> Finance Tip
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{randomTip}</p>
          </div>
        </main>
      </div>

      {/* Modal for Adding/Updating a Transaction */}
      {showForm && (
        <TransactionForm
          transaction={null} // When adding a new transaction, fields are empty
          type={formType}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          data-testid="transaction-form-modal"
        />
      )}
    </div>
  );
};

export default Dashboard;
