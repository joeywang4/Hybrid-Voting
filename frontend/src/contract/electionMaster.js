import Web3 from 'web3'
let web3 = new Web3(window.ethereum);

web3.eth.net.getNetworkType()
.then(name => {
  if(name !== "ropsten") console.error("Please switch to ropsten testnet!");
});

const addr = "0xbfCEBb970b01933B9cAC43F7aCf5FB39A64c4AE8";
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "electionId",
				"type": "uint256"
			}
		],
		"name": "NewElection",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
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
				"internalType": "bytes32[1][]",
				"name": "_choices",
				"type": "bytes32[1][]"
			},
			{
				"internalType": "bytes32[4][]",
				"name": "_voters",
				"type": "bytes32[4][]"
			},
			{
				"internalType": "bytes32[4][]",
				"name": "_tellers",
				"type": "bytes32[4][]"
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
			}
		],
		"name": "createElection",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
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
		"name": "elections",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint64",
				"name": "begin",
				"type": "uint64"
			},
			{
				"internalType": "uint64",
				"name": "end",
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
				"internalType": "uint32",
				"name": "_idx",
				"type": "uint32"
			}
		],
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
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_idx",
				"type": "uint32"
			}
		],
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
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getChoices",
		"outputs": [
			{
				"internalType": "bytes32[1][]",
				"name": "",
				"type": "bytes32[1][]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getElectionsCount",
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
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_idx",
				"type": "uint32"
			}
		],
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
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getVoters",
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
	}
]


const getElection = async id => {
  const Contract = new web3.eth.Contract(abi, addr);
  const data = await Contract.methods.elections(id).call()
  .then(data => data)
  .catch(error => {
    console.error(error);
    throw new Error(error);
  })
  return data;
}

const getAllElections = async (updater = null) => {
  const Contract = new web3.eth.Contract(abi, addr);
  const length = await Contract.methods.getElectionsCount().call()
  .then(data => {
    return data;
  })
  .catch(error => {
    console.error(error);
    return false;
  });
  if(length === false) return false;
  let elections = [];
  for(let i = 0;i < length;i++) {
    elections.push(await getElection(i));
    if(updater) updater(`Loading Elections (${i+1}/${length})`)
  }
  return elections;
}

