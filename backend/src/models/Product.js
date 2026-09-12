const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'WelcomeUser',
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    quantityInStock: {
      type: Number,
      required: [true, 'Please add a quantity'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
