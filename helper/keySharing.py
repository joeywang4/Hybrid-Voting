from Crypto.Util import number
from util import randrange, sieve_base
from math import log2, floor

lamb = 1024
half_lamb = lamb//2
M = 2**1279 - 1 # a fixed prime for random polynomial base, need to be greater than N

# Each teller generate p_i, q_i (secretly),
# If teller_id = 1, generate in form of 4k+3, otherwise generate in form of 4k 
# Then generate random polynomials and submit points to all other tellers,
# while keep his/her own points 
# INPUT: teller_id (starts form 1), number_of_tellers (recommend to be an odd number)
# OUTPUT: [list of tuple] where output[i] = (F(i), G(i), H(i)) is the points 
#         need to be sent to i-th teller (note output[0] = (p_i, q_i, 0))
def gen_secrets(teller_id, number_of_tellers):
  offset = 3 if teller_id == 1 else 0
  bits_of_prime = half_lamb - floor(log2(number_of_tellers))
  p_i = randrange(2**(bits_of_prime-3), 2**(bits_of_prime-2))*4+offset
  q_i = randrange(2**(bits_of_prime-3), 2**(bits_of_prime-2))*4+offset
  
  ll = (number_of_tellers-1) // 2
  F_coeffs = [p_i] + [randrange(2, M) for _ in range(ll)]
  G_coeffs = [q_i] + [randrange(2, M) for _ in range(ll)]
  H_coeffs = [0] + [randrange(2, M) for _ in range(2*ll)]
  F = FiniteFieldPoly(ll, F_coeffs, M)
  G = FiniteFieldPoly(ll, G_coeffs, M)
  H = FiniteFieldPoly(2*ll, H_coeffs, M)

  output = [(F[i], G[i], H[i]) for i in range(number_of_tellers+1)]
  assert output[0] == (p_i, q_i, 0)
  return output

# Each teller get their points and compute N_i
# INPUT: [list of tuple] (F[j][i], G[j][i], H[j][i]) is the point from teller j to teller i 
# OUTPUT: N_i
def calculate_N_point(points):
  f_sum = 0
  g_sum = 0
  h_sum = 0
  for f, g, h in points:
    f_sum = (f_sum + f)%M
    g_sum = (g_sum + g)%M
    h_sum = (h_sum + h)%M
  return (f_sum*g_sum+h_sum)%M

# Given all tellers' N_i, reconstruct N
# INPUT: list where input[i] is the N_point from the i-th teller 
# OUTPUT: N
def calculate_N(N_points_list, number_of_tellers):
  # return the constant term of Lagrange polynomial passing all points
  assert len(N_points_list) == number_of_tellers
  N = 0
  for i in range(number_of_tellers):
    basis = 1
    for k in range(number_of_tellers):
      if k == i:
        continue
      basis = (basis * (k+1) * number.inverse((k+1)-(i+1), M)) % M
    N = (N + (N_points_list[i] * basis)) % M
  return N

def sieve_test(N):
  for small_prime in sieve_base():
    if N % small_prime == 0:
      return False

# generate random g s.t. the Jocobian symbol (g/N)=1
def gen_generator(N):
  found = False
  while not found:
    g = randrange(2, N)
    if number.GCD(g, N) != 1:
      continue
    g = pow(g, 2, N)
    found = True
  return g

# from tellers' self secret, create validator v
def gen_validator(teller_id, g, p_i, q_i, N):
  if teller_id == 1:
    assert (N-p_i-q_i+1) % 4 == 0
    return pow(g, (N-p_i-q_i+1)//4, N)
  else:
    assert (p_i+q_i) % 4 == 0
    return pow(g, (p_i+q_i)//4, N)

# INPUT:, N is the number to test, v is a list containing all tellers' validators
def biprimality_test(N, v):
  v_product = 1
  for v_i in v[1:]:
    v_product = (v_product * v_i) % N
  return (v[0] - v_product)%N == 0 or (v[0] + v_product)%N == 0

# given all tellers' secrets p_i, q_i, retrun private key phi, mu
# p, q are lists containing p_i, q_i 
def gen_private_key(p, q):
  n = sum(p)*sum(q)
  assert number.isPrime(p)
  assert number.isPrime(q)
  phi = (p-1)*(q-1)
  mu = number.inverse(phi, n)
  return phi, mu

class FiniteFieldPoly:
  # generate n-th order polynomial with (n+1) coefficients (from x^0 to x^n)
  def __init__(self, order, coeffs, base):
    self.order = order
    self.coeffs = list(map(lambda c: c%base, coeffs))
    self.base = base
    assert order+1 == len(coeffs)
  # return y-value of polynomial at given x-value
  def __getitem__(self, x):
    y = 0
    for i in range(self.order+1):
      y = (y + self.coeffs[i]*pow(x, i, self.base)) % self.base
    return y

if __name__ == "__main__":
  # Stage 1
  # Each teller generate secrets
  secret1 = gen_secrets(1, 3)
  secret2 = gen_secrets(2, 3)
  secret3 = gen_secrets(3, 3)
  # Each teller send other tellers their points
  for1 = [secret1[1], secret2[1], secret3[1]]
  for2 = [secret1[2], secret2[2], secret3[2]]
  for3 = [secret1[3], secret2[3], secret3[3]]
  # Stage 2
  # Each teller claculate N_point
  N1 = calculate_N_point(for1)
  N2 = calculate_N_point(for2)
  N3 = calculate_N_point(for3)
  # Server recover N
  N = calculate_N([N1, N2, N3], 3)
  # Server sieve N by small primes
  check = sieve_test(N)
  print(check)
  # ↓↓↓↓↓↓↓↓↓↓↓↓ This need to repeat 500 times ↓↓↓↓↓↓↓↓↓↓↓↓
  # Server generate a generator
  g = gen_generator(N)
  # Stage 3
  # Each teller generate validators
  v1 = gen_validator(1, g, secret1[0][0], secret1[0][1], N)
  v2 = gen_validator(2, g, secret2[0][0], secret2[0][1], N)
  v3 = gen_validator(3, g, secret3[0][0], secret3[0][1], N)
  # Server run biprimality test
  check = biprimality_test(N, [v1,v2,v3])
  print(check)
  # ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
  
  # ================== Election End ==================
  # Each teller submit their secret
  p1, q1 = secret1[0][0], secret1[0][1]
  p2, q2 = secret2[0][0], secret2[0][1]
  p3, q3 = secret3[0][0], secret3[0][1]

  p = p1+p2+p3
  q = q1+q2+q3
  
  print(N == p*q)
  print(number.isPrime(p))
  print(number.isPrime(q))