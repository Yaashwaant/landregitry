const mongoose = require('mongoose');

const citizenQuerySchema = new mongoose.Schema({
  queryType: { type: String, enum: ['compensation', 'status', 'documentation', 'objection', 'general'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  citizenName: { type: String, required: true },
  citizenPhone: { type: String },
  citizenEmail: { type: String },
  aadhaarId: { type: String },
  surveyNumber: { type: String },
  district: { type: String, required: true },
  tehsil: { type: String, required: true },
  village: { type: String, required: true },
  status: { type: String, enum: ['submitted', 'under-review', 'resolved', 'rejected'], default: 'submitted' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  dateSubmitted: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  assignedOfficer: { type: String },
  officialResponse: { type: String },
  resolutionDate: { type: Date },
  attachments: [{ type: String }],
  trackingId: { type: String, required: true, unique: true },
  txHash: { type: String } // Blockchain transaction hash for last update
}, { timestamps: true });

module.exports = mongoose.model('CitizenQuery', citizenQuerySchema);
