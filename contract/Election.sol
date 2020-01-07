pragma solidity >=0.5.0 <0.6.0;

contract Election {
    /* Events */
    event NewElection(address electionAddr);

    /* Constants */
    uint16 constant sigPubLength = 128;
    uint8 constant choiceLength = 32;
    bytes32[4] public sigN = [
        bytes32(0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b),
        bytes32(0x56153fc51a0bd6888d53e80749b8d0f493d2895ac04524ad9fed0d79700f0282),
        bytes32(0xb6dc361e1feb0a3f8fa5f4ed9136e574ef04c9c94d22c19cfd777b531e32e7b4),
        bytes32(0x812a645af3b0248e6ed9764c8a640198ec8b9a5860ea645b08e454324e3d69e1)
    ];
    bytes32[4] public sigPhi = [
        bytes32(0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b),
        bytes32(0x56153fc51a0bd6888d53e80749b8d0f493d2895ac04524ad9fed0d79700f0281),
        bytes32(0x11093ccc8bcbbf7adc039510d65bb8e6cbdfb282a99f79ccec44e83d867aea44),
        bytes32(0x234c1620817711c42c3aa84178ea6c924e31a36bc3cc82c6757a4a8e2e8f53c4)
    ];
    bytes32[4] elgamalBase;
    bytes32[4] elgamalP;

    /* Data Members */
    uint64 public begin;
    uint64 public end;
    bytes32[sigPubLength/32][] public tellers;
    bytes32[sigPubLength/32] public admin;
    uint64[] public ballots;
    bytes32[4] public accumBase;
    bytes32[4] public linkBase;
    bytes32[4] public accumVoters;
    bytes32[4][] public tellersPubShare;
    bytes32[4][] public tellersSecret;
    bytes32[4] public elgamalPubKey;

    /* Modifiers */
    constructor(
        uint64 _begin,
        uint64 _end,
        bytes32[] memory _tellers,
        bytes32[sigPubLength/32] memory _admin,
        bytes32[4] memory _accumBase,
        bytes32[4] memory _linkBase,
        bytes32[4] memory _accumVoters
    ) public {
        begin = _begin;
        end = _end;
        admin = _admin;
        accumBase = _accumBase;
        linkBase = _linkBase;
        accumVoters = _accumVoters;
        for(uint i = 0;i < (_tellers.length/4);i++) {
            tellers.push([_tellers[i*4], _tellers[i*4+1], _tellers[i*4+2], _tellers[i*4+3]]);
        }
        
        for(uint i = 0;i < tellers.length;i++) {
            tellersPubShare.push([bytes32(0), bytes32(0), bytes32(0), bytes32(uint(1))]);
            tellersSecret.push([bytes32(0), bytes32(0), bytes32(0), bytes32(0)]);
        }
        elgamalPubKey = [bytes32(0), bytes32(0), bytes32(0), bytes32(uint(1))];
        emit NewElection(address(this));
    }

    /*
    function sendElgamalPubShare(electionId, tellerId, h, signature) public {
        // TODO
        Election storage _election = elections[electionId];
        require(now < _election.begin)
        tellerPubKey = _election.tellers[tellerId];
        require(isValidSignature(tellerPubKey, signature));
        elections[electionId].elgamalPubKey = elections[electionId].elgamalH * h;
        elections[electionId].tellersPubShare[tellerId] = h;
    }
    */

    /*
    function sendElgamalSecret(electionId, tellerId, secret, signature) public {
        // TODO
        Election storage _election = elections[electionId];
        require(now > _election.end);
        bytes32[sigPubLength/32] memory tellerPubKey = _election.tellers[tellerId];
        require(isValidSignature(tellerPubKey, signature));
        require(exp(elgamalBase, secret) == _election.tellersPubShare[tellerId])
        _election.tellersSecret[tellerId] = secret;
    }
    */

    /*
    function castBallot() public {
        require(now > begin);
        require(now < end);
        // TODO
    }
    */

    /* Getters */
    function getTellers() public view returns(bytes32[sigPubLength/32][] memory) { return tellers; }
    function getAdmin() public view returns(bytes32[sigPubLength/32] memory) { return admin; }
    function getAccumBase() public view returns(bytes32[4] memory) { return accumBase; }
    function getLinkBase() public view returns(bytes32[4] memory) { return linkBase; }
    function getSigN() public view returns(bytes32[4] memory) { return sigN; }
    function getSigPhi() public view returns(bytes32[4] memory) { return sigPhi; }
}