# Land Acquisition Backend

## Setup

1. Install dependencies:
```
npm install
```

2. Set up MongoDB and update `.env` file with your MongoDB URI.

3. Start a local blockchain (e.g., Ganache) and deploy the `LandAcquisition.sol` smart contract.
   - Compile and deploy the contract using Remix or Truffle.
   - Update `.env` with the deployed contract address and default account address.

4. Start the backend server:
```
npm run dev
```

## API Endpoints

- `POST /api/auth/official-login` - Official user login
- `POST /api/auth/citizen-login` - Citizen login by Aadhaar ID
- `GET /api/land-records` - Get all land records
- `GET /api/land-records/:surveyNumber` - Get land record by survey number
- `POST /api/land-records` - Create new land record
- `PUT /api/land-records/:surveyNumber` - Update land record
- `DELETE /api/land-records/:surveyNumber` - Delete land record
- `GET /api/citizen-queries` - Get all citizen queries
- `GET /api/citizen-queries/:trackingId` - Get query by tracking ID
- `POST /api/citizen-queries` - Create new citizen query
- `PUT /api/citizen-queries/:trackingId` - Update citizen query
- `DELETE /api/citizen-queries/:trackingId` - Delete citizen query

## Blockchain Integration

- Land records and citizen queries are hashed and stored on the blockchain for immutability.
- The backend interacts with the smart contract to add and update hashes.

## Notes

- Authentication middleware is implemented to protect routes (to be integrated).
- Frontend integration with backend APIs is pending.
