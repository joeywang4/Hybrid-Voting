from base64 import b64encode, b64decode

def byte_length(num):
  bin_len = len(bin(num))-2
  return bin_len//8 if bin_len%8 == 0 else (bin_len//8)+1

def int_to_str(num):
  num_bytes = num.to_bytes(byte_length(num), byteorder="big")
  return b64encode(num_bytes).decode()

def str_to_int(_str):
  num_bytes = b64decode(_str if isinstance(_str, bytes) else _str.decode())
  return int.from_bytes(num_bytes, byteorder="big")