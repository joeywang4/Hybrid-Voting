pragma solidity >=0.5.0 <0.6.0;

library BigNumber {
    function bitLength(uint x) internal pure returns (uint) {
        uint test = 1;
        for (uint i = 0; i < 256; i++) {
            if (x < test) return i;
            test = test * 2;
        }
        return 256;
    }

    function compare(bytes memory a, bytes memory b) internal view returns (int cmp) {
        (, cmp) = addOrSub(a, b, true);
    }

    function toBigInt(uint x) internal pure returns (bytes memory ret) {
        ret = new bytes(32);
        assembly { mstore(add(ret, 32), x) }
    }

    function bignot(bytes memory x) internal pure returns (bytes memory) {
        uint pointer;
        uint pointerEnd;
        assembly {
            pointer := add(x, 32)
            pointerEnd := add(pointer, mload(x))
        }
        for (; pointer < pointerEnd; pointer += 32) {
            assembly {
                mstore(pointer, not(mload(pointer)))
            }
        }
        return x;
    }

    function bigadd(bytes memory a, bytes memory b) internal view returns (bytes memory ret) {
        (ret, ) = addOrSub(a, b, false);
    }

    function bigsub(bytes memory a, bytes memory b) internal view returns (bytes memory ret) {
        (ret, ) = addOrSub(a, b, true);
    }

    function addOrSub(bytes memory _a, bytes memory _b, bool negative_b) internal view returns (bytes memory result, int cmp) {
        result = new bytes(_a.length > _b.length ? _a.length : _b.length);

        uint aStart;
        uint bStart;
        uint rStart;
        assembly {
            aStart := add(_a, 32)
            bStart := add(_b, 32)
            rStart := add(result, 32)
        }
        uint aPos = aStart + (_a.length - 32);
        uint bPos = bStart + (_b.length - 32);
        uint carry = 0;

        for(uint rPos = rStart + result.length - 32; rPos >= rStart; rPos -= 32) {
            uint aPart = 0;
            uint bPart = 0;
            if (aPos >= aStart) {
                assembly { aPart := mload(aPos) }
            }
            if (bPos >= bStart) {
                assembly { bPart := mload(bPos) }
            }
            if (negative_b) {
                assembly {
                    mstore(rPos, sub(sub(aPart, bPart), carry))
                }
                carry = (aPart - bPart > aPart || aPart - bPart - carry > aPart - bPart) ? 1 : 0;
            } else {
                assembly {
                    mstore(rPos, add(add(aPart, bPart), carry))
                }
                carry = (aPart + bPart < aPart || aPart + bPart + carry < aPart + bPart) ? 1 : 0;
            }
            if (aPart != bPart) cmp = 1;
            aPos -= 32;
            bPos -= 32;
        }

        // If overflow we have to add 1 in front
        if (carry == 1) {

            if (negative_b) return (bigadd(bignot(result), toBigInt(1)), -1);

            bytes memory result2 = new bytes(result.length + 32);
            assembly {
                aPos := add(result, 32)
                bPos := add(result2, 64)
            }
            copyWords(bPos, aPos, result.length);
            assembly {
                mstore(add(result2, 32), 1)
            }
            return (result2, 1);
        }
        return (result, cmp);
    }

    function square(bytes memory x) internal returns (bytes memory ret) {
        bytes memory largeN = shiftLeft(x, int(x.length) * 8);
        return modexp(x, toBigInt(2), largeN);
    }

    // ab = ((a+b)^2-(a-b)^2) / 4
    function modmul(bytes memory a, bytes memory b, bytes memory m) internal returns (bytes memory ret) {
        bytes memory two = toBigInt(2);
        bytes memory sum = bigadd(a, b); // a+b
        bytes memory diff = bigsub(a, b); // abs(a-b)
        bytes memory largeN = shiftLeft(sum, int(sum.length) * 8);
        bytes memory sumSquared = modexp(sum, two, largeN); //(a+b)^2
        bytes memory diffSquared = modexp(diff, two, largeN); //(a-b)^2
        bytes memory ab4 = bigsub(sumSquared, diffSquared);
        bytes memory ab = shiftLeft(ab4, -2);
        return bmod(ab, m);
    }

    function copyWords(uint dest, uint src, uint len) internal pure {
        for(; len >= 32; len -= 32) {
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }
    }

    function trim(bytes memory x) internal pure returns (bytes memory y) {
        require(x.length % 32 == 0);
        bool isZero = true;
        uint zeroCount;
        for (uint i = 0; i < x.length; i += 32) {
            assembly {
                isZero := iszero(mload(add(x, add(i, 32))))
            }
            if (isZero) {
                zeroCount += 32;
            } else {
                break;
            }
        }
        assembly {
            y := add(x, zeroCount)
            mstore(y, sub(mload(x), zeroCount))
        }
    }

    function shiftBitsRight(bytes memory x, uint bitShift) internal pure returns (bytes memory y) {
        if (bitShift == 0) return x;
        require(bitShift <= 255);
        require(x.length % 32 == 0);

        y = new bytes(x.length);

        uint maskRight = (uint(1) << bitShift) - 1; // mask to get only the lower X bits
        uint multiplyRight = 2 ** (256 - bitShift);
        uint divideRemaining = 2 ** bitShift;
        for (uint i = 0; i < x.length; i += 32) {
            uint value;
            uint _dst;
            assembly {
                value := div(and(not(maskRight), mload(add(x, add(i, 32)))), divideRemaining)
            }
            if (i != 0) {
                // What moved from the previous word to this one
                assembly {
                    value := add(value, mul(and(maskRight, mload(add(x, i))), multiplyRight))
                }
            }
            assembly {
                _dst := add(y, add(i, 32))
                mstore(_dst, value)
            }
        }
    }

    function shiftLeft(bytes memory x, int n) internal pure returns (bytes memory ret) {
        // New bitlength = x.length * 8 + n; round up to multiple of 256
        int newBitLength = ((255 + n + int(x.length * 8)) / 256) * 256;
        if (newBitLength <= 0) return new bytes(0);

        ret = new bytes(uint(newBitLength) / 8);
        uint copy_len = x.length < ret.length ? x.length : ret.length;
        uint _input;
        uint _output;
        assembly {
            _input := add(x, 32)
            _output := add(ret, 32)
        }

        copyWords(_output, _input, copy_len);

        // Apply bit shift (between 0 and 255 to the right)
        uint bitShift = uint(newBitLength - int(x.length * 8) - n);
        ret = trim(shiftBitsRight(ret, bitShift));
    }

    function bmod(bytes memory _x, bytes memory _mod) internal returns (bytes memory ret) {
        return modexp(_x, toBigInt(1), _mod);
    }

    // Wrapper for built-in bigint_modexp, modified from https://gist.github.com/lionello/ee285ea220dc64517499c971ff92a2a5
    function modexp(bytes memory _base, bytes memory _exp, bytes memory _mod) internal returns (bytes memory) {

        uint256 bl = _base.length;
        uint256 el = _exp.length;
        uint256 ml = _mod.length;
        bytes memory ret = new bytes(ml);
        uint inputSize = 96 + bl + el + ml;
        bytes memory rawInput = new bytes(inputSize);

        assembly {
            let freemem := add(rawInput, 32)
            mstore(freemem, bl)
            mstore(add(freemem,32), el)
            mstore(add(freemem,64), ml)

            let x := call(450, 0x4, 0, add(_base,32), bl, add(freemem,96), bl)
            x := call(450, 0x4, 0, add(_exp,32), el, add(freemem,add(96, bl)), el)
            x := call(450, 0x4, 0, add(_mod,32), ml, add(freemem,sub(inputSize, ml)), ml)

            x := call(sub(gas, 1350), 0x5, 0, freemem, inputSize, add(ret, 32), ml)
        }

        require(rawInput.length == 96 + bl + el + ml);
        return ret;
    }
}