const Transaction = require('../models/Transaction');

// Create a new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;
    const transaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      category,
      date: date ? new Date(date) : new Date(),
      description,
    });
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    console.error('Add transaction error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
};

// Get all transactions for the authenticated user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Get transactions error:', err.message);
    res.status(500).send('Server error');
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    // Find the transaction by its ID
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    // Check that the transaction belongs to the logged-in user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    // Update fields (ensure type is preserved)
    transaction.type = req.body.type || transaction.type;
    transaction.category = req.body.category;
    transaction.amount = req.body.amount;
    transaction.date = req.body.date;
    transaction.description = req.body.description;
    
    // Save the updated document (this will run validators with proper context)
    await transaction.save();
    
    res.json(transaction);
  } catch (err) {
    console.error('Update transaction error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server error');
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }
    res.json({ msg: 'Transaction deleted' });
  } catch (err) {
    console.error('Delete transaction error:', err.message);
    res.status(500).send('Server error');
  }
};

// Get a summary of expenses for the current month (grouped by day)
exports.getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const transactions = await Transaction.find({
      user: req.user.id,
      type: 'expense',
      date: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lte: new Date(currentYear, currentMonth + 1, 0),
      },
    });

    const summary = transactions.reduce((acc, tx) => {
      const day = new Date(tx.date).getDate();
      acc[day] = (acc[day] || 0) + Number(tx.amount);
      return acc;
    }, {});

    res.json(summary);
  } catch (err) {
    console.error('Monthly summary error:', err.message);
    res.status(500).send('Server error');
  }
};
