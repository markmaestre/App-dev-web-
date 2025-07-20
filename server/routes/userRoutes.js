const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const auth = require('../Middleware/auth');

const router = express.Router();

// ==== Cloudinary Config ====
cloudinary.config({
  cloud_name: 'dtisam8ot',
  api_key: '416996345946976',
  api_secret: 'dcfIgNOmXE5GkMyXgOAHnMxVeLg',
});

// ==== Multer-Cloudinary Storage ====
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }],
  },
});

const upload = multer({ storage });

// ==== Registration ====
router.post('/register', async (req, res) => {
  const { username, email, password, bod, gender, address, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, bod, gender, address, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ==== Login ====
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.status === 'banned') return res.status(403).json({ message: 'Account is banned. Contact admin.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        gender: user.gender,
        bod: user.bod,
        address: user.address,
        profile: user.profile,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});


router.put('/profile', auth, upload.single('profile'), async (req, res) => {
  const { username, bod, gender, address } = req.body;

  try {
    const updates = { username, bod, gender, address };
    if (req.file && req.file.path) {
      updates.profile = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        bod: user.bod,
        address: user.address,
        profile: user.profile,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Admin: Get All Users
router.get('/all-users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users', error });
  }
});

// Admin: Ban or Activate User
router.put('/ban/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  const { status } = req.body;
  if (!['banned', 'active'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: `User status updated to ${status}`,
      user 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating user status',
      error 
    });
  }
});


module.exports = router;
