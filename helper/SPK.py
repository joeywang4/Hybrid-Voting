from util import randrange, Hash, int_to_str
from Crypto.Util import number

def DiscreteLogSign(y, g, x, p, q, m):
  '''
  SPK{(x): y=g^x mod p}(m)
  '''
  k = randrange(2, q)
  r = pow(g, k, p)
  e = Hash(r, m[0], m[1])
  s = (k-x*e)%q
  assert(DiscreteLogVerify(y,g,p,m,s,e))
  return (s, e)

def DiscreteLogVerify(y, g, p, m, s, e):
  r_v = (pow(g, s, p)*pow(y, e, p))%p
  e_v = Hash(r_v, m[0], m[1])
  return e_v == e

def DoubleDiscreteLogSign(y, g1, g2, x1, x2, p, q, m):
  '''
  SPK{(x1, x2): y=(g1^x1)(g2^x2) mod p}(m)
  '''
  k1 = randrange(2, q)
  k2 = randrange(2, q)
  r = (pow(g1, k1, p)*pow(g2, k2, p))%p
  e = Hash(r, m[0], m[1])
  s1 = (k1-x1*e)%q
  s2 = (k2-x2*e)%q
  assert(DoubleDiscreteLogVerify(y,g1,g2,p,m,s1,s2,e))
  return (s1, s2, e)

def DoubleDiscreteLogVerify(y, g1, g2, p, m, s1, s2, e):
  r_v = (pow(g1, s1, p)*pow(g2, s2, p)*pow(y, e, p))%p
  e_v = Hash(r_v, m[0], m[1])
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
    e = Hash(r, m[0], m[1]) 
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
  e_v = Hash(r_v, m[0], m[1])
  return e_v == e

if __name__ == "__main__":
  p = number.getStrongPrime(512) # might be safe prime, but it is too slow
  q = number.getStrongPrime(512) # might be safe prime, but it is too slow

  n = p*q
  phi = (p-1)*(q-1)

  def intToBytesArray(x):
    x = x.to_bytes(128, byteorder="big")
    temp = "["
    for a in x:
      temp += "\""
      temp += hex(a)
      temp += "\""
      temp += ","
    return temp[:-1] + "]"
  '''
  g = randrange(2, n)
  x = randrange(2, n)
  m = 123456
  y = pow(g, x, n)
  s, e = DiscreteLogSign(y, g, x, n, phi, m)
  print ("y:",  intToBytesArray(y))
  print ("g:",  intToBytesArray(g))
  print ("p:",  intToBytesArray(n))
  print ("m:",  intToBytesArray(m))
  print ("s:",  intToBytesArray(s))
  print ("e:",  intToBytesArray(e))
  exit()
  '''
  g1 = randrange(2, n)
  g2 = randrange(2, n)
  x1 = randrange(2, n)
  x2 = randrange(2, n)
  m = 123456
  y = (pow(g1, x1, n) * pow(g2, x2, n)) % n
  s1, s2, e = DoubleDiscreteLogSign(y, g1, g2, x1, x2, n, phi, m)

  pythonResult = DoubleDiscreteLogVerify(y, g1, g2, n, m, s1, s2, e)
  print ("y:",  intToBytesArray(y))
  print ("g1:", intToBytesArray(g1))
  print ("g2:", intToBytesArray(g2))
  print ("p:",  intToBytesArray(n))
  print ("m:",  intToBytesArray(m))
  print ("s1:", intToBytesArray(s1))
  print ("s2:", intToBytesArray(s2))
  print ("e:",  intToBytesArray(e))
  exit()

  u = randrange(2, n)
  b = 4
  m = 123455678999
  x = randrange(2**(b-1),2**(b))
  y = pow(u,x,n)
  s,e = InRangeSign(y,u,x,n,phi,b,m)

  verify = InRangeVerify(y,u,n,phi,b,m,s,e)
  print(verify)

