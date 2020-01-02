pragma solidity >=0.4.20 <0.6;

import "./BigInt.sol";

contract VerifySignature {
  using BigNumber for *; 
  /*
  def DiscreteLogVerify(y, g, p, q, m, s, e):
    r_v = (pow(g, s, p)*pow(y, e, p))%p
    e_v = Hash(r_v, m)
    return e_v == e
  */
  function DiscreteLogVerify(bytes memory _y, bytes memory _g, bytes memory _p, bytes memory _m, bytes memory _s, bytes memory _e) public returns(bool){
    bytes memory r;
    r = BigNumber.modmul(BigNumber.modexp(_g, _s, _p), BigNumber.modexp(_y, _e, _p), _p);
    return keccak256(MergeBytes(r, _m)) == bytesToBytes32(_e, 96);
  }
  /*
  def DoubleDiscreteLogVerify(y, g1, g2, p, m, s1, s2, e):
    r_v = (pow(g1, s1, p)*pow(g2, s2, p)*pow(y, e, p))%p
    e_v = Hash(r_v, m)
    return e_v == e
  */
  function DoubleDiscreteLogVerify(bytes memory _y, bytes memory _g1, bytes memory _g2, bytes memory _p, bytes memory _m, bytes memory _s1, bytes memory _s2, bytes memory _e) public returns(bool){
    bytes memory r;
    r = BigNumber.modmul(BigNumber.modmul(BigNumber.modexp(_g1, _s1, _p), BigNumber.modexp(_g2, _s2, _p), _p), BigNumber.modexp(_y, _e, _p), _p);
    return keccak256(MergeBytes(r, _m)) == bytesToBytes32(_e, 96);
  }

  function MergeBytes(bytes memory a, bytes memory b) public pure returns (bytes memory c) {
    // Store the length of the first array
    uint alen = a.length;
    // Store the length of BOTH arrays
    uint totallen = alen + b.length;
    // Count the loops required for array a (sets of 32 bytes)
    uint loopsa = (a.length + 31) / 32;
    // Count the loops required for array b (sets of 32 bytes)
    uint loopsb = (b.length + 31) / 32;
    assembly {
      let m := mload(0x40)
      // Load the length of both arrays to the head of the new bytes array
      mstore(m, totallen)
      // Add the contents of a to the array
      for {  let i := 0 } lt(i, loopsa) { i := add(1, i) } { mstore(add(m, mul(32, add(1, i))), mload(add(a, mul(32, add(1, i))))) }
      // Add the contents of b to the array
      for {  let i := 0 } lt(i, loopsb) { i := add(1, i) } { mstore(add(m, add(mul(32, add(1, i)), alen)), mload(add(b, mul(32, add(1, i))))) }
      mstore(0x40, add(m, add(32, totallen)))
      c := m
    }
  }
  // extract byte32 from a byte array (start from offset)
  function bytesToBytes32(bytes memory b, uint offset) public pure returns (bytes32) {
    bytes32 out;
    for (uint i = 0; i < 32; i++) {
      out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
    }
    return out;
  }
}