from Crypto.Util import number
from Crypto.Random.random import randint
import json
from util import int_to_str, str_to_int

# Security parameter
# RSA-1024 ~= 2^80
lamb = 1024

def is_valid_sig_pair(sk_p, sk_q, pk):
  return number.isPrime(pk) and number.isPrime(sk_p) and number.isPrime(sk_q) and pk == 2*sk_p*sk_q+1 and sk_p.bit_length() == 510 and sk_q.bit_length() == 510

'''
accumulator with one-way domain: (F, X, Z, R), lambda
F: (u, x) -> u^x mod n, n is safe-primes products (lambda bits)
Z: public key y (lambda-3 bits)
X: private keys (p, q) ((lambda-4)/2 bits, (lambda-4)/2 bits)
R: y = 2pq+1
'''
def gen_sig_keypair():
  ll = lamb - 3
  sk_p = number.getPrime(ll//2)
  sk_q = number.getPrime(ll//2) 

  found = False
  count = 0
  while not found:
    pk = 2*sk_p*sk_q+1
    count += 1
    if number.isPrime(pk):
      found = True
    else:
      is_next_prime = False
      while not is_next_prime:
        sk_q = sk_q + 2
        is_next_prime = number.isPrime(sk_q)
  print("sk_p:", sk_p)
  print("sk_q:", sk_q)
  print("pk:", pk)
  return keypair_to_json(sk_p, sk_q, pk)

# Generate signature accumulator and groups
# Output: Accumulator base, N_sig, phiN_sig, p_sig, q_sig
def gen_sig_param():
  return False

# Sign a message
# Input: Key pair(sk_p, sk_q, pk), Message(int), parameters(N_sig, phiN_sig, p_sig, q_sig)
# Output: Signature(str)
def sign_ballot():
  return False
  

def keypair_to_json(sk_p, sk_q, pk):
  return json.dumps({"sigPubKey": int_to_str(pk), "sigPrivKey": int_to_str(sk_p)+";"+int_to_str(sk_q)})

def json_to_keypair(data):
  keys = json.loads(data)
  sk_p, sk_q = keys['sigPrivKey'].split(";")
  pk = keys['sigPubKey']
  sk_p, sk_q, pk = str_to_int(sk_p), str_to_int(sk_q), str_to_int(pk)
  assert(is_valid_sig_pair(sk_p, sk_q, pk))
  return sk_p, sk_q, pk