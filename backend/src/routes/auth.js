const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CitizenUser = require('../models/CitizenUser');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Official user login
router.post('/official-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Citizen login by Aadhaar ID
router.post('/citizen-login', async (req, res) => {
  const { aadhaarId } = req.body;
  try {
    const citizen = await CitizenUser.findOne({ aadhaarId });
    if (!citizen) return res.status(401).json({ message: 'Aadhaar ID not found' });

    const token = jwt.sign({ citizenId: citizen._id, aadhaarId: citizen.aadhaarId }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, citizen });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
