const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateStock } = require('../controllers/ProductController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProducts).post(protect, createProduct);
router.route('/:id').put(protect, updateStock);

module.exports = router;
