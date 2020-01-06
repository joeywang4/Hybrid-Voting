pragma solidity >=0.5.0 <0.6.0;

contract ElectionMaster {
    
    event NewElection(uint electionId);
    
    uint16 constant sigPubLength = 128;
    uint8 constant choiceLength = 32;
    bytes32[4] public sigN = [
        bytes32(0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b),
        bytes32(0x56153fc51a0bd6888d53e80749b8d0f493d2895ac04524ad9fed0d79700f0282),
        bytes32(0xb6dc361e1feb0a3f8fa5f4ed9136e574ef04c9c94d22c19cfd777b531e32e7b4),
        bytes32(0x812a645af3b0248e6ed9764c8a640198ec8b9a5860ea645b08e454324e3d69e1)
    ];
    bytes32[4] sigPhi = [
        bytes32(0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b),
        bytes32(0x56153fc51a0bd6888d53e80749b8d0f493d2895ac04524ad9fed0d79700f0281),
        bytes32(0x11093ccc8bcbbf7adc039510d65bb8e6cbdfb282a99f79ccec44e83d867aea44),
        bytes32(0x234c1620817711c42c3aa84178ea6c924e31a36bc3cc82c6757a4a8e2e8f53c4)
    ];
    /*
    bytes32[4] elgamalBase;
    bytes32[4] elgamalP;
    */
    
    struct Election {
        string title;
        string description;
        uint64 begin;
        uint64 end;
        bytes32[choiceLength/32][] choices;
        bytes32[sigPubLength/32][] voters; // Should be removed
        bytes32[sigPubLength/32][] tellers;
        bytes32[sigPubLength/32] admin;
        bytes32[4] accumBase;
        bytes32[4] linkBase;
        bytes32[4] accumVoters;
        // bytes32[4][] tellers_h;
        // bytes32[4] elgamalH;
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
        bytes32[sigPubLength/32] memory _admin,
        bytes32[4] memory _accumBase,
        bytes32[4] memory _linkBase,
        bytes32[4] memory _accumVoters
    ) public {
        uint id = elections.push(Election(_title, _description, _begin, _end, _choices, _voters, _tellers, _admin, _accumBase, _linkBase, _accumVoters)) - 1;

        /*
        bytes32[4][_tellers.length] storage newTellers_h;
        for(uint i = 0; i < _tellers.length;i++) newTellers_h = [[0xffffffff...]];
        elections[elections.length].tellers_h = newTellers_h;
        */
        emit NewElection(id);
    }

    /*
    function send_h(electionId, tellerId, h, signature) public {
      tellerPubKey = elections[electionId].tellers[tellerId];
      require(isValidSignature(tellerPubKey, signature));
      elections[electionId].elgamalH = elections[electionId].elgamalH * h;
      elections[electionId].tellers_h = h;
    }
    */
    
    function getElectionsCount() public view returns(uint) { return elections.length; }
    function getChoices(uint32 _idx) public view returns(bytes32[choiceLength/32][] memory) { return elections[_idx].choices; }
    function getVoters(uint32 _idx) public view returns(bytes32[sigPubLength/32][] memory) { return elections[_idx].voters; }
    function getTellers(uint32 _idx) public view returns(bytes32[sigPubLength/32][] memory) { return elections[_idx].tellers; }
    function getAdmin(uint32 _idx) public view returns(bytes32[sigPubLength/32] memory) { return elections[_idx].admin; }
    function getAccumBase(uint32 _idx) public view returns(bytes32[4] memory) { return elections[_idx].accumBase; }
    function getLinkBase(uint32 _idx) public view returns(bytes32[4] memory) { return elections[_idx].linkBase; }
    function getSigN() public view returns(bytes32[4] memory) { return sigN; }
    function getSigPhi() public view returns(bytes32[4] memory) { return sigPhi; }
}