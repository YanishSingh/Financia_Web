const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  totalBudget: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
    // You can add enum validation here if needed.
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Budget', BudgetSchema);
