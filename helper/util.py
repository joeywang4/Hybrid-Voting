from base64 import b64encode, b64decode
import math
import secrets
import random
import hashlib
from Crypto.Hash import keccak

def byte_length(num):
  bin_len = num.bit_length()
  return math.ceil(bin_len/8)

def byte32_length(num):
  bin_len = num.bit_length()
  return math.ceil(bin_len/32)

def int_to_str(num):
  num_bytes = num.to_bytes(byte_length(num), byteorder="big")
  return b64encode(num_bytes).decode()

def str_to_int(_str):
  num_bytes = b64decode(_str.decode() if isinstance(_str, bytes) else _str)
  return int.from_bytes(num_bytes, byteorder="big")

def randrange(a, b, secure=False):
  '''
  return random number from [a, b)
  if secure is true, use the `secrets` module to generate random number, which is slower;
  otherwise, use `random` module to generate random number.
  '''
  if secure:
    return secrets.randbelow(b-a)+a
  else:
    return random.randrange(a, b)

def Hash(*args):
  '''
  Feed all arguments to hash by concate them togrther.
  Since `hashlib` module accept only byte object, this function
  help to convert int inputs and also outputs int.
  '''
  n = len(args)
  if n == 0:
    return
  for i in range(n):
    if i == 0:
      message = args[i].to_bytes(byte32_length(args[i])*4, 'big', signed=False)
    else:
      message += args[i].to_bytes(byte32_length(args[i])*4, 'big', signed=False)

  # message = hashlib.sha256(message).digest()
  message = keccak.new(data=message, digest_bits=256).digest()
  message = int.from_bytes(message, 'big', signed=False)
  return message

def intToBytesArray(x, n):
  h = hex(x)[2:].rjust(2*n, '0')
  return ["0x"+h[i*64:(i+1)*64] for i in range(len(h)//64)]

def listHex_to_int(_hex):
  data = "".join([one_hex[2:] for one_hex in _hex])
  return int(data, 16)