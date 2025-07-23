// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandAcquisition {
    struct Record {
        bytes32 dataHash;
        uint256 timestamp;
    }

    mapping(string => Record) public landRecords; // surveyNumber => Record
    mapping(string => Record) public citizenQueries; // trackingId => Record

    event LandRecordAdded(string surveyNumber, bytes32 dataHash, uint256 timestamp);
    event CitizenQueryAdded(string trackingId, bytes32 dataHash, uint256 timestamp);

    function addLandRecord(string memory surveyNumber, bytes32 dataHash) public {
        require(landRecords[surveyNumber].timestamp == 0, "Record already exists");
        landRecords[surveyNumber] = Record(dataHash, block.timestamp);
        emit LandRecordAdded(surveyNumber, dataHash, block.timestamp);
    }

    function updateLandRecord(string memory surveyNumber, bytes32 dataHash) public {
        require(landRecords[surveyNumber].timestamp != 0, "Record does not exist");
        landRecords[surveyNumber] = Record(dataHash, block.timestamp);
        emit LandRecordAdded(surveyNumber, dataHash, block.timestamp);
    }

    function addCitizenQuery(string memory trackingId, bytes32 dataHash) public {
        require(citizenQueries[trackingId].timestamp == 0, "Query already exists");
        citizenQueries[trackingId] = Record(dataHash, block.timestamp);
        emit CitizenQueryAdded(trackingId, dataHash, block.timestamp);
    }

    function updateCitizenQuery(string memory trackingId, bytes32 dataHash) public {
        require(citizenQueries[trackingId].timestamp != 0, "Query does not exist");
        citizenQueries[trackingId] = Record(dataHash, block.timestamp);
        emit CitizenQueryAdded(trackingId, dataHash, block.timestamp);
    }

    function getLandRecordHash(string memory surveyNumber) public view returns (bytes32, uint256) {
        Record memory record = landRecords[surveyNumber];
        return (record.dataHash, record.timestamp);
    }

    function getCitizenQueryHash(string memory trackingId) public view returns (bytes32, uint256) {
        Record memory record = citizenQueries[trackingId];
        return (record.dataHash, record.timestamp);
    }
}
