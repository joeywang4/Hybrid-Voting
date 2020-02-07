import json
from Crypto.Util import number
from util import int_to_str, str_to_int, randrange
import SPK

# Security parameter
# RSA-1024 ~= 2^80
lamb = 1024
p_sig = 0xb963e0eeeee46d96448188fe505e6c020d861b8e88e1a69c8892b7eb404a3c66a5065d273f365dc34c5e825bc68fd4807717d5fa126b1a03ee5d5cff797c9bff
q_sig = 0xec6f1862a53add2e6f20d6de6a7cc08c159efbb81aa1a133889fdb2a576dc109b8d7f1133302b506f6404baf4ae9c086274220f28ab2c790a50caca4a6317a1f
N_sig = 0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b56153fc51a0bd6888d53e80749b8d0f493d2895ac04524ad9fed0d79700f0282b6dc361e1feb0a3f8fa5f4ed9136e574ef04c9c94d22c19cfd777b531e32e7b4812a645af3b0248e6ed9764c8a640198ec8b9a5860ea645b08e454324e3d69e1
phiN_sig = 0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b56153fc51a0bd6888d53e80749b8d0f493d2895ac04524ad9fed0d79700f028111093ccc8bcbbf7adc039510d65bb8e6cbdfb282a99f79ccec44e83d867aea44234c1620817711c42c3aa84178ea6c924e31a36bc3cc82c6757a4a8e2e8f53c4

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
  return keypair_to_json(sk_p, sk_q, pk)

def get_generator(p, q):
  n = p*q
  found = False
  while not found:
    g = randrange(2, n)
    found = number.GCD(g, n) == 1 and pow(g, 4, n) != 1
  return g 

# Generate signature accumulator and groups
# Output: Accumulator base, Linkable tag, N_sig, phiN_sig, p_sig, q_sig
def gen_sig_param():
  '''
  p_sig = number.getStrongPrime(lamb//2) # might be safe prime, but it is too slow
  q_sig = number.getStrongPrime(lamb//2) # might be safe prime, but it is too slow
  N_sig = p_sig * q_sig
  phiN_sig = (p_sig-1) * (q_sig-1)
  '''
  u = get_generator(p_sig, q_sig) # Accum base
  g_theta = get_generator(p_sig, q_sig) # linkable tag base
  return u, g_theta, N_sig, phiN_sig, p_sig, q_sig

def gen_accum_voters(accumBase, voters):
  power = 1
  for voter in voters:
    power = (power*voter)%phiN_sig
  return pow(accumBase, power, N_sig)

# Sign a message
# Input: list_of_pks, Key pair(sk_p, sk_q, pk), Message(int tuple (c1, c2)), parameters(u, g_theta)
# Output: Signature(str)
def sign_ballot(list_of_pks, key_pair, m, param):
  sk_p, sk_q, pk = key_pair
  u, g_theta = param

  g = get_generator(p_sig, q_sig) # some generator for signature
  h = get_generator(p_sig, q_sig) # some generator for signature
  s = get_generator(p_sig, q_sig) # some generator for signature
  t = get_generator(p_sig, q_sig) # some generator for signature
  y = get_generator(p_sig, q_sig) # some generator for signature

  y_hat = pow(g_theta, sk_p+sk_q, N_sig)
  w = u # witness
  product_of_other_pk = 1
  for other_pk in list_of_pks:
    w = pow(w, other_pk, N_sig)
    product_of_other_pk = (product_of_other_pk * other_pk) % phiN_sig
  v = pow(w, pk, N_sig) # all public key accumulated

  r = randrange(2, phiN_sig) # a secret random seed need to be 
  T1 = pow(g, r, N_sig)
  T2 = (pow(g, pk, N_sig) * pow(h, r, N_sig)) % N_sig
  T3 = (pow(g, sk_q, N_sig) * pow(s, r, N_sig)) % N_sig
  T4 = (w * pow(y, r, N_sig)) % N_sig
  T5 = (pow(g, sk_p, N_sig) * pow(t, r, N_sig)) % N_sig
  T6 = pow(T1, pk, N_sig)
  T7 = pow(T1, sk_q, N_sig)
  T8 = pow(T4, pk, N_sig)
  T9 = (pow(T5, 2*sk_q, N_sig) * g) % N_sig

  s1, e1 = SPK.DiscreteLogSign(T1, g, r, N_sig, phiN_sig, m) # sign T1
  s2_1, s2_2, e2 = SPK.DoubleDiscreteLogSign(T2, g, h, pk, r, N_sig, phiN_sig, m) # sign T2
  s3_1, s3_2, e3 = SPK.DoubleDiscreteLogSign(T3, g, s, sk_q, r, N_sig, phiN_sig, m) # sign T3
  s4_1, s4_2, e4 = SPK.DoubleDiscreteLogSign(T4, u, y, product_of_other_pk, r, N_sig, phiN_sig, m) # sign T4
  s5_1, s5_2, e5 = SPK.DoubleDiscreteLogSign(T5, g, t, sk_p, r, N_sig, phiN_sig, m) # sign T5
  s6, e6 = SPK.DiscreteLogSign(T6, g, (pk*r)%phiN_sig, N_sig, phiN_sig, m) # sign T6
  s7, e7 = SPK.DiscreteLogSign(T7, g, (sk_q*r)%phiN_sig, N_sig, phiN_sig, m) # sign T7
  s8_1, s8_2, e8 = SPK.DoubleDiscreteLogSign(T8, u, y, (pk*product_of_other_pk)%phiN_sig, (pk*r)%phiN_sig,N_sig, phiN_sig, m) # sign T8
  s9_1, s9_2, e9 = SPK.DoubleDiscreteLogSign(T9, g, t, pk, (2*sk_q*r)%phiN_sig, N_sig, phiN_sig, m) # sign T9
  sL, eL = SPK.DiscreteLogSign(y_hat, g_theta, (sk_p+sk_q)%phiN_sig, N_sig, phiN_sig, m) # sign linkable tag

  sigma = [v, y_hat, T1, T2, T3, T4, T5, T6, T7, T8, T9, g, h, s, t, y, s1, e1, s2_1, s2_2, e2, s3_1, s3_2, e3, s4_1, s4_2, e4, s5_1, s5_2, e5, s6, e6, s7, e7, s8_1, s8_2, e8, s9_1, s9_2, e9, sL, eL]
  return sigma
  # sigma = list(map(int_to_str, sigma))
  # return ";".join(sigma)  

