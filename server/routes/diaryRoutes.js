const express = require('express');
const router = express.Router();
const FarmDiary = require('../models/FarmDiary');
const auth = require('../middleware/auth');

// ✅ Create a diary entry
router.post('/', auth, async (req, res) => {
  try {
    const diary = new FarmDiary({
      ...req.body,
      userId: req.user
    });
    await diary.save();
    res.status(201).json({ message: 'Diary entry created', diary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create diary entry' });
  }
});

// ✅ Get all diary entries of the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await FarmDiary.find({ userId: req.user }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch diary entries' });
  }
});

// ✅ (Optional) Admin: Get all diary entries
router.get('/all', auth, async (req, res) => {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const entries = await FarmDiary.find().populate('userId', 'username email');
    res.status(200).json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
