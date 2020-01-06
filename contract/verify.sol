pragma solidity >=0.4.20 <0.6;

import "./BigInt.sol";

contract VerifySignature {
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
}