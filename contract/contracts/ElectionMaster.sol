pragma solidity >=0.5.0 <0.6.0;

import "./Election.sol";

contract ElectionMaster {
    /* Events */
    event NewElection(address electionAddr);

    /* Constants */
    uint16 constant sigPubLength = 128;

    /* Data Members */
    address[] public Elections;

    /* Modifiers */
    function createElection(
        uint64 _begin,
        uint64 _end,
        bytes32[] memory _tellers, // one teller takes 4 slots, then second teller
        bytes32[sigPubLength/32] memory _admin,
        bytes32[4] memory _accumBase,
        bytes32[4] memory _linkBase,
        bytes32[4] memory _accumVoters,
        bytes32[4] memory _signature
    ) public {
        uint id = Elections.push(address(new Election(_begin, _end, _tellers, _admin, _accumBase, _linkBase, _accumVoters, _signature)));
        emit NewElection(Elections[id-1]);
    }

    /* Getters */
    function getElectionsCount() public view returns(uint) { return Elections.length; }
}