# Land Acquisition System

This project is a land acquisition management system with blockchain integration. It consists of a backend API server, a React frontend, and a smart contract deployed on the Ethereum Sepolia testnet.

## Prerequisites

- Node.js and npm installed
- MongoDB instance running (local or cloud)
- Access to Ethereum Sepolia testnet RPC URL (e.g., from Alchemy or Infura)
- Ethereum wallet address with testnet funds for transactions

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following variables:
   ```
   TESTNET_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
   CONTRACT_ADDRESS=0xYourDeployedContractAddress
   MONGODB_URI=your_mongodb_connection_string
   ```

   - You can get a free RPC URL by signing up at:
     - [Alchemy](https://www.alchemy.com/)
     - [Infura](https://infura.io/)
   - Deploy the smart contract to Sepolia testnet using Truffle or Hardhat to get the contract address.

4. Start the backend server in development mode:
   ```
   npm run dev
   ```

   The backend server will run on port 5000 by default.

### Frontend Setup

1. Navigate to the frontend project directory:
   ```
   cd project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000` (or the port shown in the terminal).

## Blockchain Integration

- The smart contract is deployed on the Ethereum Sepolia testnet.
- The backend connects to the blockchain using Web3 and the RPC URL provided in `.env`.
- Contract ABI is located at `backend/blockchain/LandAcquisitionABI.json`.
- Contract address is set in the `.env` file.
- The backend exposes functions to add, update, and retrieve land record and citizen query hashes on the blockchain for tamper-proof record keeping.

## Additional Notes

- Ensure your Ethereum wallet has Sepolia testnet ETH to pay for transactions.
- Use tools like [MetaMask](https://metamask.io/) to manage your wallet.
- For testing, you can add data via backend API endpoints or directly in MongoDB.

## Useful Links

- [Alchemy](https://www.alchemy.com/) - Get Sepolia RPC URL
- [Infura](https://infura.io/) - Alternative RPC provider
- [MetaMask](https://metamask.io/) - Ethereum wallet browser extension
- [Ethereum Sepolia Testnet Faucet](https://sepoliafaucet.com/) - Get free testnet ETH

## Running Tests

Currently, no automated tests are included. Manual testing is recommended by running the backend and frontend and interacting with the UI and API.

---

If you need help with deployment or further development, feel free to ask.
