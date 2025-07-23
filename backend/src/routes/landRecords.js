const express = require('express');
const crypto = require('crypto');
const LandRecord = require('../models/LandRecord');
const blockchainService = require('../blockchainService');

const router = express.Router();

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

// Get all land records
router.get('/', async (req, res) => {
  try {
    const records = await LandRecord.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get land record by survey number
router.get('/:surveyNumber', async (req, res) => {
  try {
    const record = await LandRecord.findOne({ surveyNumber: req.params.surveyNumber });
    if (!record) return res.status(404).json({ message: 'Land record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new land record
router.post('/', async (req, res) => {
  try {
    const newRecord = new LandRecord(req.body);
    await newRecord.save();

    // Compute hash and add to blockchain
    const dataHash = computeLandRecordHash(newRecord);
    // Use a default fromAddress or configure accordingly
    const fromAddress = process.env.BLOCKCHAIN_DEFAULT_ADDRESS;
    await blockchainService.addLandRecordHash(newRecord.surveyNumber, dataHash, fromAddress);

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
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

module.exports = router;
