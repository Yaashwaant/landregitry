const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'official', 'operator'], required: true },
  district: { type: String },
  tehsil: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
