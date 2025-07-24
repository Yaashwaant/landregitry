const express = require('express');
const crypto = require('crypto');
const CitizenQuery = require('../models/CitizenQuery');
const blockchainService = require('../blockchainService');

const router = express.Router();

// Helper to compute hash of citizen query data
function computeCitizenQueryHash(query) {
  const queryString = JSON.stringify({
    queryType: query.queryType,
    title: query.title,
    description: query.description,
    citizenName: query.citizenName,
    citizenPhone: query.citizenPhone,
    citizenEmail: query.citizenEmail,
    aadhaarId: query.aadhaarId,
    surveyNumber: query.surveyNumber,
    district: query.district,
    tehsil: query.tehsil,
    village: query.village,
    status: query.status,
    priority: query.priority,
    dateSubmitted: query.dateSubmitted,
    lastUpdated: query.lastUpdated,
    assignedOfficer: query.assignedOfficer,
    officialResponse: query.officialResponse,
    resolutionDate: query.resolutionDate,
    attachments: query.attachments,
    trackingId: query.trackingId
  });
  return '0x' + crypto.createHash('sha256').update(queryString).digest('hex');
}

// Get all citizen queries
router.get('/', async (req, res) => {
  try {
    const queries = await CitizenQuery.find();
    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get query by tracking ID
router.get('/:trackingId', async (req, res) => {
  try {
    const query = await CitizenQuery.findOne({ trackingId: req.params.trackingId });
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json(query);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new citizen query
router.post('/', async (req, res) => {
  console.log("POST /api/citizenQueries called");
  try {
    // Generate a unique trackingId if not provided
    let trackingId = req.body.trackingId;
    if (!trackingId) {
      const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      const year = new Date().getFullYear();
      trackingId = `TRK-${year}-${random}`;
    }
    // Set dateSubmitted and lastUpdated if not provided
    const now = new Date();
    const dateSubmitted = req.body.dateSubmitted ? new Date(req.body.dateSubmitted) : now;
    const lastUpdated = req.body.lastUpdated ? new Date(req.body.lastUpdated) : now;
    // Build the query object
    const queryData = {
      ...req.body,
      trackingId,
      dateSubmitted,
      lastUpdated
    };
    const newQuery = new CitizenQuery(queryData);
    await newQuery.save();

    // Compute hash and add to blockchain
    const dataHash = computeCitizenQueryHash(newQuery);
    console.log(`[BLOCKCHAIN] Citizen query hash: trackingId=${newQuery.trackingId}, dataHash=${dataHash}`);
    const fromAddress = process.env.BLOCKCHAIN_DEFAULT_ADDRESS;
    try {
      const receipt = await blockchainService.addCitizenQueryHash(newQuery.trackingId, dataHash, fromAddress);
      newQuery.txHash = receipt.transactionHash;
      await newQuery.save();
      console.log(`[BLOCKCHAIN] Citizen query registered: trackingId=${newQuery.trackingId}, txHash=${receipt.transactionHash}`);
    } catch (err) {
      console.error(`[BLOCKCHAIN ERROR] Failed to register citizen query: trackingId=${newQuery.trackingId}`, err);
    }

    res.status(201).json(newQuery);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Update citizen query by tracking ID
router.put('/:trackingId', async (req, res) => {
  console.log("PUT /api/citizenQueries/:trackingId called");
  try {
    const updatedQuery = await CitizenQuery.findOneAndUpdate(
      { trackingId: req.params.trackingId },
      req.body,
      { new: true }
    );
    if (!updatedQuery) return res.status(404).json({ message: 'Query not found' });

    // Compute hash and update blockchain
    const dataHash = computeCitizenQueryHash(updatedQuery);
    const fromAddress = process.env.BLOCKCHAIN_DEFAULT_ADDRESS;
    try {
      const receipt = await blockchainService.updateCitizenQueryHash(updatedQuery.trackingId, dataHash, fromAddress);
      updatedQuery.txHash = receipt.transactionHash;
      await updatedQuery.save();
      console.log(`[BLOCKCHAIN] Citizen query updated: trackingId=${updatedQuery.trackingId}, txHash=${receipt.transactionHash}`);
    } catch (err) {
      console.error(`[BLOCKCHAIN ERROR] Failed to update citizen query: trackingId=${updatedQuery.trackingId}`, err);
    }

    res.json(updatedQuery);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Delete citizen query by tracking ID
router.delete('/:trackingId', async (req, res) => {
  try {
    const deletedQuery = await CitizenQuery.findOneAndDelete({ trackingId: req.params.trackingId });
    if (!deletedQuery) return res.status(404).json({ message: 'Query not found' });
    res.json({ message: 'Query deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
