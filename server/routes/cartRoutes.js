const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../Middleware/auth');

// Add to cart or update quantity
router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId, quantity }]
      });
    } else {
      // Check if product exists in cart
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );
      
      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.items.push({ productId, quantity });
      }
    }
    
    await cart.save();
    res.status(200).json(await cart.populate('items.productId'));
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart', error });
  }
});

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate({
        path: 'items.productId',
        select: 'productName price image'
      });
      
    res.json(cart || { items: [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});

// Update item quantity
router.put('/:productId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === req.params.productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.json(await cart.populate('items.productId'));
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item', error });
  }
});

// Remove item from cart
router.delete('/:productId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.productId
    );
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    await cart.save();
    res.json(await cart.populate('items.productId'));
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error });
  }
});

module.exports = router;