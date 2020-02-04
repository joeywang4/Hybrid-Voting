pragma solidity >=0.5.0 <0.6.0;

import "./BigInt.sol";

library Verify {
    using BigNumber for *; 
    event VerifyResult(bool result);
    function modmulWrapper(
        bytes32[4] memory _a,
        bytes32[4] memory _b,
        bytes32[4] memory _m
    ) public returns (bytes32[4] memory) {
        bytes memory a = abi.encodePacked(_a);
        bytes memory b = abi.encodePacked(_b);
        bytes memory m = abi.encodePacked(_m);
        bytes memory r = BigNumber.modmul(a,b,m);
        bytes32 r1;
        bytes32 r2;
        bytes32 r3;
        bytes32 r4;
        assembly {
            r1 := mload(add(r, 32))
            r2 := mload(add(r, 64))
            r3 := mload(add(r, 96))
            r4 := mload(add(r, 128))
        }
        return [r1,r2,r3,r4];
    }
    function modexpWrapper(
        bytes32[4] memory _b,
        bytes32[4] memory _e,
        bytes32[4] memory _m
    ) public returns (bytes32[4] memory) {
        bytes memory b = abi.encodePacked(_b);
        bytes memory e = abi.encodePacked(_e);
        bytes memory m = abi.encodePacked(_m);
        bytes memory r = BigNumber.modexp(b,e,m);
        bytes32 r1;
        bytes32 r2;
        bytes32 r3;
        bytes32 r4;
        assembly {
            r1 := mload(add(r, 32))
            r2 := mload(add(r, 64))
            r3 := mload(add(r, 96))
            r4 := mload(add(r, 128))
        }
        return [r1,r2,r3,r4];
    }
    // note that pubKey is siganture pubKey, we need to transform it into RSA public key 
    function isValidRSASig(bytes32[4] memory message, bytes32[4] memory signature, bytes32[4] memory pubKey) public returns (bool) {
        bytes memory e = BigNumber.toBigInt(uint(65537));
        bytes memory N;
        N = BigNumber.shiftBitsRight(BigNumber.bigsub(abi.encodePacked(pubKey), BigNumber.toBigInt(uint(1))), 1);
        return keccak256(abi.encodePacked(BigNumber.modexp(abi.encodePacked(signature), e, N))) == keccak256(abi.encodePacked(message));
    }
}