const express = require('express');
const router = express.Router();
const { v2: cloudinary } = require('cloudinary');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User'); // Added User import
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

// Get admin dashboard statistics
router.get('/admin-stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total users
    const totalUsers = await User.countDocuments();

    // Pending orders
    const pendingOrders = await Order.countDocuments({ 
      orderStatus: 'processing' 
    });

    // Monthly sales
    const monthlySales = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { 
        $group: { 
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' }
        } 
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Payment methods
    const paymentMethods = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);

    // Order statuses
    const orderStatuses = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalUsers,
      pendingOrders,
      monthlySales: monthlySales.map(item => ({
        _id: item._id,
        totalSales: item.totalSales,
        month: new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' })
      })),
      paymentMethods,
      orderStatuses
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin stats', error });
  }
});

// Update order status
router.put('/:orderId/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { status } = req.body;
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Prepare update object
    const updateData = { orderStatus: status };
    
    // If status is being updated to 'delivered', also set paymentStatus to 'paid'
    if (status === 'delivered') {
      updateData.paymentStatus = 'paid';
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      updateData,  // Use the combined update object
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error });
  }
});
// Get all orders for admin
router.get('/admin-orders', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('userId', 'username email');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Error fetching admin orders', error });
  }
});

module.exports = router;