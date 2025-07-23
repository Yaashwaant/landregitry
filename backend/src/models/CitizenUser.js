const mongoose = require('mongoose');

const citizenUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aadhaarId: { type: String, required: true, unique: true },
  phone: { type: String },
  email: { type: String },
  associatedSurveyNumbers: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('CitizenUser', citizenUserSchema);
