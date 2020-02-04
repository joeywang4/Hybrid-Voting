const ElectionMaster = artifacts.require("ElectionMaster");
const Election = artifacts.require("Election");
const Verify = artifacts.require("Verify");
const BigNumber = artifacts.require("BigNumber");


module.exports = function(deployer) {
  deployer.deploy(BigNumber);
  deployer.link(BigNumber, Verify);
  deployer.deploy(Verify);
  deployer.link(Verify, Election);
  deployer.link(Verify, ElectionMaster);
  deployer.deploy(ElectionMaster);
};