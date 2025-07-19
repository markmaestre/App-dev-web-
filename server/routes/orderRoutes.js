const express = require('express');
const router = express.Router();
const { v2: cloudinary } = require('cloudinary');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const auth = require('../Middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Checkout and create order
router.post('/checkout', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, paymentProof } = req.body;

    // Validate input
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }

    // Additional validation for non-cash payments
    if (paymentMethod !== 'cash_on_delivery' && !paymentProof) {
      return res.status(400).json({ message: 'Payment proof is required for this payment method' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (total, item) => total + (item.productId.price * item.quantity),
      0
    );

    // Upload payment proof to Cloudinary if exists
    let paymentProofUrl = null;
    if (paymentMethod !== 'cash_on_delivery' && paymentProof) {
      try {
        const uploadedResponse = await cloudinary.uploader.upload(paymentProof, {
          upload_preset: 'payment_proofs',
          resource_type: 'auto',
          allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
          max_file_size: 5 * 1024 * 1024 // 5MB limit
        });
        paymentProofUrl = uploadedResponse.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ 
          message: 'Error uploading payment proof',
          details: uploadError.message 
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      productName: item.productId.productName,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image
    }));

    // Create new order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
      paymentProof: paymentProofUrl,
      orderStatus: 'processing'
    });

    await order.save();
    
    // Clear the cart
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        ...order._doc,
        paymentProof: undefined // Don't send back the URL for security
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      message: 'Error during checkout',
      error: error.message 
    });
  }
});

// Get user's order history
router.get('/history', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-paymentProof'); // Exclude payment proof from history

    res.json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ 
      message: 'Error fetching order history',
      error: error.message 
    });
  }
});

// Get order details (admin or owner only)
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id
    }).populate('items.productId', 'productName price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // For security, only include necessary payment proof info
    const orderResponse = {
      ...order._doc,
      paymentProof: order.paymentProof ? true : false
    };

    res.json(orderResponse);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ 
      message: 'Error fetching order details',
      error: error.message 
    });
  }
});

module.exports = router;