from Crypto.Util import number
from Crypto.Random.random import randint
import json
from util import int_to_str, str_to_int

def is_valid_pair(p, q, y):
  return number.isPrime(y) and number.isPrime(p) and number.isPrime(q) and y == 2*p*q+1

'''
accumulator with one-way domain: (F, X, Z, R), lambda
F: (u, x) -> u^x mod n, n is safe-primes products (lambda bits)
Z: public key y (lambda-3 bits)
X: private keys (p, q) ((lambda-4)/2 bits, (lambda-4)/2 bits)
R: y = 2pq+1
'''
def gen_keypair():
  lamb = 1024 # choose 1024, the time to generate keys is fine
  ll = lamb - 3

  p = number.getPrime(ll//2)
  q = number.getPrime(ll//2) 

  found = False
  count = 0
  while not found:
      y = 2*p*q+1
      count += 1
      if number.isPrime(y):
          found = True
      else:
          is_next_prime = False
          while not is_next_prime:
              q = q + 2
              is_next_prime = number.isPrime(q)
  print("p:", p)
  print("q:", q)
  print("y:", y)
  return keypair_to_json(p, q, y)

def keypair_to_json(p, q, y):
  return json.dumps({"sigPubKey": int_to_str(y), "sigPrivKey": int_to_str(p)+";"+int_to_str(q)})

def json_to_keypair(data):
  keys = json.loads(data)
  p, q = keys['sigPrivKey'].split(";")
  y = keys['sigPubKey']
  p, q, y = str_to_int(p), str_to_int(q), str_to_int(y)
  assert(is_valid_pair(p, q, y))
  return p, q, y