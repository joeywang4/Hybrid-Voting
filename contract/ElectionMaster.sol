pragma solidity >=0.5.0 <0.6.0;

contract ElectionMaster {
    
    event NewElection(uint electionId);
    
    uint16 constant sigPubLength = 1024;
    uint8 constant choiceLength = 32;
    
    
    struct Election {
        string title;
        string description;
        uint64 begin;
        uint64 end;
        bytes32[choiceLength/32][] choices;
        bytes32[sigPubLength/32][] voters;
        bytes32[sigPubLength/32][] tellers;
        bytes32[sigPubLength/32] admin;
    }
    
    Election[] public elections;
    
    function createElection(
        string memory _title, 
        string memory _description, 
        uint64 _begin, 
        uint64 _end, 
        bytes32[choiceLength/32][] memory _choices, 
        bytes32[sigPubLength/32][] memory _voters,
        bytes32[sigPubLength/32][] memory _tellers,
        bytes32[sigPubLength/32] memory _admin
    ) public {
        uint id = elections.push(Election(_title, _description, _begin, _end, _choices, _voters, _tellers, _admin)) - 1;
        emit NewElection(id);
    }
    
    function getElectionsCount() public view returns(uint) { return elections.length; }
    function getChoices(uint32 _idx) public view returns(bytes32[choiceLength/32][] memory) { return elections[_idx].choices; }
    function getVoters(uint32 _idx) public view returns(bytes32[sigPubLength/32][] memory) { return elections[_idx].voters; }
    function getTellers(uint32 _idx) public view returns(bytes32[sigPubLength/32][] memory) { return elections[_idx].tellers; }
    function getAdmin(uint32 _idx) public view returns(bytes32[sigPubLength/32] memory) { return elections[_idx].admin; }
}