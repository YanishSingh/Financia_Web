// backend/models/Transaction.js
const mongoose = require('mongoose');

// Predefined allowed categories for each type:
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

const incomeCategories = [
  'Salary',
  'Gift',
  'Bonus',
  'Miscellaneous'
];

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        if (this.type === 'income') {
          return ['Salary', 'Gift', 'Bonus', 'Miscellaneous'].includes(v);
        } else if (this.type === 'expense') {
          return ['Grocery', 'Vehicle', 'Travelling Expense', 'Food & Beverages', 'Fees', 'Government Fees', 'Personal Use', 'Entertainment', 'Rent', 'Other'].includes(v);
        }
        return false;
      },
      message: props => `Invalid category "${props.value}" for transaction type "${this.type}".`
    }
  },
  date: { type: Date, default: Date.now },
  description: { type: String }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
