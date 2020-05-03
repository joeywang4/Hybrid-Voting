import Web3 from 'web3';
import { MASTER_CONTRACT_ADDR } from '../config';
let web3 = new Web3(window.ethereum);

web3.eth.net.getNetworkType()
.then(name => {
  if(name !== "ropsten") console.error(`You are using ${name} network. Please switch to ropsten testnet!`);
});

const addr = MASTER_CONTRACT_ADDR;
const abi = [
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
    "name": "Elections",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
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
    "name": "createElection",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
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
  }
]

const getElectionAddr = async id => {
  const Contract = new web3.eth.Contract(abi, addr);
  const data = await Contract.methods.elections(id).call()
  .then(data => data)
  .catch(error => {
    console.error(error);
    throw new Error(error);
  })
  return data;
}

const getAllElectionsAddr = async (updater = null) => {
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
    //elections.push(await getElection(i));
    if(updater) updater(`Loading Elections (${i+1}/${length})`)
  }
  return elections;
}

const createElection = async (begin, end, tellers, admin, accumBase, linkBase, accumVoters, signature, onHash, onConfirmed) => {
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];
  const Contract = new web3.eth.Contract(abi, addr);

  let flag = false;
  Contract.methods.createElection(
    begin,
    end,
    tellers,
    admin,
    accumBase,
    linkBase,
    accumVoters,
    signature
  ).send({from: Account})
  .on('transactionHash', onHash)
  .on('confirmation', (confirmationNumber, receipt) => {
    if(!flag) {
      flag = true;
      onConfirmed(confirmationNumber, receipt);
    }
  });
}

export { getElectionAddr, getAllElectionsAddr, createElection }