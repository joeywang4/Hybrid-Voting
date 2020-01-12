import Web3 from 'web3'
let web3 = new Web3(window.ethereum);

web3.eth.net.getNetworkType()
.then(name => {
  if(name !== "ropsten") console.error("Please switch to ropsten testnet!");
});

const abi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tellers",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getLinkBase",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "begin",
		"outputs": [
			{
				"name": "",
				"type": "uint64"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_message",
				"type": "bytes32[8]"
			},
			{
				"name": "_pubKeyAccum",
				"type": "bytes32[4]"
			},
			{
				"name": "_linkableTag",
				"type": "bytes32[4]"
			},
			{
				"name": "_signature",
				"type": "bytes32[130]"
			}
		],
		"name": "castBallot",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getPubKeyAccum",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_linkableTag",
				"type": "bytes32[4]"
			}
		],
		"name": "verifyLinkableTag",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAccumVoters",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTellers",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4][]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getSigN",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sigPhi",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sigN",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTellersSecret",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4][]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "linkBase",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAdmin",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "tellerId",
				"type": "uint32"
			},
			{
				"name": "h",
				"type": "bytes32[4]"
			},
			{
				"name": "signature",
				"type": "bytes32[4]"
			}
		],
		"name": "sendElgamalPubShare",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_voterId",
				"type": "uint32"
			}
		],
		"name": "verify2",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getMessage",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[8]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "elgamalPubKey",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tellersSecret",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tellersPubShare",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "accumVoters",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getSignature",
		"outputs": [
			{
				"name": "_signature",
				"type": "bytes32[130]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_voterId",
				"type": "uint32"
			}
		],
		"name": "verify1",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getElgamalPubKey",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBallotsCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_voterId",
				"type": "uint32"
			}
		],
		"name": "verify3",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "accumBase",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getValidator",
		"outputs": [
			{
				"name": "",
				"type": "uint8[10]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "admin",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAccumBase",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "tellerId",
				"type": "uint32"
			},
			{
				"name": "secret",
				"type": "bytes32[4]"
			},
			{
				"name": "signature",
				"type": "bytes32[4]"
			}
		],
		"name": "sendElgamalSecret",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getLinkableTag",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getSigPhi",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getTellersPubShare",
		"outputs": [
			{
				"name": "",
				"type": "bytes32[4][]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "end",
		"outputs": [
			{
				"name": "",
				"type": "uint64"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_begin",
				"type": "uint64"
			},
			{
				"name": "_end",
				"type": "uint64"
			},
			{
				"name": "_tellers",
				"type": "bytes32[]"
			},
			{
				"name": "_admin",
				"type": "bytes32[4]"
			},
			{
				"name": "_accumBase",
				"type": "bytes32[4]"
			},
			{
				"name": "_linkBase",
				"type": "bytes32[4]"
			},
			{
				"name": "_accumVoters",
				"type": "bytes32[4]"
			},
			{
				"name": "_signature",
				"type": "bytes32[4]"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "electionAddr",
				"type": "address"
			}
		],
		"name": "NewElection",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "ballotId",
				"type": "uint256"
			}
		],
		"name": "NewBallot",
		"type": "event"
	}
]

/* Modifiers */

const sendElgamalPubShare = async (_tellerId, _h, _signature, address,  onHash, onConfirmed) => {
  const Contract = new web3.eth.Contract(abi, address);
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];

  let flag = false;
  Contract.methods.sendElgamalPubShare(
    _tellerId,
    _h,
    _signature
  ).send({from: Account})
  .on('transactionHash', onHash)
  .on('confirmation', (confirmationNumber, receipt) => {
    if(!flag) {
      flag = true;
      onConfirmed(confirmationNumber, receipt);
    }
  });
}

const sendElgamalSecret = async (_tellerId, _secret, _signature, address,  onHash, onConfirmed) => {
  const Contract = new web3.eth.Contract(abi, address);
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];

  let flag = false;
  Contract.methods.sendElgamalSecret(
    _tellerId,
    _secret,
    _signature
  ).send({from: Account})
  .on('transactionHash', onHash)
  .on('confirmation', (confirmationNumber, receipt) => {
    if(!flag) {
      flag = true;
      onConfirmed(confirmationNumber, receipt);
    }
  });
}

