pragma solidity >=0.5 <0.6;

contract ElectionMasterInterface {
    function getSigN() public view returns(bytes32[4] memory);
    function getAccumBase(uint32 _idx) public view returns(bytes32[4] memory);
    function getLinkBase(uint32 _idx) public view returns(bytes32[4] memory);
}

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
}

contract BallotMaster {
    address ElectionMasterAddress = 0xbfCEBb970b01933B9cAC43F7aCf5FB39A64c4AE8;
    ElectionMasterInterface ElectionMasterContract = ElectionMasterInterface(ElectionMasterAddress);
    
    address VerifyAddress = 0x4d2191C541a8b0b8824309C60e803FEC09999aDA; 
    VerifyInterface VerifyContract = VerifyInterface(VerifyAddress);

    event NewBallot(uint ballotId);
    
    uint16 constant messageLength = 128;
    uint16 constant pubKeyAccumLength = 128;
    uint16 constant linkableTagLength = 128;
    uint16 constant signatureLength = 4160; 
    // T1,T2,T3,T4,T5,T6,T7,T8,T9,g, h, s, t, y, s1,e1,s2_1,s2_2,e2,s3_1,s3_2,e3,s4_1,s4_2,e4,s5_1,s5_2,e5,s6,e6, s7, e7, s8_1,s8_2,e8, s9_1,s9_2,e9, sL, eL
    // 0, 4, 8, 12,16,20,24,28,32,36,40,44,48,52,56,60,61,  65,  69,70,  74,  78,79,  83,  87,88,  92,  96,97,101,102,106,107, 111, 115,116, 120, 124,125,129
    uint8 constant validatorLength = 10;
    
    struct Ballot {
        bytes32[messageLength/32] message;
        bytes32[pubKeyAccumLength/32] pubKeyAccum;
        bytes32[linkableTagLength/32] linkableTag;
        bytes32[signatureLength/32] signature;
        bool[validatorLength] validator;
    }
    
    Ballot[] private ballots;
    
    function recieveBallot (
        bytes32[messageLength/32] memory _message,
        bytes32[pubKeyAccumLength/32] memory _pubKeyAccum,
        bytes32[linkableTagLength/32] memory _linkableTag,
        bytes32[signatureLength/32] memory _signature
    ) public {
        bool[validatorLength] memory validator = [false,false,false,false,false,false,false,false,false,false];
        require(verifyLinkableTag(_linkableTag));
        uint id = ballots.push(Ballot(_message, _pubKeyAccum, _linkableTag, _signature, validator)) - 1;
        emit NewBallot(id);
    }
    function getBallotsCount() public view returns(uint) { return ballots.length; }
    function getMessage(uint32 _idx) public view returns(bytes32[messageLength/32] memory) { return ballots[_idx].message; }
    function getPubKeyAccum(uint32 _idx) public view returns(bytes32[pubKeyAccumLength/32] memory) { return ballots[_idx].pubKeyAccum; }
    function getLinkableTag(uint32 _idx) public view returns(bytes32[linkableTagLength/32] memory) { return ballots[_idx].linkableTag; }
    function getSignature(uint32 _idx) public view returns(bytes32[signatureLength/32] memory _signature) { return ballots[_idx].signature; }
    function getVaidator(uint32 _idx) public view returns(bool[validatorLength] memory) { return ballots[_idx].validator; }
    
    function verifyPubKeyAccum(uint32 _idx, bytes32[pubKeyAccumLength/32] memory _v) public view returns (bool) {
        return keccak256(abi.encodePacked(getPubKeyAccum(_idx))) == keccak256(abi.encodePacked(_v));
    }
    
    function verifyLinkableTag(bytes32[linkableTagLength/32] memory _linkableTag) private view returns(bool) {
        for (uint32 i=0; i<ballots.length; ++i) {
            if (keccak256(abi.encodePacked(getLinkableTag(i))) == keccak256(abi.encodePacked(_linkableTag))) return false;
        }
        return true;
    }
    
    function verify1(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T1 = [signature[0],signature[1],signature[2],signature[3]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
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
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
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
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s3_1 = [signature[70],signature[71],signature[72],signature[73]];
        bytes32[4] memory s3_2 = [signature[74],signature[75],signature[76],signature[77]];
        bytes32 e3 = signature[78];
         
        ballots[_voterId].validator[2] = VerifyContract.DoubleDiscreteLogVerify(T3,g,s,N,m,s3_1,s3_2,e3);
    }
    
    function verify4(uint32 _electionId, uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T4 = [signature[12],signature[13],signature[14],signature[15]];
        bytes32[4] memory u = ElectionMasterContract.getAccumBase(_electionId); // get from ElectionMaster
        bytes32[4] memory y = [signature[52],signature[53],signature[54],signature[55]];
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
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
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
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
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s6 = [signature[97],signature[98],signature[99],signature[100]];
        bytes32 e6 = signature[101];
         
        ballots[_voterId].validator[5] = VerifyContract.DiscreteLogVerify(T6,g,N,m,s6,e6);
    }

    function verify7(uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T7 = [signature[24],signature[25],signature[26],signature[27]];
        bytes32[4] memory g = [signature[36],signature[37],signature[38],signature[39]];
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s7 = [signature[102],signature[103],signature[104],signature[105]];
        bytes32 e7 = signature[106];
         
        ballots[_voterId].validator[6] = VerifyContract.DiscreteLogVerify(T7,g,N,m,s7,e7);
    }

    function verify8(uint32 _electionId, uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory T8 = [signature[28],signature[29],signature[30],signature[31]];
        bytes32[4] memory u = ElectionMasterContract.getAccumBase(_electionId); // get from ElectionMaster
        bytes32[4] memory y = [signature[52],signature[53],signature[54],signature[55]];
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
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
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory s9_1 = [signature[116],signature[117],signature[118],signature[119]];
        bytes32[4] memory s9_2 = [signature[120],signature[121],signature[122],signature[123]];
        bytes32 e9 = signature[124];
         
        ballots[_voterId].validator[8] = VerifyContract.DoubleDiscreteLogVerify(T9,g,t,N,m,s9_1,s9_2,e9);
    }

    function verifyL(uint32 _electionId, uint32 _voterId) public {
        bytes32[signatureLength/32] memory signature = ballots[_voterId].signature;
        bytes32[4] memory y_hat = ballots[_voterId].linkableTag;
        bytes32[4] memory g_theta = ElectionMasterContract.getLinkBase(_electionId);
        bytes32[4] memory N = ElectionMasterContract.getSigN(); // get from ElectionMaster
        bytes32[4] memory m = ballots[_voterId].message;
        bytes32[4] memory sL = [signature[125],signature[126],signature[127],signature[128]];
        bytes32 eL = signature[129];
         
        ballots[_voterId].validator[9] = VerifyContract.DiscreteLogVerify(y_hat,g_theta,N,m,sL,eL);
    }
}