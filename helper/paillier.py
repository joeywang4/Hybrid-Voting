from util import randrange, int_to_str, str_to_int, Hash
from Crypto.Util import number

# m: message want to encrypt , n: public key, g=n+1
# messages is a list containing all possible messages, len(messages) = rho
# i is the message index that the prover encrypts
# c = Enc(messages[i]) = Enc(m)
def encryption(m, n, messages, i):
  g = n+1
  n_square = n**2
  found = False
  while not found:
    r = randrange(2, n)
    found = number.GCD(r, n) == 1
  # g=n+1 -> g^m mod n^2 = nm+1 mod n^2  
  c = (((n*m+1)%n_square)*pow(r, n, n_square)) % n_square
  output = [int_to_str(c)]
  # membership proof
  # 1. pick random k in Z_n*, (rho-1) {e_j}(j!=i) in Z_n, (rho-1) {v_j}(j!=i) in Z_n*
  # 2. compute u_i = k^n mod n^2, {u_j=v_j^n(g^m_j/C)^e_j mod n^2}(j!=i)
  # 3. compute e_i = H(sum_(j!=i)u_j)-sum_(j!=i)e_j mod n
  # 4. compute v_i = rho*r^e_j*g^(e/n) mod n
  # 5. send {v_j, e_j, u_j}(j in P)
  rho = len(messages)
  # 1. k
  found = False
  while not found:
    k = randrange(2, n)
    found = number.GCD(k, n) == 1
  e = [None]*(rho) # Note that the index starts from 0
  v = [None]*(rho) # Note that the index starts from 0
  u = [None]*(rho) # Note that the index starts from 0
  # 1. {e_j}(j!=i), {v_j}(j!=i)
  for j in range(rho):
    if j != i:
      e[j] = randrange(2, n)
      found = False
      while not found:
        temp = randrange(2, n)
        found = number.GCD(temp, n) == 1
      v[j] = temp
  # 2. u_i, {u_j}(j!=i)
  for j in range(rho):
    if j == i:
      u[j] = pow(k, n, n_square)
    else:
      temp = (pow(g, messages[j], n_square) * number.inverse(c, n_square)) % n_square
      u[j] = (pow(v[j], n, n_square) * pow(temp, e[j], n_square)) % n_square
  # 3. e_i
  h = Hash(sum(u[:i]+u[i+1:]))
  e[i] = (h-sum(e[:i]+e[i+1:])) % n
  # 4. v_i
  v[i] = (k*pow(r, e[i], n)*pow(g, e[i]//n, n)) % n
  # 5.
  v = list(map(int_to_str, v))
  e = list(map(int_to_str, v))
  u = list(map(int_to_str, v))
  output = output + v + e + u
  return ";".join(output)

def decryption(c, key):
  phi, mu, n = key
  m = ((pow(c, phi, n**2) // n) * mu) % n
  return m
