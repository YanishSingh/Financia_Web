// src/pages/Expenses.jsx
import React, { useState } from 'react';

const Expenses = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement expense submission logic here (e.g., call an API via services/expenseService.js)
    console.log({ description, amount, date });
    // Reset form fields
    setDescription('');
    setAmount('');
    setDate('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#CC97FF] to-[#7F3DFF] flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg p-8 shadow-2xl max-w-lg w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Add New Expense</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="description" className="block text-white font-semibold mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter expense description"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-white font-semibold mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-white font-semibold mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-white text-[#7F3DFF] font-bold rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default Expenses;
