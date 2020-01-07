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
		"constant": false,
		"inputs": [
			{
				"name": "message",
				"type": "bytes32[4]"
			},
			{
				"name": "signature",
				"type": "bytes32[4]"
			},
			{
				"name": "pubKey",
				"type": "bytes32[4]"
			}
		],
		"name": "isValidRSASig",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
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
				"type": "bytes32[4]"
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
		"constant": true,
		"inputs": [
			{
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getVaidator",
		"outputs": [
			{
				"name": "",
				"type": "bool[10]"
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
		"constant": false,
		"inputs": [
			{
				"name": "_voterId",
				"type": "uint32"
			},
			{
				"name": "i",
				"type": "uint32"
			}
		],
		"name": "VerifySignature",
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

export {};