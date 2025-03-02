const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
  try {
    const { totalBudget, category, startDate, endDate } = req.body;
    // req.user should be set by Passport's JWT strategy.
    const budget = new Budget({
      user: req.user.id,
      totalBudget,
      category,
      startDate,
      endDate,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error('Create budget error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    console.error('Get budgets error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { totalBudget, category, startDate, endDate } = req.body;
    // Find budget that belongs to the user.
    let budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    // Update fields if provided
    budget.totalBudget = totalBudget !== undefined ? totalBudget : budget.totalBudget;
    budget.category = category || budget.category;
    budget.startDate = startDate || budget.startDate;
    budget.endDate = endDate || budget.endDate;

    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error('Update budget error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ msg: 'Budget not found' });
    res.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error('Delete budget error:', err.message);
    res.status(500).send('Server error');
  }
};
