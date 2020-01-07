import flask
from flask import request
from flask_cors import CORS
import json
from signature import gen_sig_keypair, gen_sig_param, gen_accum_voters
from util import int_to_str, str_to_int, randrange

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


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

app.run(host="localhost", port=8000)