const createElection = async (title, description, begin, end, choices, onHash, onConfirmed) => {
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];
  const Contract = new web3.eth.Contract(abi, addr);
  //const t1 = [[[152], [198], [86], [155], [209], [215], [34], [126], [50], [139], [212], [66], [95], [204], [5], [86], [243], [79], [195], [225], [187], [100], [193], [85], [44], [119], [160], [75], [27], [141], [98], [110]], [[33], [254], [37], [19], [5], [16], [175], [218], [190], [147], [241], [198], [106], [51], [186], [198], [201], [54], [241], [49], [121], [170], [172], [126], [100], [192], [154], [143], [166], [115], [251], [31]], [[124], [158], [17], [40], [134], [113], [250], [244], [186], [66], [174], [236], [152], [230], [163], [232], [242], [4], [76], [148], [123], [175], [92], [18], [43], [166], [105], [177], [232], [122], [55], [238]], [[90], [37], [185], [32], [52], [204], [64], [209], [77], [30], [141], [66], [244], [234], [132], [232], [196], [73], [123], [124], [145], [194], [251], [28], [139], [157], [220], [163], [16], [73], [28], [115]]];
  const t1 = [
    "0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b",
    "0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b",
    "0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b",
    "0xab38875398ceacb6b8bd48924bd9001ba3667819dfba19bb3356a0068995396b"
  ]
  //const sigN = [["0xbf","0xc2","0x54","0x28","0x82","0xdd","0x1d","0x80","0xc5","0x2f","0x9c","0x74","0x1d","0x31","0x6b","0xaf","0xfb","0x2f","0xa6","0x91","0x32","0xbb","0x8","0x99","0x48","0xdd","0xaa","0xe5","0x52","0x60","0xf3","0xad"],["0x2b","0x39","0xb0","0x72","0x2e","0xe7","0x20","0xd1","0x5a","0x6c","0x98","0x8f","0xa2","0xa2","0xa8","0x70","0xe9","0x79","0xcf","0x9","0xde","0x45","0xc5","0xc","0x8b","0x72","0x24","0xc0","0x41","0xcc","0xb","0xa8"],["0x46","0xc6","0x68","0x9d","0x75","0x25","0x14","0xb3","0xa1","0x6c","0x73","0x3c","0x6","0x6b","0xdd","0x30","0xa3","0xa7","0x12","0x7b","0xb8","0x58","0xc5","0xae","0xf","0xd5","0x89","0x36","0xf5","0x67","0x87","0xbe"],["0x4a","0x6c","0xf6","0x74","0x5a","0x5a","0x7f","0x2d","0x13","0xb6","0xbe","0xee","0xd1","0xde","0x13","0xae","0x63","0x5f","0x28","0x8","0xbd","0xb2","0x49","0x0","0x48","0xfc","0xee","0xaf","0x4b","0x60","0x97","0x93"]]
  //const sigPhi = [["0xbf","0xc2","0x54","0x28","0x82","0xdd","0x1d","0x80","0xc5","0x2f","0x9c","0x74","0x1d","0x31","0x6b","0xaf","0xfb","0x2f","0xa6","0x91","0x32","0xbb","0x8","0x99","0x48","0xdd","0xaa","0xe5","0x52","0x60","0xf3","0xad"],["0x2b","0x39","0xb0","0x72","0x2e","0xe7","0x20","0xd1","0x5a","0x6c","0x98","0x8f","0xa2","0xa2","0xa8","0x70","0xe9","0x79","0xcf","0x9","0xde","0x45","0xc5","0xc","0x8b","0x72","0x24","0xc0","0x41","0xcc","0xb","0xa6"],["0x8a","0xd1","0xbe","0xd6","0x42","0x1","0x5a","0x59","0xfe","0xc2","0x8a","0xec","0xa5","0x4b","0x8f","0x6c","0x54","0x6a","0xb9","0xb7","0x4a","0x2e","0xf8","0x1d","0x54","0xfa","0xdd","0x24","0x28","0x42","0xca","0x2e"],["0xac","0x74","0x9e","0x55","0xa6","0xd2","0x39","0xef","0xce","0x3d","0x7a","0x15","0x5d","0x96","0x31","0x2e","0x69","0x84","0x1e","0x2e","0x7e","0xc9","0x9e","0x85","0xf1","0xa3","0xf7","0x1b","0xb4","0x7d","0x32","0x98"]]
  const accumBase = [["0x2","0xf","0xcf","0xc","0x97","0x70","0x13","0x98","0x61","0x42","0x9e","0x9f","0xfc","0x8a","0xe2","0x7c","0x7e","0xbf","0x35","0xa3","0xa1","0x30","0xe7","0xec","0xb0","0x20","0x6b","0x3d","0xc","0x29","0xca","0xe4"],["0x96","0xbc","0xc7","0x36","0x58","0xf","0x63","0xc8","0xf1","0xa2","0xd","0xbd","0xc4","0xfd","0x5","0x5b","0xb","0x8d","0xb2","0xa2","0x9f","0xbc","0x41","0x92","0xc5","0xdb","0xa","0x76","0x79","0x29","0x5e","0xd6"],["0x40","0xea","0x42","0x97","0x70","0xa0","0x21","0xb6","0xc7","0x3e","0xfc","0x53","0x39","0x6b","0xa","0x26","0xb3","0xf8","0x5f","0x5b","0x4d","0x76","0xd4","0xfb","0xf1","0xe","0x4e","0x79","0x96","0xfe","0xfd","0xac"],["0x7c","0xc7","0x73","0xa6","0x48","0xab","0xc3","0xdd","0x83","0x6","0x5f","0xe4","0x42","0x69","0x94","0x94","0xd1","0xc3","0xf4","0x15","0xb2","0x7f","0xa8","0x6f","0x45","0x61","0x6b","0xbc","0x3b","0xb2","0x55","0xc6"]]
  const linkBase = [["0x2","0xf","0xcf","0xc","0x97","0x70","0x13","0x98","0x61","0x42","0x9e","0x9f","0xfc","0x8a","0xe2","0x7c","0x7e","0xbf","0x35","0xa3","0xa1","0x30","0xe7","0xec","0xb0","0x20","0x6b","0x3d","0xc","0x29","0xca","0xe4"],["0x96","0xbc","0xc7","0x36","0x58","0xf","0x63","0xc8","0xf1","0xa2","0xd","0xbd","0xc4","0xfd","0x5","0x5b","0xb","0x8d","0xb2","0xa2","0x9f","0xbc","0x41","0x92","0xc5","0xdb","0xa","0x76","0x79","0x29","0x5e","0xd6"],["0x40","0xea","0x42","0x97","0x70","0xa0","0x21","0xb6","0xc7","0x3e","0xfc","0x53","0x39","0x6b","0xa","0x26","0xb3","0xf8","0x5f","0x5b","0x4d","0x76","0xd4","0xfb","0xf1","0xe","0x4e","0x79","0x96","0xfe","0xfd","0xac"],["0x7c","0xc7","0x73","0xa6","0x48","0xab","0xc3","0xdd","0x83","0x6","0x5f","0xe4","0x42","0x69","0x94","0x94","0xd1","0xc3","0xf4","0x15","0xb2","0x7f","0xa8","0x6f","0x45","0x61","0x6b","0xbc","0x3b","0xb2","0x55","0xc6"]]
  let flag = false;
  Contract.methods.createElection(
    title,
    description,
    begin,
    end,
    choices.map(choice => [web3.utils.asciiToHex(choice)]),
    [],
    [],
	  t1,
    accumBase,
    linkBase
  ).send({from: Account})
  .on('transactionHash', onHash)
  .on('confirmation', (confirmationNumber, receipt) => {
    if(!flag) {
      flag = true;
      onConfirmed(confirmationNumber, receipt);
    }
  });
}

export { getElection, getAllElections, createElection }