const castBallot = async (_message, _pubKeyAccum, _linkableTag, _signature, address, onHash, onConfirmed) => {
  const Contract = new web3.eth.Contract(abi, address);
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];
  let flag = false;
  Contract.methods.castBallot(_message, _pubKeyAccum, _linkableTag, _signature).send({from: Account})
  .on('transactionHash', onHash)
  .on('confirmation', (confirmationNumber, receipt) => {
    if(!flag) {
      flag = true;
      onConfirmed(confirmationNumber, receipt);
    }
  });
}

const VerifySignature = async (_ballotId, _stage, address, onHash, onConfirmed) => {
  const Contract = new web3.eth.Contract(abi, address);
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];
  let flag = false;
  if(_stage < 0 || _stage > 2) return false;
  let verifyFunc;
  console.log("[Contract] Stage:", _stage)
  if(_stage === 0) verifyFunc = Contract.methods.verify1;
  else if(_stage === 1) verifyFunc = Contract.methods.verify2;
  else verifyFunc = Contract.methods.verify3;
  verifyFunc(_ballotId).send({from: Account})
  .on('transactionHash', onHash)
  .on('confirmation', (confirmationNumber, receipt) => {
    if(!flag) {
      flag = true;
      onConfirmed(confirmationNumber, receipt);
    }
  });
}

/* Getters */

const getBegin = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.begin().call()
  .then(data => data);
}

const getEnd = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.end().call()
  .then(data => data);
}

const getTellers = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  const _tellers = await Contract.methods.getTellers().call()
  .then(data => data);
  if(!(Array.isArray(_tellers[0])) && _tellers.length%4 === 0) {
    let resizedTellers = [];
    for(let i = 0;i < Math.floor(_tellers.length/4);i++) {
      for(let j = 0;j < 3;j++) resizedTellers.push(_tellers[4*i+j]);
    }
    return resizedTellers;
  }
  else return _tellers;
}

const getAdmin = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getAdmin().call()
  .then(data => data);
}

const getAccumBase = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getAccumBase().call()
  .then(data => data);
}

const getLinkBase = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getLinkBase().call()
  .then(data => data);
}

const getAccumVoters = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getAccumVoters().call()
  .then(data => data);
}

const getElgamalPubKey = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getElgamalPubKey().call()
  .then(data => data);
}

const getSigN = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getSigN().call()
  .then(data => data);
}

const getSigPhi = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getSigPhi().call()
  .then(data => data);
}

const getTellersPubShare = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getTellersPubShare().call()
  .then(data => data);
}

const getTellersSecret = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getTellersSecret().call()
  .then(data => data);
}

const getBallotsCount = async address => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getBallotsCount().call()
  .then(data => data);
}

const getMessage = async (_idx, address) => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getMessage(_idx).call()
  .then(data => data);
}

const getPubKeyAccum = async (_idx, address) => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getPubKeyAccum(_idx).call()
  .then(data => data);
}

const getLinkableTag = async (_idx, address) => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getLinkableTag(_idx).call()
  .then(data => data);
}

const getSignature = async (_idx, address) => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getSignature(_idx).call()
  .then(data => data);
}

const getValidator = async (_idx, address) => {
  const Contract = new web3.eth.Contract(abi, address);
  return await Contract.methods.getValidator(_idx).call()
  .then(data => {
    return data.map(_val => parseInt(_val));
  });
}

const getElectionInfo = async address => {
  const [
    begin,
    end,
    tellers,
    admin,
    accumBase,
    linkBase,
    accumVoters,
    elgamalPubKey,
    sigN,
    sigPhi,
    tellersPubShare,
    tellersSecret
  ] = await Promise.all([
    getBegin(address),
    getEnd(address),
    getTellers(address),
    getAdmin(address),
    getAccumBase(address),
    getLinkBase(address),
    getAccumVoters(address),
    getElgamalPubKey(address),
    getSigN(address),
    getSigPhi(address),
    getTellersPubShare(address),
    getTellersSecret(address)
  ]);
  return {
    begin,
    end,
    tellers,
    admin,
    accumBase,
    linkBase,
    accumVoters,
    elgamalPubKey,
    sigN,
    sigPhi,
    tellersPubShare,
    tellersSecret
  }
}

export {
  sendElgamalPubShare,
  sendElgamalSecret,
  castBallot,
  VerifySignature,
  getBegin,
  getEnd,
  getTellers,
  getAdmin,
  getAccumBase,
  getLinkBase,
  getAccumVoters,
  getElgamalPubKey,
  getSigN,
  getSigPhi,
  getTellersPubShare,
  getTellersSecret,
  getBallotsCount,
  getMessage,
  getPubKeyAccum,
  getLinkableTag,
  getSignature,
  getValidator,
  getElectionInfo,
};