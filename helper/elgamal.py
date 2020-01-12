from util import randrange, intToBytesArray
from Crypto.PublicKey import ElGamal
from Crypto.Util import number

# constant elgamalBase and elgamalP
g = 0x86903f29644f242c0963c68203b0b2aee30f03f91d0782729783075abfca89a007c6ac738ccfb57a76221f2d6a5f00b6249aab653ec07d15ace1cffefeeeff9182b1683ed0173e6938435d1ce601bc3734f24c77c7b6b881d0e835c27723ba316e7a5b5915bd1a3d2dfd136c5c89663262bdc5ad4dfff4186818268c00858ec4
p = 0x922d4cf5211046382947a6b76da9def5ddd8718e6f5b84bd664a77c0d94d038cfa9b8604690073cca075dad2ce7a6a0f72a3e1c47fb00238b279cf7e908574c549d664940253b78a1aa901720d3fa053ddfbcdcd0905a8a90c6eb608392d391c5b1027ad538528c2a7b90f972f5d192aaa8260607065118388e630b7dab03753

# keep x as secrets, send h onto blockchain
def gen_tellers_keys():
  x = randrange(2, p-1)
  h = pow(g,x,p)
  return (x,h)

# use the public key H and ephemeral key ek to encrypt plaintext m 
def encrypt(H, ek, m):
  s = pow(H,ek,p)
  c1 = pow(g,ek,p)
  c2 = (m*s)%p
  return (c1,c2)

# use the private key x to decrypt ciphertext c1,c2
def decrypt(x, c1, c2):
  s = pow(c1,x,p)
  m = (c2*number.inverse(s,p))%p
  return m

if __name__ == "__main__":
  ''' # test elgamal encryption
  x = randrange(2, p-1)
  h = pow(g,x,p)

  m = randrange(2, p-1)
  c1, c2 = encrypt(h, m)

  print (m == decrypt(x, c1, c2))
  '''
  # test RSA signature
  sk1_p = 2137793077554429947068604343529912477529857730811218867111136356300225696603764007882186510841535950119296431707200860297730546310670028592521629236768281
  sk1_q = 3319230918551018406175799029605747271672504151342993045936870599115337241061687885474458532449847468303853475265861467302474511818979376608753258801817903
  pk1 = 14191657760965998085005826640715876589479513777361643426381627211346756319353889198837415931919549616837473651294425796842471813398540553425686970229679533851410399176179610085156402060082721949868322169156598121918838577146466829306606773782704586074184035542489242222121130267918228658269373157063136669487

  assert(number.isPrime(sk1_p))
  assert(number.isPrime(sk1_q))

  N = (pk1 - 1) // 2
  m = randrange(2, N)
  sig = 0
  # sig = RSA_siganture(sk1_p, sk1_q, m)

  # print(pow(sig,65537,sk1_p*sk1_q) == m)
  # print(pow(sig,65537,N) == m)

  print (intToBytesArray(m, 128))
  print (intToBytesArray(sig, 128))
  print (intToBytesArray(pk1, 128))
  print (intToBytesArray(N, 128))