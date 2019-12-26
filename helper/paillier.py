from util import randrange, int_to_str, str_to_int, Hash
from Crypto.Util import number

# messages is a list containing all possible messages, len(messages) = rho
# messages[i] will be the message want to encrypt, n: public key, g=n+1
# output c = Enc(messages[i]) and signature (v,e,u)
def encrypt(messages, i, n):
  m = messages[i]
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
  e = list(map(int_to_str, e))
  u = list(map(int_to_str, u))
  output = output + v + e + u
  return ";".join(output)

def decrypt(c, key):
  phi, mu, n = key
  m = ((pow(c, phi, n**2) // n) * mu) % n
  return m

# note this function is for debugging purpose only
# should move to solidity
def message_membership_verify(messages, i, n, c, signature):
  v, e, u = signature
  n_square = n**2
  g = n+1
  rho = len(messages)
  h = Hash(sum(u[:i]+u[i+1:]))

  if (h - sum(e)) % n != 0:
    return False
  
  for j in range(rho):
    temp = (c * number.inverse(pow(g, messages[j], n_square), n_square)) % n_square
    if not pow(v[j], n, n_square) == (u[j] * pow(temp, e[j], n_square)) % n_square:
      return False
  return True

if __name__ == "__main__":
  m = 2
  messages = [1,2,3,4,5]
  rho = len(messages)
  i = 1
  n = 11*13 # product of prime

  output = encrypt(messages, i, n).split(";")
  c = output[0]
  v = output[1:rho+1]
  e = output[rho+1:2*rho+1]
  u = output[2*rho+1:3*rho+1]
  
  c = str_to_int(c)
  v = list(map(str_to_int, v))
  e = list(map(str_to_int, e))
  u = list(map(str_to_int, u))

  print(message_membership_verify(messages, i, n, c, (v,e,u)))