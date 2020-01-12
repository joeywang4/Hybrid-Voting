pragma solidity >=0.5.0 <0.6.0;

contract VerifyInterface {
    function DiscreteLogVerify(
        bytes32[4] memory _y,
        bytes32[4] memory _g,
        bytes32[4] memory _p,
        bytes32[8] memory _m,
        bytes32[4] memory _s,
        bytes32 _e
    ) public returns(bool);
    function DoubleDiscreteLogVerify(
        bytes32[4] memory _y,
        bytes32[4] memory _g1,
        bytes32[4] memory _g2,
        bytes32[4] memory _p,
        bytes32[8] memory _m,
        bytes32[4] memory _s1,
        bytes32[4] memory _s2,
        bytes32 _e
    ) public returns(bool);
    function modmulWrapper(
        bytes32[4] memory _a,
        bytes32[4] memory _b,
        bytes32[4] memory _m
    ) public returns (bytes32[4] memory);
    function modexpWrapper(
        bytes32[4] memory _b,
        bytes32[4] memory _e,
        bytes32[4] memory _m
    ) public returns (bytes32[4] memory);
    function isValidRSASig(
        bytes32[4] memory message,
        bytes32[4] memory signature,
        bytes32[4] memory pubKey
    ) public returns (bool);
}

contract Election {
    /* Interface */
    address VerifyAddress = 0xf9B1E4298d4cFa18Dce559A3033eDb8Dd9A7b421;
    VerifyInterface VerifyContract = VerifyInterface(VerifyAddress);

    /* Events */
    event NewElection(address electionAddr);
    event NewBallot(uint ballotId);

    /* Constants */
    uint16 constant sigPubLength = 128;
    uint8 constant choiceLength = 32;
    uint16 constant messageLength = 256; // 2048 bits elgamal c1,c2
    uint16 constant pubKeyAccumLength = 128;
    uint16 constant linkableTagLength = 128;
    uint16 constant signatureLength = 4160;
    // T1,T2,T3,T4,T5,T6,T7,T8,T9,g, h, s, t, y, s1,e1,s2_1,s2_2,e2,s3_1,s3_2,e3,s4_1,s4_2,e4,s5_1,s5_2,e5,s6,e6, s7, e7, s8_1,s8_2,e8, s9_1,s9_2,e9, sL, eL
    // 0, 4, 8, 12,16,20,24,28,32,36,40,44,48,52,56,60,61,  65,  69,70,  74,  78,79,  83,  87,88,  92,  96,97,101,102,106,107, 111, 115,116, 120, 124,125,129
    uint8 constant validatorLength = 10;
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
    bytes32[4] elgamalBase = [
        bytes32(0x86903f29644f242c0963c68203b0b2aee30f03f91d0782729783075abfca89a0),
        bytes32(0x07c6ac738ccfb57a76221f2d6a5f00b6249aab653ec07d15ace1cffefeeeff91),
        bytes32(0x82b1683ed0173e6938435d1ce601bc3734f24c77c7b6b881d0e835c27723ba31),
        bytes32(0x6e7a5b5915bd1a3d2dfd136c5c89663262bdc5ad4dfff4186818268c00858ec4)
    ]; // g = 94493677743813493826267353152185494723850760297241471026510779195400035093064059658637922030753272252229887777337187403118339807328050159324387981312700218892075674706253481675394746745490735054028566111895967522695535805037290910029370742764336097606181330224189064370356170285380952152352173575800325770948
    bytes32[4] elgamalP = [
        bytes32(0x922d4cf5211046382947a6b76da9def5ddd8718e6f5b84bd664a77c0d94d038c),
        bytes32(0xfa9b8604690073cca075dad2ce7a6a0f72a3e1c47fb00238b279cf7e908574c5),
        bytes32(0x49d664940253b78a1aa901720d3fa053ddfbcdcd0905a8a90c6eb608392d391c),
        bytes32(0x5b1027ad538528c2a7b90f972f5d192aaa8260607065118388e630b7dab03753)
    ]; // p = 102648948995783859628452780494099717822287635561446366331725315272293345387669956950442649074663459456478568581507919894184222367303997219280688270532431124107487597857112966811552274209131788409322689569545240612203934874336065981768695371646361093913954082413486674211271105045172480352791209828988862084947

    /* Data Members */
    uint64 public begin;
    uint64 public end;
    bytes32[sigPubLength/32][] public tellers;
    bytes32[sigPubLength/32] public admin;
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
        bytes32[4] memory _accumVoters,
        bytes32[4] memory _signature
    ) public {
        bytes memory packed = abi.encodePacked(_begin, _end, _tellers, _admin, _accumBase, _linkBase, _accumVoters);
        require(VerifyContract.isValidRSASig([ bytes32(0), bytes32(0), bytes32(0), keccak256(packed)], _signature, _admin), "Bad Signature");
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

    function sendElgamalPubShare(uint32 tellerId, bytes32[4] memory h, bytes32[4] memory signature) public {
        require(now < begin);
        require(keccak256(abi.encodePacked(tellersPubShare[tellerId])) == keccak256(abi.encodePacked([bytes32(0), bytes32(0), bytes32(0), bytes32(uint(1))])), "No Double Sharing");
        require(VerifyContract.isValidRSASig([bytes32(0), bytes32(0), bytes32(0), keccak256(abi.encodePacked(h))], signature, tellers[tellerId]), "Bad Signature");
        tellersPubShare[tellerId] = h;
        elgamalPubKey = VerifyContract.modmulWrapper(elgamalPubKey, h, elgamalP);
    }

    function sendElgamalSecret(uint32 tellerId, bytes32[4] memory secret, bytes32[4] memory signature) public {
        require(now > end);
        require(VerifyContract.isValidRSASig([bytes32(0), bytes32(0), bytes32(0), keccak256(abi.encodePacked(secret))], signature, tellers[tellerId]), "Bad Signature");
        require(keccak256(abi.encodePacked(VerifyContract.modexpWrapper(elgamalBase, secret, elgamalP))) == keccak256(abi.encodePacked(tellersPubShare[tellerId])), "Bad Secret");
        tellersSecret[tellerId] = secret;
    }

    /* Getters */
    function getTellers() public view returns(bytes32[sigPubLength/32][] memory) { return tellers; }
    function getAdmin() public view returns(bytes32[sigPubLength/32] memory) { return admin; }
    function getAccumBase() public view returns(bytes32[4] memory) { return accumBase; }
    function getLinkBase() public view returns(bytes32[4] memory) { return linkBase; }
    function getAccumVoters() public view returns(bytes32[4] memory) { return accumVoters; }
    function getElgamalPubKey() public view returns(bytes32[4] memory) { return elgamalPubKey; }
    function getSigN() public view returns(bytes32[4] memory) { return sigN; }
    function getSigPhi() public view returns(bytes32[4] memory) { return sigPhi; }
    function getTellersPubShare() public view returns(bytes32[4][] memory) { return tellersPubShare; }
    function getTellersSecret() public view returns(bytes32[4][] memory) { return tellersSecret; }

    /* Ballot */
    struct Ballot {
        bytes32[messageLength/32] message; // elgamal (c1,c2)
        bytes32[pubKeyAccumLength/32] pubKeyAccum;
        bytes32[linkableTagLength/32] linkableTag;
        bytes32[signatureLength/32] signature;
        uint8[validatorLength] validator;
    }
    Ballot[] private ballots;

    function castBallot (
        bytes32[messageLength/32] memory _message,
        bytes32[pubKeyAccumLength/32] memory _pubKeyAccum,
        bytes32[linkableTagLength/32] memory _linkableTag,
        bytes32[signatureLength/32] memory _signature
    ) public {
        require(now >= begin);
        require(now <= end);
        require(keccak256(abi.encodePacked(_pubKeyAccum)) == keccak256(abi.encodePacked(accumVoters)));
        require(verifyLinkableTag(_linkableTag), "Bad linkableTag");
        uint8[validatorLength] memory validator = [0,0,0,0,0,0,0,0,0,0];
        uint id = ballots.push(Ballot(_message, _pubKeyAccum, _linkableTag, _signature, validator)) - 1;
        require(VerifySignature(uint32(id), 9), "Bad linkable tag signature");
        emit NewBallot(id);
    }

    function getBallotsCount() public view returns(uint) { return ballots.length; }
    function getMessage(uint32 _idx) public view returns(bytes32[messageLength/32] memory) { return ballots[_idx].message; }
    function getPubKeyAccum(uint32 _idx) public view returns(bytes32[pubKeyAccumLength/32] memory) { return ballots[_idx].pubKeyAccum; }
    function getLinkableTag(uint32 _idx) public view returns(bytes32[linkableTagLength/32] memory) { return ballots[_idx].linkableTag; }
    function getSignature(uint32 _idx) public view returns(bytes32[signatureLength/32] memory _signature) { return ballots[_idx].signature; }
    function getVaidator(uint32 _idx) public view returns(uint8[validatorLength] memory) { return ballots[_idx].validator; }

    function verifyLinkableTag(bytes32[linkableTagLength/32] memory _linkableTag) public view returns(bool) {
        for (uint32 i = 0; i<ballots.length; ++i) {
            if (keccak256(abi.encodePacked(getLinkableTag(i))) == keccak256(abi.encodePacked(_linkableTag))) return false;
        }
        return true;
    }

    function verify1 (uint32 _voterId) public {
        VerifySignature(_voterId, 0);
        VerifySignature(_voterId, 1);
        VerifySignature(_voterId, 2);
    }

    function verify2 (uint32 _voterId) public {
        VerifySignature(_voterId, 3);
        VerifySignature(_voterId, 4);
        VerifySignature(_voterId, 5);
    }
    
    function verify3 (uint32 _voterId) public {
        VerifySignature(_voterId, 6);
        VerifySignature(_voterId, 7);
        VerifySignature(_voterId, 8);
    }

    uint32[7][10] index = [
    //    T,  g,   h,  s1,  s2,  e,
        [ 0, 36,  36,  56,  56,  60, 0],
        [ 4, 36,  40,  61,  65,  69, 1],
        [ 8, 36,  44,  70,  74,  78, 1],
        [12,  0,  52,  79,  83,  87, 1], // g=0 is accumBase
        [16, 36,  48,  88,  92,  96, 1],
        [20, 36,  36,  97,  97, 101, 0],
        [24, 36,  36, 102, 102, 106, 0],
        [28,  0,  52, 107, 111, 115, 1], // g=0 is accumbase
        [32, 36,  48, 116, 120, 124, 1],
        [ 0,  0,   0, 125, 125, 129, 0]  // linkableTag
    ];

    function VerifySignature (uint32 _voterId, uint32 i) private returns (bool) {
        require (i >= 0 && i <= 9, "Bad verify stage");
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T;
        bytes32[4] memory g;
        if (i==9) {
            T = ballots[_voterId].linkableTag;
            g = linkBase;
        }
        else {
            T = [signature[index[i][0]],signature[index[i][0]+1],signature[index[i][0]+2],signature[index[i][0]+3]];
            if (index[i][1] == 0) g = accumBase;
            else g = [signature[index[i][1]],signature[index[i][1]+1],signature[index[i][1]+2],signature[index[i][1]+3]];
        }
        bytes32[4] memory h = [signature[index[i][2]],signature[index[i][2]+1],signature[index[i][2]+2],signature[index[i][2]+3]];
        bytes32[8] memory m = ballots[_voterId].message;
        bytes32[4] memory s1 = [signature[index[i][3]],signature[index[i][3]+1],signature[index[i][3]+2],signature[index[i][3]+3]];
        bytes32[4] memory s2 = [signature[index[i][4]],signature[index[i][4]+1],signature[index[i][4]+2],signature[index[i][4]+3]];
        bytes32 e = signature[index[i][5]];
        bool result;
        if (index[i][6] == 0)
            result = VerifyContract.DiscreteLogVerify(T,g,sigN,m,s1,e);
        else
            result = VerifyContract.DoubleDiscreteLogVerify(T,g,h,sigN,m,s1,s2,e);
        
        if (result) ballots[_voterId].validator[i] = 2;
        else ballots[_voterId].validator[i] = 1;
        
        return result;
    }
}