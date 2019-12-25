from util import randrange, Hash

def DiscreteLogSign(y, g, x, p, q, m):
  '''
  SPK{(x): y=g^x mod p}(m)
  '''
  k = randrange(2, q)
  r = pow(g, k, p)
  e = Hash(r, m)
  s = (k-x*e)%q
  return (s,e)

def DiscreteLogVerify(y, g, p, q, m, s, e):
  r_v = (pow(g, s, p)*pow(y, e, p))%p
  e_v = Hash(r_v, m)
  return e_v == e

def DoubleDiscreteLogSign(y, g1, g2, x1, x2, p, q, m):
  '''
  SPK{(x1, x2): y=(g1^x1)(g2^x2) mod p}(m)
  '''
  k1 = randrange(2, q)
  k2 = randrange(2, q)
  r = (pow(g1, k1, p)*pow(g2, k2, p))%p
  e = Hash(r, m)
  s1 = (k1-x1*e)%q
  s2 = (k2-x2*e)%q
  return (s1, s2, e)

def DoubleDiscreteLogVerify(y, g1, g2, p, q, m, s1, s2, e):
  r_v = (pow(g1, s1, p)*pow(g2, s2, p)*pow(y, e, p))%p
  e_v = Hash(r_v, m)
  return e_v == e

def InRangeSign(y, g, x, p, q, b, m):
  '''
  SPK{(x): 2^(b-1) < x < 2^b}
  use hash-256
  '''
  t = 256 # bit length of hash
  check = False
  while not check:
    # k in range 2^(b+255)~2^(b+256)
    k = randrange(2**(b+t-2), 2**(b+t-1))
    r = pow(g, k, p)
    e = Hash(r, m) 
    # Check x*e is in the range 2^(b+t-2)~2^(b+t-1)
    # Then s will be in range 2^(b+t-1)~2^(b+t)
    if (x*e).bit_length() == b+t-1:
      check = True
    s = (k+x*e)%q
  return (s, e)

def InRangeVerify(y, g, p, q, b, m, s, e):
  t = 256
  if s.bit_length() != b+t:
    return False
  r_v = (pow(g, s, p)*number.inverse(pow(y, e, p), p))%p
  e_v = Hash(r_v, m)
  return e_v == e

if __name__ == "__main__":
  from Crypto.Util import number
  p = number.getStrongPrime(512) # might be safe prime, but it is too slow
  q = number.getStrongPrime(512) # might be safe prime, but it is too slow
  n = p*q
  phi = (p-1)*(q-1)
   
  u = randrange(2, n)
  b = 4
  m = 123455678999
  x = randrange(2**(b-1),2**(b))
  y = pow(u,x,n)
  s,e = InRangeSign(y,u,x,n,phi,b,m)

  verify = InRangeVerify(y,u,n,phi,b,m,s,e)
  print(verify)