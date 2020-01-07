pragma solidity >=0.5 <0.6;

import "./BigInt.sol";

contract Verify {
    using BigNumber for *; 
    event VerifyResult(bool result);
    /*
    def DiscreteLogVerify(y, g, p, m, s, e):
      r_v = (pow(g, s, p)*pow(y, e, p))%p
      e_v = Hash(r_v, m)
      return e_v == e
    */
    function DiscreteLogVerify(
        bytes32[4] memory _y, 
        bytes32[4] memory _g, 
        bytes32[4] memory _p, 
        bytes32[4] memory _m, 
        bytes32[4] memory _s, 
        bytes32 _e
    ) public returns(bool){
        bytes memory y = abi.encodePacked(_y);
        bytes memory g = abi.encodePacked(_g);
        bytes memory p = abi.encodePacked(_p);
        bytes memory m = abi.encodePacked(_m);
        bytes memory s = abi.encodePacked(_s);
        bytes memory e = abi.encodePacked(_e);
        bytes memory r;
        r = BigNumber.modmul(BigNumber.modexp(g, s, p), BigNumber.modexp(y, e, p), p);
        bool result = keccak256(abi.encodePacked(r, m)) == _e;
        emit VerifyResult(result);
        return result;
    }
    /*
    def DoubleDiscreteLogVerify(y, g1, g2, p, m, s1, s2, e):
      r_v = (pow(g1, s1, p)*pow(g2, s2, p)*pow(y, e, p))%p
      e_v = Hash(r_v, m)
      return e_v == e
    */
    function DoubleDiscreteLogVerify(
        bytes32[4] memory _y, 
        bytes32[4] memory _g1, 
        bytes32[4] memory _g2, 
        bytes32[4] memory _p, 
        bytes32[4] memory _m, 
        bytes32[4] memory _s1, 
        bytes32[4] memory _s2, 
        bytes32 _e
    ) public returns(bool){
        bytes memory y = abi.encodePacked(_y);
        bytes memory g1 = abi.encodePacked(_g1);
        bytes memory g2 = abi.encodePacked(_g2);
        bytes memory p = abi.encodePacked(_p);
        bytes memory m = abi.encodePacked(_m);
        bytes memory s1 = abi.encodePacked(_s1);
        bytes memory s2 = abi.encodePacked(_s2);
        bytes memory e = abi.encodePacked(_e);
        bytes memory r;
        r = BigNumber.modmul(BigNumber.modmul(BigNumber.modexp(g1, s1, p), BigNumber.modexp(g2, s2, p), p), BigNumber.modexp(y, e, p), p);
        bool result = keccak256(abi.encodePacked(r, m)) == _e;
        emit VerifyResult(result);
        return result;
    }
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
}