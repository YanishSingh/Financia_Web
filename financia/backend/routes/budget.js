const express = require('express');
const router = express.Router();
const passport = require('passport');
const budgetController = require('../controllers/budgetController');

// Protect these routes with Passport JWT middleware.
router.post('/', passport.authenticate('jwt', { session: false }), budgetController.createBudget);
router.get('/', passport.authenticate('jwt', { session: false }), budgetController.getBudgets);
router.put('/:id', passport.authenticate('jwt', { session: false }), budgetController.updateBudget);
router.delete('/:id', passport.authenticate('jwt', { session: false }), budgetController.deleteBudget);

module.exports = router;