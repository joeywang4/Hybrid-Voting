import flask
from flask import request
from flask_cors import CORS
import json
from Crypto.Hash import keccak
from signature import gen_sig_keypair, gen_sig_param, gen_accum_voters, sign_ballot, is_valid_sig_pair
from RSAsignatue import RSA_siganture
from elgamal import encrypt, decrypt
from util import int_to_str, str_to_int, randrange, listHex_to_int

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

base = 0x86903f29644f242c0963c68203b0b2aee30f03f91d0782729783075abfca89a007c6ac738ccfb57a76221f2d6a5f00b6249aab653ec07d15ace1cffefeeeff9182b1683ed0173e6938435d1ce601bc3734f24c77c7b6b881d0e835c27723ba316e7a5b5915bd1a3d2dfd136c5c89663262bdc5ad4dfff4186818268c00858ec4
module = 0x922d4cf5211046382947a6b76da9def5ddd8718e6f5b84bd664a77c0d94d038cfa9b8604690073cca075dad2ce7a6a0f72a3e1c47fb00238b279cf7e908574c549d664940253b78a1aa901720d3fa053ddfbcdcd0905a8a90c6eb608392d391c5b1027ad538528c2a7b90f972f5d192aaa8260607065118388e630b7dab03753

@app.route('/', methods=['GET'])
def home():
    return "<h1>This is the helper for Hybrid-Voting</h1>"

@app.route('/genSigKey', methods=['GET'])
def genSigKey():
  return gen_sig_keypair()

@app.route('/genSigParam', methods=['GET'])
def genSigParam():
  return gen_sig_param()

@app.route('/genAccumVoters', methods=['POST'])
def genAccumVoters():
  print(request.json['accumBase'], request.json['voters'])
  accumBase, voters = str_to_int(request.json['accumBase']), [str_to_int(voter) for voter in request.json['voters']]
  print("[*]", accumBase, voters)
  result = gen_accum_voters(accumBase, voters)
  return int_to_str(result)

@app.route('/getRandom', methods=['GET'])
def genRandom():
  _min = request.args.get('min')
  _max = request.args.get('max')
  if _min is None:
    _min = 0
  else:
    _min = int(_min)
  if _max is None:
    _max = (1<<1023)
  else:
    _max = int(_max)
  return int_to_str(randrange(_min, _max))

@app.route('/electionSignature', methods=['POST'])
def genElectionSignature():
  sk = request.json['sigPrivKey']
  sk_p, sk_q = [str_to_int(x) for x in sk.split(";")]
  def convert(x): return b"".join([bytes.fromhex(bytes32_data[2:]) for bytes32_data in x])

  data = request.json['begin'].to_bytes(8, 'big', signed=False) + \
         request.json['end'].to_bytes(8, 'big', signed=False) + \
         convert(request.json['tellers']) + \
         convert(request.json['admin']) + \
         convert(request.json['accumBase']) + \
         convert(request.json['linkBase']) + \
         convert(request.json['accumVoters'])
  print("[*] Election data:", data)
  digest = keccak.new(data=data, digest_bits=256).digest()
  digest = int.from_bytes(digest, 'big', signed=False)
  sig = RSA_siganture(sk_p, sk_q, digest)
  print("[*] Election Signature", hex(sig))
  return int_to_str(sig)

@app.route('/numberSignature', methods=['POST'])
def genNumberSignature():
  print(request.json['number'])
  try:
    number = request.json['number']
    if number.isnumeric():
      number = int(number)
    else:
      number = str_to_int(number)
    print(number)
    sk = request.json['sigPrivKey']
    sk_p, sk_q = [str_to_int(x) for x in sk.split(";")]
    print(sk_p, sk_q)
    data = number.to_bytes(128, 'big', signed=False)
    print(data)
    digest = keccak.new(data=data, digest_bits=256).digest()
    digest = int.from_bytes(digest, 'big', signed=False)
    print(digest)
    sig = RSA_siganture(sk_p, sk_q, digest)
    print(sig)
    return int_to_str(sig)
  except:
    return "Error"

@app.route('/elGamalExp', methods=['POST'])
def exp():
  try:
    power = request.json['power']
    if power.isnumeric():
      power = int(power)
    else:
      power = str_to_int(power)
    return int_to_str(pow(base, power, module))
  except:
    return "Error"

@app.route('/createBallot', methods=['POST'])
def createBallot():
  try:
    list_of_pks = request.json['voters']
    list_of_pks = [str_to_int(x) for x in list_of_pks]
    sk_p, sk_q = request.json['sigPrivKey'].split(";")
    sk_p, sk_q = str_to_int(sk_p), str_to_int(sk_q)
    pk = str_to_int(request.json['sigPubKey'])
    k = str_to_int(request.json['eKey'])
    pubKey = 1

    if not is_valid_sig_pair(sk_p, sk_q, pk):
      return "Bad Key Pair", 400
    tellersPubShare = [int(pubShare, 16) for pubShare in request.json['tellersPubShare']]
    for i in range(len(tellersPubShare)):
      pubKey *= tellersPubShare[i]
      pubKey %= module
    c1, c2 = encrypt(pubKey, k, int(request.json['choice']))
    accumBase = str_to_int(request.json['accumBase'])
    linkBase = str_to_int(request.json['linkBase'])
    sig = sign_ballot(list_of_pks, (sk_p, sk_q, pk), (c1, c2), (accumBase, linkBase))
    sig = [int_to_str(x) for x in sig]
    return json.dumps({"signature": sig, "message": [int_to_str(c1), int_to_str(c2)]})
  except:
    return "Error", 400

@app.route('/decryptBallot', methods=['POST'])
def decryptBallot():
  c1, c2 = [listHex_to_int(cipher) for cipher in [request.json['message'][0:4], request.json['message'][4:8]]]
  pubShares = [listHex_to_int(pubShare) for pubShare in request.json['pubShares']]
  secrets = [listHex_to_int(secret) for secret in request.json['secret']]
  if len(pubShares) != len(secrets):
    return "Invalid key sharing", 400
  for i in range(len(pubShares)):
    if pow(base, secrets[i], module) != pubShares[i]:
      print(i)
      return "Invlid secret", 400
  privKey = sum(secrets) % (module-1)
  pubKey = 1
  for pubShare in pubShares:
    pubKey *= pubShare
    pubKey %= module
  pt = decrypt(privKey, c1, c2)
  return json.dumps({"choice": pt}), 200

app.run(host="localhost", port=8000)