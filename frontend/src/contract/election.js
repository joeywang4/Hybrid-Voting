import Web3 from 'web3'
let web3 = new Web3(window.ethereum);

web3.eth.net.getNetworkType()
.then(name => {
  if(name !== "ropsten") console.error(`You are using ${name} network. Please switch to ropsten testnet!`);
});

const abi = [
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_begin",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "_end",
        "type": "uint64"
      },
      {
        "internalType": "bytes32[]",
        "name": "_tellers",
        "type": "bytes32[]"
      },
      {
        "internalType": "bytes32[4]",
        "name": "_admin",
        "type": "bytes32[4]"
      },
      {
        "internalType": "bytes32[4]",
        "name": "_accumBase",
        "type": "bytes32[4]"
      },
      {
        "internalType": "bytes32[4]",
        "name": "_linkBase",
        "type": "bytes32[4]"
      },
      {
        "internalType": "bytes32[4]",
        "name": "_accumVoters",
        "type": "bytes32[4]"
      },
      {
        "internalType": "bytes32[4]",
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
        "internalType": "uint256",
        "name": "ballotId",
        "type": "uint256"
      }
    ],
    "name": "NewBallot",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "electionAddr",
        "type": "address"
      }
    ],
    "name": "NewElection",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "accumBase",
    "outputs": [
      {
        "internalType": "bytes32",
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "accumVoters",
    "outputs": [
      {
        "internalType": "bytes32",
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "admin",
    "outputs": [
      {
        "internalType": "bytes32",
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
    "name": "begin",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
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
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "linkBase",
    "outputs": [
      {
        "internalType": "bytes32",
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
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "linkableTagMapping",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "sigN",
    "outputs": [
      {
        "internalType": "bytes32",
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "sigPhi",
    "outputs": [
      {
        "internalType": "bytes32",
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tellers",
    "outputs": [
      {
        "internalType": "bytes32",
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tellersPubShare",
    "outputs": [
      {
        "internalType": "bytes32",
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tellersSecret",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
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
        "internalType": "uint32",
        "name": "tellerId",
        "type": "uint32"
      },
      {
        "internalType": "bytes32[4]",
        "name": "h",
        "type": "bytes32[4]"
      },
      {
        "internalType": "bytes32[4]",
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
        "internalType": "uint32",
        "name": "tellerId",
        "type": "uint32"
      },
      {
        "internalType": "bytes32[4]",
        "name": "secret",
        "type": "bytes32[4]"
      },
      {
        "internalType": "bytes32[4]",
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
    "inputs": [],
    "name": "getTellers",
    "outputs": [
      {
        "internalType": "bytes32[4][]",
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
    "name": "getAdmin",
    "outputs": [
      {
        "internalType": "bytes32[4]",
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
    "name": "getAccumBase",
    "outputs": [
      {
        "internalType": "bytes32[4]",
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
    "name": "getLinkBase",
    "outputs": [
      {
        "internalType": "bytes32[4]",
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
    "name": "getAccumVoters",
    "outputs": [
      {
        "internalType": "bytes32[4]",
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
    "name": "getSigN",
    "outputs": [
      {
        "internalType": "bytes32[4]",
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
        "internalType": "bytes32[4]",
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
        "internalType": "bytes32[4][]",
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
    "name": "getTellersSecret",
    "outputs": [
      {
        "internalType": "bytes32[4][]",
        "name": "",
        "type": "bytes32[4][]"
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
        "internalType": "bytes32[8]",
        "name": "_message",
        "type": "bytes32[8]"
      },
      {
        "internalType": "bytes32[4]",
        "name": "_pubKeyAccum",
        "type": "bytes32[4]"
      },
      {
        "internalType": "bytes32[4]",
        "name": "_linkableTag",
        "type": "bytes32[4]"
      },
      {
        "internalType": "bytes32[130]",
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
    "inputs": [],
    "name": "getBallotsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
        "internalType": "uint32",
        "name": "_idx",
        "type": "uint32"
      }
    ],
    "name": "getMessage",
    "outputs": [
      {
        "internalType": "bytes32[8]",
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
        "internalType": "uint32",
        "name": "_idx",
        "type": "uint32"
      }
    ],
    "name": "getPubKeyAccum",
    "outputs": [
      {
        "internalType": "bytes32[4]",
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
        "internalType": "uint32",
        "name": "_idx",
        "type": "uint32"
      }
    ],
    "name": "getLinkableTag",
    "outputs": [
      {
        "internalType": "bytes32[4]",
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
        "internalType": "bytes32",
        "name": "_key",
        "type": "bytes32"
      }
    ],
    "name": "getLinkableTagMapping",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
        "internalType": "uint32",
        "name": "_idx",
        "type": "uint32"
      }
    ],
    "name": "getSignature",
    "outputs": [
      {
        "internalType": "bytes32[130]",
        "name": "_signature",
        "type": "bytes32[130]"
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
        "internalType": "bytes32",
        "name": "_linkableTagHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyLinkableTag",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
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

const getElectionInfo = async address => {
  const [
    begin,
    end,
    tellers,
    admin,
    accumBase,
    linkBase,
    accumVoters,
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
  getSigN,
  getSigPhi,
  getTellersPubShare,
  getTellersSecret,
  getBallotsCount,
  getMessage,
  getPubKeyAccum,
  getLinkableTag,
  getSignature,
  getElectionInfo,
};