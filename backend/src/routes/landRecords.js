const express = require('express');
const crypto = require('crypto');
const LandRecord = require('../models/LandRecord');
const blockchainService = require('../blockchainService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to compute hash of land record data
function computeLandRecordHash(record) {
  const recordString = JSON.stringify({
    surveyNumber: record.surveyNumber,
    district: record.district,
    tehsil: record.tehsil,
    village: record.village,
    ownerName: record.ownerName,
    aadhaarId: record.aadhaarId,
    landType: record.landType,
    area: record.area,
    areaUnit: record.areaUnit,
    acquisitionStatus: record.acquisitionStatus,
    compensationAmount: record.compensationAmount,
    dateCreated: record.dateCreated,
    lastUpdated: record.lastUpdated,
    mapImageUrl: record.mapImageUrl,
    dbtiId: record.dbtiId,
    litigationCaseId: record.litigationCaseId,
    notes: record.notes
  });
  return '0x' + crypto.createHash('sha256').update(recordString).digest('hex');
}

// Get all land records (include image as base64)
router.get('/', async (req, res) => {
  try {
    const records = await LandRecord.find();
    const recordsWithImage = records.map(record => {
      const rec = record.toObject();
      if (rec.mapImageData && rec.mapImageContentType) {
        rec.mapImageBase64 = `data:${rec.mapImageContentType};base64,${rec.mapImageData.toString('base64')}`;
      }
      delete rec.mapImageData;
      delete rec.mapImageContentType;
      return rec;
    });
    res.json(recordsWithImage);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get land record by survey number (include image as base64)
router.get('/:surveyNumber', async (req, res) => {
  try {
    const record = await LandRecord.findOne({ surveyNumber: req.params.surveyNumber });
    if (!record) return res.status(404).json({ message: 'Land record not found' });
    const rec = record.toObject();
    if (rec.mapImageData && rec.mapImageContentType) {
      rec.mapImageBase64 = `data:${rec.mapImageContentType};base64,${rec.mapImageData.toString('base64')}`;
    }
    delete rec.mapImageData;
    delete rec.mapImageContentType;
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new land record with image upload
router.post('/', upload.single('imageFile'), async (req, res) => {
  try {
    // Debug logging: print received body and file
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);
    const recordData = req.body;

    // Required fields
    const requiredFields = [
      'surveyNumber', 'district', 'tehsil', 'village', 'ownerName', 'aadhaarId',
      'landType', 'area', 'areaUnit', 'acquisitionStatus', 'compensationAmount'
    ];
    for (const field of requiredFields) {
      if (!recordData[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Convert numeric fields
    recordData.area = Number(recordData.area);
    recordData.compensationAmount = Number(recordData.compensationAmount);

    // Remove empty optional fields
    ['dbtiId', 'litigationCaseId', 'notes'].forEach(field => {
      if (recordData[field] === '') delete recordData[field];
    });

    // Handle image upload: save image as buffer in DB
    if (req.file) {
      recordData.mapImageData = req.file.buffer;
      recordData.mapImageContentType = req.file.mimetype;
    } else {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    // Only use schema fields
    const allowedFields = [
      'surveyNumber', 'district', 'tehsil', 'village', 'ownerName', 'aadhaarId',
      'landType', 'area', 'areaUnit', 'acquisitionStatus', 'compensationAmount',
      'dbtiId', 'litigationCaseId', 'notes', 'mapImageData', 'mapImageContentType'
    ];
    const cleanData = {};
    for (const key of allowedFields) {
      if (recordData[key] !== undefined) cleanData[key] = recordData[key];
    }

    const newRecord = new LandRecord(cleanData);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    let message = 'Invalid data';
    if (err.name === 'ValidationError') {
      message = err.message;
    } else if (err.code === 11000) {
      message = 'A record with this survey number already exists.';
    }
    res.status(400).json({ message, error: err.message });
  }
});

// Update land record by survey number
router.put('/:surveyNumber', async (req, res) => {
  try {
    const updatedRecord = await LandRecord.findOneAndUpdate(
      { surveyNumber: req.params.surveyNumber },
      req.body,
      { new: true }
    );
    if (!updatedRecord) return res.status(404).json({ message: 'Land record not found' });

    // Compute hash and update blockchain
    const dataHash = computeLandRecordHash(updatedRecord);
    const fromAddress = process.env.BLOCKCHAIN_DEFAULT_ADDRESS;
    await blockchainService.updateLandRecordHash(updatedRecord.surveyNumber, dataHash, fromAddress);

    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Delete land record by survey number
router.delete('/:surveyNumber', async (req, res) => {
  try {
    const deletedRecord = await LandRecord.findOneAndDelete({ surveyNumber: req.params.surveyNumber });
    if (!deletedRecord) return res.status(404).json({ message: 'Land record not found' });
    res.json({ message: 'Land record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve image for a land record
router.get('/:surveyNumber/image', async (req, res) => {
  try {
    const record = await LandRecord.findOne({ surveyNumber: req.params.surveyNumber });
    if (!record || !record.mapImageData) return res.status(404).json({ message: 'Image not found' });
    res.set('Content-Type', record.mapImageContentType);
    res.send(record.mapImageData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
