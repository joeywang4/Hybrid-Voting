# Hybrid-Voting

- frontend: The web interface for voting
- backend: Manages user's information and signature public keys
- helper: A python tool that helps users do some cryptography calculations
- contract: Solidity contracts that manage elections

## Installation

#### Frontend
Use `npm` to install and run.
Our web app requires [Metamask](https://metamask.io/) to make transactions and connect to Ethereum network. Be sure to install Metamask to your browser before open it.

```bash
cd frontend
npm install
npm start
```

#### Backend
Backend requires a MongoDB database, which can be deployed free on[cloud.mongodb.com](https://www.mongodb.com/cloud).
After the MongoDB instance is deployed, the user can paste its URI to the config file `.env`.<br>
Also, user need to add **JWT secret** for token signature, **RPC address** to connect Ethereum network, and **helper URL** to connect to Python helper.

```bash
# Create this file at backend/.env
DB_URL="YOUR_URI"
JWT_SECRET="TOKEN_SECRET"
RPC_ADDR="RPC_URL"
HELPER_ADDR="HELPER_URL"
```

After that, use `npm` to install and run.
```bash
cd backend
npm install
npm start
```

#### Helper
Install the required modules, then run `main.py`.
```bash
cd helper
pip install -r requirements.txt
python main.py
```

#### Contract
We deployed out contracts on `Ropsten` test net.
ElectionMaster.sol is at [0x76686526759D735e6F8152323f2532b0a62FEA08](https://ropsten.etherscan.io/address/0x76686526759D735e6F8152323f2532b0a62FEA08).
verify.sol is at [0xBf9204329CF66ABfF23984fC21CA5710E08D397e](https://ropsten.etherscan.io/address/0xBf9204329CF66ABfF23984fC21CA5710E08D397e)
