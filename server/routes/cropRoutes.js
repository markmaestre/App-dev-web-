const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const auth = require('../middleware/auth');

// Create new crop
router.post('/', auth, async (req, res) => {
  try {
    const { name, harvestCalendar } = req.body;

    const crop = new Crop({
      name,
      harvestCalendar,
      userId: req.user
    });

    await crop.save();
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all crops created by logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update crop (only if it belongs to logged-in user)
router.put('/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user });

    if (!crop) {
      return res.status(404).json({ error: 'Crop not found or unauthorized' });
    }

    crop.name = req.body.name || crop.name;
    crop.harvestCalendar = req.body.harvestCalendar || crop.harvestCalendar;

    await crop.save();
    res.json(crop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete crop (only if it belongs to logged-in user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, userId: req.user });

    if (!crop) {
      return res.status(404).json({ error: 'Crop not found or unauthorized' });
    }

    res.json({ message: 'Crop deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