def keypair_to_json(sk_p, sk_q, pk):
  return json.dumps({"sigPubKey": int_to_str(pk), "sigPrivKey": int_to_str(sk_p)+";"+int_to_str(sk_q)})

def json_to_keypair(data):
  keys = json.loads(data)
  sk_p, sk_q = keys['sigPrivKey'].split(";")
  pk = keys['sigPubKey']
  sk_p, sk_q, pk = str_to_int(sk_p), str_to_int(sk_q), str_to_int(pk)
  assert(is_valid_sig_pair(sk_p, sk_q, pk))
  return sk_p, sk_q, pk

if __name__ == "__main__":
  # SLRS 5 pairs of sk, pk
  # =====
  sk1_p = 2137793077554429947068604343529912477529857730811218867111136356300225696603764007882186510841535950119296431707200860297730546310670028592521629236768281
  sk1_q = 3319230918551018406175799029605747271672504151342993045936870599115337241061687885474458532449847468303853475265861467302474511818979376608753258801817903
  pk1 = 14191657760965998085005826640715876589479513777361643426381627211346756319353889198837415931919549616837473651294425796842471813398540553425686970229679533851410399176179610085156402060082721949868322169156598121918838577146466829306606773782704586074184035542489242222121130267918228658269373157063136669487
  # =====
  sk2_p = 2648838894532121413685021763252903815099735453077892375422359245498184016079217819518461399834236786516090718965327516132721116188497949485513685038704473
  sk2_q = 2327129101502301845856628653748909485337467718918408890967630927267735074128737477894488528199382502883020025021580792831363540724528857736225675363717841
  pk2 = 12328380153313772374303980174325920753005956641845151441475373191441186056657499876420582773591140900206494279233664574664371060423656287414700819271800106248146727248843795635943997043309155622147003226106087356547424248975395879577900545221403387456413935945482718808591794687622585266122116351734713205587
  # =====
  sk3_p = 2908164678318256817806717132091383469234417418705040733619863976395240653516419741465246263114964766244400862068742004992985004275512161438071260929835931
  sk3_q = 2069326842608868979910942118170775780022729127071683909633793115582839213488052556837127210925229222656537996574428158693995199406538333368891998467145859
  pk3 = 12035886463141911025675226974224779848830580804246560740575733543037800368357312452976365389962772951781502714421180925088520487931580052132279825576340506294791803861023214980349534238549670190567464207323109353607207907249163403297261822146227501748752184654980014100751255820520765928023778122965432119459
  # =====
  sk4_p = 2228670642890276808127009434462499918322058417249659301917705366152536855213744470899996820769459052477269113006343326000007625109049804336976886444912843
  sk4_q = 1816289228640805364182655609651530333887268737028366357630910243373296036859781670302474553436929712712391952679695138738126177870424897651416570840346387
  pk4 = 8095820965739177310999614257501577138270963835957473530072198261941536472064342954209632782783925659574697309184343387922736697698861259820155978462692274630533638176411382981941640000299931609712631620954186219807866697982665816026197693547513012393551398254136131479801620380520314224492325000584289896483
  # =====
  sk5_p = 2954772246105976171952787211612216596303262008533538727035938945894377742507035878330681044055630405895258772596495109272891043591753380312951907084035591
  sk5_q = 2840467862191499077863105002484703326822266260861437699815912611280453396912965997661207119471112513875179877342796865651851197569284315280410024780479939
  pk5 = 16785871210318832245988935687678154961557032753660712185485892478728218432287954259875737628015403440983910790419595614155743300140024432752065957630594473164107057491787739367941936594507232017439789854360951841975821687389088843675321748520020878813204156325543443659708536010533608063720880091899875017899

  def intToBytesArray(x, n):
    # x = x.to_bytes(n, byteorder="big")
    h = hex(x)[2:].rjust(2*n, '0')
    temp = ["0x"+h[i*64:(i+1)*64] for i in range(len(h)//64)]
    return temp

  param = gen_sig_param()
  u, g_theta, N_sig, phiN_sig, p_sig, q_sig = param
  #print ("accumBase" , intToBytesArray(u, 128))
  #print ("g_theta" , intToBytesArray(g_theta, 128))

  list_of_pks = [pk2, pk3, pk4, pk5]
  key_pair = (sk1_p, sk1_q, pk1)
  m = 1234567894565231545315, 54562232155885231212
  v, y_hat, T1, T2, T3, T4, T5, T6, T7, T8, T9, g, h, s, t, y, s1, e1, s2_1, s2_2, e2, s3_1, s3_2, e3, s4_1, s4_2, e4, s5_1, s5_2, e5, s6, e6, s7, e7, s8_1, s8_2, e8, s9_1, s9_2, e9, sL, eL = sign_ballot(list_of_pks, key_pair, m, param)
  
  print("m" , intToBytesArray(m[0], 128))
  print("m" , intToBytesArray(m[1], 128))
  print("v" , intToBytesArray(v, 128))
  print("y_hat" , intToBytesArray(y_hat, 128))
  print("T1" , intToBytesArray(T1, 128))
  print("g" , intToBytesArray(g, 128))
  print("s1" , intToBytesArray(s1, 128))
  print("e1" , intToBytesArray(e1, 32))

  print (
  intToBytesArray(T1,   128) +\
  intToBytesArray(T2,   128) + \
  intToBytesArray(T3,   128) + \
  intToBytesArray(T4,   128) + \
  intToBytesArray(T5,   128) + \
  intToBytesArray(T6,   128) + \
  intToBytesArray(T7,   128) + \
  intToBytesArray(T8,   128) + \
  intToBytesArray(T9,   128) + \
  intToBytesArray(g,    128) + \
  intToBytesArray(h,    128) + \
  intToBytesArray(s,    128) + \
  intToBytesArray(t,    128) + \
  intToBytesArray(y,    128) + \
  intToBytesArray(s1,   128) + \
  intToBytesArray(e1,    32) + \
  intToBytesArray(s2_1, 128) + \
  intToBytesArray(s2_2, 128) + \
  intToBytesArray(e2,    32) + \
  intToBytesArray(s3_1, 128) + \
  intToBytesArray(s3_2, 128) + \
  intToBytesArray(e3,    32) + \
  intToBytesArray(s4_1, 128) + \
  intToBytesArray(s4_2, 128) + \
  intToBytesArray(e4,    32) + \
  intToBytesArray(s5_1, 128) + \
  intToBytesArray(s5_2, 128) + \
  intToBytesArray(e5,    32) + \
  intToBytesArray(s6,   128) + \
  intToBytesArray(e6,    32) + \
  intToBytesArray(s7,   128) + \
  intToBytesArray(e7,    32) + \
  intToBytesArray(s8_1, 128) + \
  intToBytesArray(s8_2, 128) + \
  intToBytesArray(e8,    32) + \
  intToBytesArray(s9_1, 128) + \
  intToBytesArray(s9_2, 128) + \
  intToBytesArray(e9,    32) + \
  intToBytesArray(sL,   128) + \
  intToBytesArray(eL,    32)
  )
