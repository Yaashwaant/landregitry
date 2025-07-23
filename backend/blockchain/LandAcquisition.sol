// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandAcquisition {
    struct Record {
        bytes32 dataHash;
        uint256 timestamp;
    }

    mapping(string => Record) public landRecords; // surveyNumber => Record
    mapping(string => Record) public citizenQueries; // trackingId => Record

    mapping(string => Record[]) private landRecordsHistory; // surveyNumber => array of Records
    mapping(string => Record[]) private citizenQueriesHistory; // trackingId => array of Records

    event LandRecordAdded(string surveyNumber, bytes32 dataHash, uint256 timestamp);
    event CitizenQueryAdded(string trackingId, bytes32 dataHash, uint256 timestamp);

    function addLandRecord(string memory surveyNumber, bytes32 dataHash) public {
        require(landRecords[surveyNumber].timestamp == 0, "Record already exists");
        Record memory newRecord = Record(dataHash, block.timestamp);
        landRecords[surveyNumber] = newRecord;
        landRecordsHistory[surveyNumber].push(newRecord);
        emit LandRecordAdded(surveyNumber, dataHash, block.timestamp);
    }

    function updateLandRecord(string memory surveyNumber, bytes32 dataHash) public {
        require(landRecords[surveyNumber].timestamp != 0, "Record does not exist");
        Record memory newRecord = Record(dataHash, block.timestamp);
        landRecords[surveyNumber] = newRecord;
        landRecordsHistory[surveyNumber].push(newRecord);
        emit LandRecordAdded(surveyNumber, dataHash, block.timestamp);
    }

    function addCitizenQuery(string memory trackingId, bytes32 dataHash) public {
        require(citizenQueries[trackingId].timestamp == 0, "Query already exists");
        Record memory newRecord = Record(dataHash, block.timestamp);
        citizenQueries[trackingId] = newRecord;
        citizenQueriesHistory[trackingId].push(newRecord);
        emit CitizenQueryAdded(trackingId, dataHash, block.timestamp);
    }

    function updateCitizenQuery(string memory trackingId, bytes32 dataHash) public {
        require(citizenQueries[trackingId].timestamp != 0, "Query does not exist");
        Record memory newRecord = Record(dataHash, block.timestamp);
        citizenQueries[trackingId] = newRecord;
        citizenQueriesHistory[trackingId].push(newRecord);
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

    function getLandRecordHistoryLength(string memory surveyNumber) public view returns (uint256) {
        return landRecordsHistory[surveyNumber].length;
    }

    function getCitizenQueryHistoryLength(string memory trackingId) public view returns (uint256) {
        return citizenQueriesHistory[trackingId].length;
    }

    function getLandRecordHistoryByIndex(string memory surveyNumber, uint256 index) public view returns (bytes32, uint256) {
        require(index < landRecordsHistory[surveyNumber].length, "Index out of bounds");
        Record memory record = landRecordsHistory[surveyNumber][index];
        return (record.dataHash, record.timestamp);
    }

    function getCitizenQueryHistoryByIndex(string memory trackingId, uint256 index) public view returns (bytes32, uint256) {
        require(index < citizenQueriesHistory[trackingId].length, "Index out of bounds");
        Record memory record = citizenQueriesHistory[trackingId][index];
        return (record.dataHash, record.timestamp);
    }
}
