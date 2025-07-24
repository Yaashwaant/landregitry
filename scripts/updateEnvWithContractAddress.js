const fs = require('fs');
const path = require('path');

const artifactPath = path.join(__dirname, '../backend/build/contracts/LandAcquisition.json');
const envPath = path.join(__dirname, '../backend/.env');

function getDeployedAddress() {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const networks = artifact.networks;
  const networkIds = Object.keys(networks);
  if (networkIds.length === 0) {
    throw new Error('No deployed networks found in artifact.');
  }
  // Use the first network (latest deployment)
  const address = networks[networkIds[networkIds.length - 1]].address;
  if (!address) throw new Error('No address found in artifact for deployed network.');
  return address;
}

function updateEnv(address) {
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    // Remove any existing BLOCKCHAIN_CONTRACT_ADDRESS line
    envContent = envContent.replace(/^BLOCKCHAIN_CONTRACT_ADDRESS=.*$/m, '');
    // Remove any extra blank lines
    envContent = envContent.replace(/\n{2,}/g, '\n');
    envContent = envContent.trim() + '\n';
  }
  envContent += `BLOCKCHAIN_CONTRACT_ADDRESS=${address}\n`;
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`.env updated with BLOCKCHAIN_CONTRACT_ADDRESS=${address}`);
}

try {
  const address = getDeployedAddress();
  updateEnv(address);
} catch (err) {
  console.error('Failed to update .env:', err.message);
  process.exit(1);
} 