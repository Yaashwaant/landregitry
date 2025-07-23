const LandAcquisition = artifacts.require("LandAcquisition");

module.exports = function (deployer) {
  deployer.deploy(LandAcquisition);
};
