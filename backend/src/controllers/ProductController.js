const Product = require('../models/Product');

// @desc    Get all products for logged in user
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const { name, category, price, quantityInStock } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const product = await Product.create({
      user: req.user.id,
      name,
      category,
      price,
      quantityInStock: quantityInStock || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id
// @access  Private
const updateStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check for user
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    if (req.body.quantityInStock === undefined) {
       return res.status(400).json({ message: 'Please provide quantityInStock' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { quantityInStock: req.body.quantityInStock },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateStock,
};
