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
const upload = multer();

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

// Create new land record (no image upload, but support FormData fields)
router.post('/', upload.none(), async (req, res) => {
  try {
    console.log('POST /api/landRecords received body:', req.body);
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

    // Only use schema fields
    const allowedFields = [
      'surveyNumber', 'district', 'tehsil', 'village', 'ownerName', 'aadhaarId',
      'landType', 'area', 'areaUnit', 'acquisitionStatus', 'compensationAmount',
      'dbtiId', 'litigationCaseId', 'notes'
    ];
    const cleanData = {};
    for (const key of allowedFields) {
      if (recordData[key] !== undefined) cleanData[key] = recordData[key];
    }

    const newRecord = new LandRecord(cleanData);
    await newRecord.save();

    // Generate the hash
    const dataHash = computeLandRecordHash(newRecord);
    console.log(`[LAND RECORD HASH] surveyNumber=${newRecord.surveyNumber}, hash=${dataHash}`);

    // Register on blockchain
    const fromAddress = process.env.BLOCKCHAIN_DEFAULT_ADDRESS;
    try {
      const receipt = await blockchainService.addLandRecordHash(newRecord.surveyNumber, dataHash, fromAddress);
      newRecord.txHash = receipt.transactionHash;
      await newRecord.save();
      console.log(`[BLOCKCHAIN] Land record registered: surveyNumber=${newRecord.surveyNumber}, txHash=${receipt.transactionHash}`);
    } catch (err) {
      console.error(`[BLOCKCHAIN ERROR] Failed to register land record: surveyNumber=${newRecord.surveyNumber}`, err);
    }

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

// Update land record by survey number (no image upload, but support FormData fields)
router.put('/:surveyNumber', upload.none(), async (req, res) => {
  try {
    console.log('PUT /api/landRecords/:surveyNumber received body:', req.body);
    const updateData = req.body;
    // Convert numeric fields
    if (updateData.area) updateData.area = Number(updateData.area);
    if (updateData.compensationAmount) updateData.compensationAmount = Number(updateData.compensationAmount);
    // Remove empty optional fields
    ['dbtiId', 'litigationCaseId', 'notes'].forEach(field => {
      if (updateData[field] === '') delete updateData[field];
    });
    // Only use schema fields
    const allowedFields = [
      'district', 'tehsil', 'village', 'ownerName', 'aadhaarId',
      'landType', 'area', 'areaUnit', 'acquisitionStatus', 'compensationAmount',
      'dbtiId', 'litigationCaseId', 'notes'
    ];
    const cleanData = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) cleanData[key] = updateData[key];
    }
    const updatedRecord = await LandRecord.findOneAndUpdate(
      { surveyNumber: req.params.surveyNumber },
      cleanData,
      { new: true }
    );
    if (!updatedRecord) return res.status(404).json({ message: 'Land record not found' });

    // Generate the hash
    const dataHash = computeLandRecordHash(updatedRecord);
    const fromAddress = process.env.BLOCKCHAIN_DEFAULT_ADDRESS;
    try {
      const receipt = await blockchainService.updateLandRecordHash(updatedRecord.surveyNumber, dataHash, fromAddress);
      updatedRecord.txHash = receipt.transactionHash;
      await updatedRecord.save();
      console.log(`[BLOCKCHAIN] Land record updated: surveyNumber=${updatedRecord.surveyNumber}, txHash=${receipt.transactionHash}`);
    } catch (err) {
      console.error(`[BLOCKCHAIN ERROR] Failed to update land record: surveyNumber=${updatedRecord.surveyNumber}`, err);
    }

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
