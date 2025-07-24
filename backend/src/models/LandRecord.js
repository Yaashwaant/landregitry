const mongoose = require('mongoose');

const landRecordSchema = new mongoose.Schema({
  surveyNumber: { type: String, required: true, unique: true },
  district: { type: String, required: true },
  tehsil: { type: String, required: true },
  village: { type: String, required: true },
  ownerName: { type: String, required: true },
  aadhaarId: { type: String, required: true },
  landType: { type: String, enum: ['agricultural', 'non-agricultural'], required: true },
  area: { type: Number, required: true },
  areaUnit: { type: String, enum: ['acres', 'hectares'], required: true },
  acquisitionStatus: { type: String, enum: ['pending', 'awarded', 'litigated', 'paid'], required: true },
  compensationAmount: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  mapImageUrl: { type: String },
  mapImageData: { type: Buffer },
  mapImageContentType: { type: String },
  dbtiId: { type: String },
  litigationCaseId: { type: String },
  notes: { type: String },
  imageUrl: { type: String }, // Path or URL to uploaded image
  txHash: { type: String } // Blockchain transaction hash for last update
}, { timestamps: true });

module.exports = mongoose.model('LandRecord', landRecordSchema);
