// src/components/NewTransactionForm.jsx
import React, { useState } from 'react';

const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return `${yyyy}-${mm}-${dd}`;
};

const NewTransactionForm = ({ transactionType, onClose, onSubmit, 'data-testid': testId }) => {
  const expenseCategories = [
    'Grocery',
    'Vehicle',
    'Travelling Expense',
    'Food & Beverages',
    'Rent',
    'Personal Use',
    'Entertainment',
    'Fees',
    'Government Fees',
    'Other'
  ];
  const incomeCategories = ['Salary', 'Gift', 'Bonus', 'Miscellaneous'];
  const categories = transactionType === 'expense' ? expenseCategories : incomeCategories;

  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type: transactionType, category, amount: Number(amount), date, description });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" data-testid={testId}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Add {transactionType === 'expense' ? 'Expense' : 'Income'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Amount (NPR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionForm;
