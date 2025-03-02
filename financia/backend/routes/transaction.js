const express = require('express');
const passport = require('passport');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// All transaction endpoints require JWT authentication
router.post('/', passport.authenticate('jwt', { session: false }), transactionController.addTransaction);
router.get('/', passport.authenticate('jwt', { session: false }), transactionController.getTransactions);
router.put('/:id', passport.authenticate('jwt', { session: false }), transactionController.updateTransaction);
router.delete('/:id', passport.authenticate('jwt', { session: false }), transactionController.deleteTransaction);

// Endpoint to get summary of current month's expenses
router.get('/summary', passport.authenticate('jwt', { session: false }), transactionController.getMonthlySummary);

module.exports = router;
