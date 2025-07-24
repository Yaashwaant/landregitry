const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const providerUrl = process.env.TESTNET_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/tD5ZhyZ_mPsxyZAIuoJPm';
const contractAddress = process.env.CONTRACT_ADDRESS || '0xF24f09Dd8a5DAC0dB39403B1EF09D654fcA20422';

const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const contractJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../blockchain/LandAcquisitionABI.json'), 'utf-8'));
const contractAbi = contractJson.abi;

const contract = new web3.eth.Contract(contractAbi, contractAddress);

async function addLandRecordHash(surveyNumber, dataHash, fromAddress) {
  try {
    const receipt = await contract.methods.addLandRecord(surveyNumber, dataHash).send({ from: fromAddress });
    console.log(`[BLOCKCHAIN] Land record registered: surveyNumber=${surveyNumber}, txHash=${receipt.transactionHash}`);
    return receipt;
  } catch (err) {
    console.error(`[BLOCKCHAIN ERROR] Failed to register land record: surveyNumber=${surveyNumber}`, err);
    throw err;
  }
}

async function updateLandRecordHash(surveyNumber, dataHash, fromAddress) {
  try {
    const receipt = await contract.methods.updateLandRecord(surveyNumber, dataHash).send({ from: fromAddress });
    console.log(`[BLOCKCHAIN] Land record updated: surveyNumber=${surveyNumber}, txHash=${receipt.transactionHash}`);
    return receipt;
  } catch (err) {
    console.error(`[BLOCKCHAIN ERROR] Failed to update land record: surveyNumber=${surveyNumber}`, err);
    throw err;
  }
}

async function addCitizenQueryHash(trackingId, dataHash, fromAddress) {
  try {
    const receipt = await contract.methods.addCitizenQuery(trackingId, dataHash).send({ from: fromAddress });
    console.log(`[BLOCKCHAIN] Citizen query registered: trackingId=${trackingId}, txHash=${receipt.transactionHash}`);
    return receipt;
  } catch (err) {
    console.error(`[BLOCKCHAIN ERROR] Failed to register citizen query: trackingId=${trackingId}`, err);
    throw err;
  }
}

async function updateCitizenQueryHash(trackingId, dataHash, fromAddress) {
  try {
    const receipt = await contract.methods.updateCitizenQuery(trackingId, dataHash).send({ from: fromAddress });
    console.log(`[BLOCKCHAIN] Citizen query updated: trackingId=${trackingId}, txHash=${receipt.transactionHash}`);
    return receipt;
  } catch (err) {
    console.error(`[BLOCKCHAIN ERROR] Failed to update citizen query: trackingId=${trackingId}`, err);
    throw err;
  }
}

async function getLandRecordHash(surveyNumber) {
  return contract.methods.getLandRecordHash(surveyNumber).call();
}

async function getCitizenQueryHash(trackingId) {
  return contract.methods.getCitizenQueryHash(trackingId).call();
}

async function getLandRecordHistoryLength(surveyNumber) {
  return contract.methods.getLandRecordHistoryLength(surveyNumber).call();
}

async function getCitizenQueryHistoryLength(trackingId) {
  return contract.methods.getCitizenQueryHistoryLength(trackingId).call();
}

async function getLandRecordHistoryByIndex(surveyNumber, index) {
  return contract.methods.getLandRecordHistoryByIndex(surveyNumber, index).call();
}

async function getCitizenQueryHistoryByIndex(trackingId, index) {
  return contract.methods.getCitizenQueryHistoryByIndex(trackingId, index).call();
}

module.exports = {
  addLandRecordHash,
  updateLandRecordHash,
  addCitizenQueryHash,
  updateCitizenQueryHash,
  getLandRecordHash,
  getCitizenQueryHash,
  getLandRecordHistoryLength,
  getCitizenQueryHistoryLength,
  getLandRecordHistoryByIndex,
  getCitizenQueryHistoryByIndex
};
