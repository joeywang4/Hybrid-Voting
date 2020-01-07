pragma solidity >=0.5.0 <0.6.0;

contract VerifyInterface {
    function DiscreteLogVerify(
        bytes32[4] memory _y, 
        bytes32[4] memory _g, 
        bytes32[4] memory _p, 
        bytes32[4] memory _m, 
        bytes32[4] memory _s, 
        bytes32 _e
    ) public returns(bool);
    function DoubleDiscreteLogVerify(
        bytes32[4] memory _y, 
        bytes32[4] memory _g1, 
        bytes32[4] memory _g2, 
        bytes32[4] memory _p, 
        bytes32[4] memory _m, 
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
}

contract Election {
    /* Interface */
    address VerifyAddress = 0x4d2191C541a8b0b8824309C60e803FEC09999aDA; 
    VerifyInterface VerifyContract = VerifyInterface(VerifyAddress);

    /* Events */
    event NewElection(address electionAddr);
    event NewBallot(uint ballotId);

    /* Constants */
    uint16 constant sigPubLength = 128;
    uint8 constant choiceLength = 32;
    uint16 constant messageLength = 128;
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
    bytes32[4] elgamalBase;
    bytes32[4] elgamalP;

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

    function sendElgamalPubShare(uint32 tellerId, bytes32[4] memory h, bytes32[4] memory signature) public {
        require(now < begin);
        require(isValidRSASig(h, signature, tellers[tellerId]));
        tellersPubShare[tellerId] = h;
        elgamalPubKey = VerifyContract.modmulWrapper(elgamalPubKey, h, elgamalP);
    }

    function sendElgamalSecret(uint32 tellerId, bytes32[4] memory secret, bytes32[4] memory signature) public {
        require(now > end);
        require(isValidRSASig(secret, signature, tellers[tellerId]));
        require(keccak256(abi.encodePacked(VerifyContract.modexpWrapper(elgamalBase, secret, elgamalP))) == keccak256(abi.encodePacked(tellersPubShare[tellerId])));
        tellersSecret[tellerId] = secret;
    }
    
    function isValidRSASig(bytes32[4] memory message, bytes32[4] memory signature, bytes32[4] memory pubKey) public returns (bool) {
        bytes32[4] memory e = [
            bytes32(0x0000000000000000000000000000000000000000000000000000000000000000),
            bytes32(0x0000000000000000000000000000000000000000000000000000000000000000),
            bytes32(0x0000000000000000000000000000000000000000000000000000000000000000),
            bytes32(0x0000000000000000000000000000000000000000000000000000000000010001)
        ];
        return keccak256(abi.encodePacked(VerifyContract.modexpWrapper(message, e, pubKey))) == keccak256(abi.encodePacked(signature));
    }
    
    /* Getters */
    function getTellers() public view returns(bytes32[sigPubLength/32][] memory) { return tellers; }
    function getAdmin() public view returns(bytes32[sigPubLength/32] memory) { return admin; }
    function getAccumBase() public view returns(bytes32[4] memory) { return accumBase; }
    function getLinkBase() public view returns(bytes32[4] memory) { return linkBase; }
    function getSigN() public view returns(bytes32[4] memory) { return sigN; }
    function getSigPhi() public view returns(bytes32[4] memory) { return sigPhi; }
    
    /* Ballot */
    struct Ballot {
        bytes32[messageLength/32] message;
        bytes32[pubKeyAccumLength/32] pubKeyAccum;
        bytes32[linkableTagLength/32] linkableTag;
        bytes32[signatureLength/32] signature;
        bool[validatorLength] validator;
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
        require(verifyLinkableTag(_linkableTag));
        bool[validatorLength] memory validator = [false,false,false,false,false,false,false,false,false,false];
        uint id = ballots.push(Ballot(_message, _pubKeyAccum, _linkableTag, _signature, validator)) - 1;
        emit NewBallot(id);
    }
    
    function getBallotsCount() public view returns(uint) { return ballots.length; }
    function getMessage(uint32 _idx) public view returns(bytes32[messageLength/32] memory) { return ballots[_idx].message; }
    function getPubKeyAccum(uint32 _idx) public view returns(bytes32[pubKeyAccumLength/32] memory) { return ballots[_idx].pubKeyAccum; }
    function getLinkableTag(uint32 _idx) public view returns(bytes32[linkableTagLength/32] memory) { return ballots[_idx].linkableTag; }
    function getSignature(uint32 _idx) public view returns(bytes32[signatureLength/32] memory _signature) { return ballots[_idx].signature; }
    function getVaidator(uint32 _idx) public view returns(bool[validatorLength] memory) { return ballots[_idx].validator; }
    
    function verifyLinkableTag(bytes32[linkableTagLength/32] memory _linkableTag) public view returns(bool) {
        for (uint32 i=0; i<ballots.length; ++i) {
            if (keccak256(abi.encodePacked(getLinkableTag(i))) == keccak256(abi.encodePacked(_linkableTag))) return false;
        }
        return true;
    }
    
    function verifyAll(uint32 _voterId) public {
        verify1(_voterId);
        verify2(_voterId);
        verify3(_voterId);
        verify4(_voterId);
        verify5(_voterId);
        verify6(_voterId);
        verify7(_voterId);
        verify8(_voterId);
        verify9(_voterId);
        verifyL(_voterId);
    }
    
    function verify1(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T1 = [signature[0],signature[1],signature[2],signature[3]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s1 = [signature[56],signature[57],signature[58],signature[59]];
        bytes32 e1 = signature[60];
         
        ballots[_voterId].validator[0] = VerifyContract.DiscreteLogVerify(T1,g,N,m,s1,e1);
    }
    
    function verify2(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T2 = [signature[4],signature[5],signature[6],signature[7]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory h = [signature[40],signature[41],signature[42],signature[43]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s2_1 = [signature[61],signature[62],signature[63],signature[64]];
        bytes32[4] memory s2_2 = [signature[65],signature[66],signature[67],signature[68]];
        bytes32 e2 = signature[69];
         
        ballots[_voterId].validator[1] = VerifyContract.DoubleDiscreteLogVerify(T2,g,h,N,m,s2_1,s2_2,e2);
    }
    
    function verify3(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T3 = [signature[8],signature[9],signature[10],signature[11]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory s = [signature[44],signature[45],signature[46],signature[47]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s3_1 = [signature[70],signature[71],signature[72],signature[73]];
        bytes32[4] memory s3_2 = [signature[74],signature[75],signature[76],signature[77]];
        bytes32 e3 = signature[78];
         
        ballots[_voterId].validator[2] = VerifyContract.DoubleDiscreteLogVerify(T3,g,s,N,m,s3_1,s3_2,e3);
    }
    
    function verify4(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T4 = [signature[12],signature[13],signature[14],signature[15]];
        bytes32[4] memory u = accumBase;
        bytes32[4] memory y = [signature[52],signature[53],signature[54],signature[55]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s4_1 = [signature[79],signature[80],signature[81],signature[82]];
        bytes32[4] memory s4_2 = [signature[83],signature[84],signature[85],signature[86]];
        bytes32 e4 = signature[87];
         
        ballots[_voterId].validator[3] = VerifyContract.DoubleDiscreteLogVerify(T4,u,y,N,m,s4_1,s4_2,e4);
    }

    function verify5(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T5 = [signature[16],signature[17],signature[18],signature[19]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory t = [signature[48],signature[49],signature[50],signature[51]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s5_1 = [signature[88],signature[89],signature[90],signature[91]];
        bytes32[4] memory s5_2 = [signature[92],signature[93],signature[94],signature[95]];
        bytes32 e5 = signature[96];
         
        ballots[_voterId].validator[4] = VerifyContract.DoubleDiscreteLogVerify(T5,g,t,N,m,s5_1,s5_2,e5);
    }

    function verify6(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T6 = [signature[20],signature[21],signature[22],signature[23]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s6 = [signature[97],signature[98],signature[99],signature[100]];
        bytes32 e6 = signature[101];
         
        ballots[_voterId].validator[5] = VerifyContract.DiscreteLogVerify(T6,g,N,m,s6,e6);
    }

    function verify7(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T7 = [signature[24],signature[25],signature[26],signature[27]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s7 = [signature[102],signature[103],signature[104],signature[105]];
        bytes32 e7 = signature[106];
         
        ballots[_voterId].validator[6] = VerifyContract.DiscreteLogVerify(T7,g,N,m,s7,e7);
    }

    function verify8(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T8 = [signature[28],signature[29],signature[30],signature[31]];
        bytes32[4] memory u = accumBase;
        bytes32[4] memory y = [signature[52],signature[53],signature[54],signature[55]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s8_1 = [signature[107],signature[108],signature[109],signature[110]];
        bytes32[4] memory s8_2 = [signature[111],signature[112],signature[113],signature[114]];
        bytes32 e8 = signature[115];
         
        ballots[_voterId].validator[7] = VerifyContract.DoubleDiscreteLogVerify(T8,u,y,N,m,s8_1,s8_2,e8);
    }

    function verify9(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T9 = [signature[32],signature[33],signature[34],signature[35]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory t = [signature[48],signature[49],signature[50],signature[51]];
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s9_1 = [signature[116],signature[117],signature[118],signature[119]];
        bytes32[4] memory s9_2 = [signature[120],signature[121],signature[122],signature[123]];
        bytes32 e9 = signature[124];
         
        ballots[_voterId].validator[8] = VerifyContract.DoubleDiscreteLogVerify(T9,g,t,N,m,s9_1,s9_2,e9);
    }

    function verifyL(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory y_hat = ballots[_voterId].linkableTag;
        bytes32[4] memory g_theta = linkBase;
        bytes32[4] memory N = sigN;
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory sL = [signature[125],signature[126],signature[127],signature[128]];
        bytes32 eL = signature[129];
         
        ballots[_voterId].validator[9] = VerifyContract.DiscreteLogVerify(y_hat,g_theta,N,m,sL,eL);
    }
}