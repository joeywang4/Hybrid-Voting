import flask
from signature import gen_sig_keypair, gen_sig_param
from flask_cors import CORS

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

app.run(host="localhost", port=8000)