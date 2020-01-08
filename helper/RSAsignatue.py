from util import randrange, intToBytesArray
from Crypto.Util import number

# m is int
def RSA_siganture(sk_p, sk_q, m):
  N = sk_p*sk_q
  phi = (sk_p-1)*(sk_q-1)
  e = 65537
  d = number.inverse(e, phi)
  sig = pow(m, d, N)
  assert(pow(sig, e, N) == m)
  return sig