import Web3 from 'web3'
let web3 = new Web3(window.ethereum);

web3.eth.net.getNetworkType()
.then(name => {
  if(name !== "ropsten") console.error("Please switch to ropsten testnet!");
});

const addr = "0x99FC892456C4eAeFc8b3adc7A8BC5f06A293E4A6";
const abi = [
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
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32[4]",
				"name": "_message",
				"type": "bytes32[4]"
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
		"name": "recieveBallot",
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
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "verify0",
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
				"name": "_idx",
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
		"constant": false,
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_idx",
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
		"constant": false,
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_idx",
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
		"constant": false,
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "verify4",
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
				"internalType": "uint32",
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getMessage",
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
				"internalType": "uint32",
				"name": "_idx",
				"type": "uint32"
			}
		],
		"name": "getVaidator",
		"outputs": [
			{
				"internalType": "bool[10]",
				"name": "",
				"type": "bool[10]"
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
			},
			{
				"internalType": "bytes32[4]",
				"name": "_v",
				"type": "bytes32[4]"
			}
		],
		"name": "verifyPubKeyAccum",
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

const sig = [
  '0x044687d66f4fdc45cc296c085c8b27607c0d644136072e91cba701160e5855e4', '0x91986382903fcac9dfcc3510fabbd59ac5095210fd18a52bae1a647eace33436', '0x7b38282ca70ab3025e91565397f1f494c2ac70702c220d6cb014656030b6ffd7', '0xee7f962817a692bb85cc0ac844a0282f9ce860ad0e22b6a36657436a9df9b9f1', '0x1b0efda9a94e1392f25b647195674cf57d80c55038caa8e8496cc2ed116d0694', '0x875f887643b2515902e0ab4a9655e1dd9f24e17ca33f2bbeeff9416534da9aaa', '0xe13d2ae3a011386d43fde6ef190a4fe48d654415d125642d6da392969bd0fe1e', '0xd0e08a39bb11e87c81f1fae709ecef60b06278e1c2cef908ee117882095caa35', '0x3c8dd5cbf74f284b2ecd59011be12d8fbddc665364af45683a92d19b20d7ea3c', '0xcd8b2d288744f83b4e7133676af5b3620d236a1e9d9f20899aa79f831132c858', '0x076c1b5579e8a5fa8c74755d6d85ecea9e72e7daa3e75f962bb8e4ba12e5dd3d', '0x4f9be5faa6f49fcae6128fa5a012ba2a0f0a67c4806049f88c570cd769288c10', '0x84b294b5c79c6ff7a6e4e9462f2f55a9a8951902866a73ff321c57c2f221f26b', '0xbc140780ee008102cab72f922b71091a1ece4434ac0ff2d2005277032b275a28', '0x6bd3da31866a267d1824c97b8db40714a569ee50e07e562ad1230afabff40b69', '0xf474e8adc7f6632a2bdb0591521665d4d25eadde001631b627e0ef4fbf36c720', '0x37bb677ef46ae33211261201d91244cf72d8cca76c7f022badd9021c25ea3b7f', '0x56d6df32598eca6806f7ed3d954c72644266716a860363e72387de643567c8c8', '0x1b92e3ee8f03d5a83423f7e0dc8e4bfedfdc91bebeed0cbd94b35c5a954450c4', '0xc4fe5699075600810b5c2ad3007569f4a901fe0a5c2130abf2f7ab3cdbd13a3f', '0x59bb3fbb0bb89fbb1b31e610503043b4229b0f4dedba1de1772d5e6b50cd47db', '0x00c9816915ebca0c10dc27b7fa5d985bb174c2344739c32989adb2d853d843f3', '0xf1c3bd67c662f9fa37e724b3e32510eaca94d25c2b8fa4b804f9db3f40ed82d1', '0xd1ef6c798184482c6281f7ef2de2d2f872e993cf261ecefd3053b1de8599b6f6', '0x93b099f44f7ac2ceaa09a2ebe4ad5b8ee98b3363525df302cc69026eae91c295', '0xc7b9c1692405271ff560d4bf0d173da41bca2b580b769b093b6fa1d15b388194', '0x7957555a476576ff5974820f8076be273fa8cb800dae4ab4f08717f3b6fdc330', '0x314b47f13b9a067ee8ab07faf86d1f796eac27a6d174df878cd12ab9f8e968ed', '0xaad9e4523dc3762c7ddc5107fc8ce75f556da6576dda066aed3cef47744d8d20', '0x3a4ba3b104cfaeb40e6ecaf0bd000d82c47b9476470a1d26d0a747af64f78136', '0xe79f0af0fadc5ad895451fc7b523bc8c09cb822275a1443212d108c1938914d1', '0x703e793362f5a5b2152b02d681b7835e548b39454bf1667672a3e439b84a9d4a', '0x12ee0a11c684dd63a8da42b13a75e6fd689e6c37e864616db56dda78f95da694', '0x73d5ce6461528c25c3af4bcfc2488ba4d99f479a7bda5c3c89dfa6c072487df0', '0x8d561f12e0a33db85e6ab937d1a02abdfffbeda7b17e19f3659711185a531f69', '0xd0f606ded0ea95084ce2a22c2b6630e500176eaa832eb3aa5a2a8a1e96ac83e4', '0x7534cab0fab619e04850266a9837ec624a8805a57024b652ffdafce813d47871', '0x0c65fb57c5e882669cee22345c2895a8680245d53dacec3ad4366214654f76e4', '0x3f4f18c060ea8105912822dff2a9ca9464c0388e32320445dcd8b7c95e8b9aa9', '0x1370fd0bf9ae365591bfb6cfd701e8c35acf9e681a3cc417e95cbef378c4c6a3', '0x138873d3cef54c0a85950607b0c88f77de5ff972ff044041280e247baddd6983', '0x4a6cc9c53a51fb4e70e8041cc2fa010df1976198d0cd4b538629a7fbf1f998af', '0x645b3a5dc1a4a06f3207ab64ef709cb64ad28e89fe64006dbfcb1208f212ad66', '0xf3f159492999f974fcc93ebb4efa2c121f4869e331911b9d08fa80b5a9ff0441', '0xa0855251b48efb64cc9b87554b5097e570c1d33ee04cd668edc46f3d8890fe0b', '0x2ba098c95e18f2a2d55fe18da5daec91655d0b83c7dafede780e56727f75db80', '0xe03da97c12de86c51bf5b0156afd4b3cb19450fa93855aff453302e12d0bad53', '0xa4678615ca99199ceb7ba1d67cd359a15ffc09f6862bd5c4d7f22d8ed65c1a6b', '0x255067e199c4e8813aff7c2acb1d1c95eee347cb7fbd50dc3d3ea5b6d08bb9b4', '0x7d5b7bb9d4162ae5c82ab0637809a23ecddc6a55fce53275a323d0697006cc58', '0xa5673360a117b98832064a506ba8a9c032b6798d9f7eb5786f7fe9ab182e877d', '0x27eb0056b6755b57bd4c4a8a3a9b48d0c6959a7bc402d515dcc40f160bc79b64', '0x9b5e6cf680482fc355ddfe1614bb449d0557bba2b202d7ee8c32a9a2123a7450', '0xd282b340a949d26494351ca94e86085659c40baa0b6998018d5edae2a4e8c224', '0xdea72171182799f269c15fe47f5ffa025a899c039c06b1b17dfb17db910ceb89', '0x7c90253979911b60dd8addc2b2a3635556668085b930f9dcc544fb3075cea340', '0x32addb4c6c4a107d8a86d5417220a5d4085c4f8950c7c5c79e53f237547f3da3', '0x1cf50f487f13d813e8f391d2d8de4fa2745e8a5d8b598f344da5747f1b0757f1', '0xa97991a01e350105bbb134c5a6f623d6ac0c320014d9d62393624aa0c2b04c12', '0x475f0b5e8c1092c6b62fb8e6451cb747696e8fda9fb5db038d96cf26658eedb8', '0xf28efa6197f261934e605889b7fadc1c224a0b056fa19e444cbfa6c3dca55611', '0x640d1727f792ff7e5b9b88719ab92579b9aa0e910aa876afd87458c4ebf15563', '0xae4743a79c798ddab6207e05e45f1a60e5bb9affce329252837135416b7134fa', '0xab92fc5b732010615403d2b175d9ceac980aa9fb2e42e3c142660fdd90d1e88d', '0xffedca8fa601a8c6965ecaaebc6b29e82b08b70633711b85717b23ee4bdb0de4', '0x2d9d03eaf194c6acb1bdc14264dbe61edeb6baa0bb9b3e8f4d366bca4a4f4b25', '0x6f3a62f927ac0b2aabc56e78c58f6d727562bd8b020823498a6c93e0f8513224', '0xdf1d52a2b1a5713ee75b2c437d8e88201d2c3b890d9d0cb77c308a4381e16abb', '0xaff876bda613ef8d4d08055a2c2f10cbb34dd39bb25b5680dea537c405afa68d', '0x5fa0e9be624d91a59b0186465af7d3e193a9b6d1351d74c47e1147e81954c29f', '0x51728c6f19826b2525754f59a6a1e75f4acc00475a25e9e790969fa5f310decf', '0x3004bc88fc06d8f78f4846db54b3800f8884b7bc07723f043d7ce11215b60f1d', '0x8fe8cdc4f082d217cdf73ece58da8f51e8ec444470474ded740af92e0a6cea21', '0x9da6d707bbf5dbc52a38aabcf54c70df28588530a4d2fd43080623e42284a075', '0x11246381146c41316e1981b96675e30ad711ab2ea0e20ce4f4e73c866ab5d75f', '0x20cc5ad676ea8eabb6ea7974bd151e800ad5eb46a8c54094e8a460431905df8e', '0x8a3d74c3e6dc0be8c546a19f0db40fc05352fbce2992c801b82d2a4d604fcf12', '0x56c970d0a44335b9c8514282ea09ff4cfa1916830ae3781073191bd3bfe5fb69', '0xde72899ceef860e13397a4608f09a535e9a8799a0744fc77ea09e696249b5278', '0x73232660a586cbe1432cf1824ef9dc92fac010cf0ec211bf9769ddb10b69a472', '0x2cb46504e689a8ba53ee4700b4af4f6b0ed9e0b27266be55eecbedca58b3af56', '0x1b6832c13d5ed7610d2140e4b6f0ba5d6891589638b2a999754ce521e6dde54f', '0xd5ce8d9b76109b618bdcb91364cc413cde8826c7171392995761c9e54cb22877', '0x730101d7f595aaed615000a7004039bb8a20e633ca258011961884cb1c827567', '0x7d793fe4e84ad4371879a1d52a709996592d7d2a7f36703bebaa6f4e20602818', '0x1ee6f00cc87c3913519c2db416ff08cbae5e93cdc7d45ac14be9e414e1427ae6', '0xef3d931f2aee3fd415b41ce4de5c82da8f5572e0fe794abba3ed361e54089735', '0x22e6c547998ace04d1dfabd44b4be494a89374cd6ba2bd0be530d85109d4f6f3', '0x4f95dc88817f6f01725837140631e50057536501225f0b211aba15d8dc0dfe6a', '0x54d7ad5d994296dc6c8ed24c467e59a34b01edc9cebb2380f3099fa064c3557d', '0xfad00f38cd5ca64992dae553abc5d065bbe81ae4ffbe6f047de41d0a6d324f02', '0xdc522f062c9d9356932872ae2ca5790ccc0d69e21016b0999f8649d76091f752', '0x329073b948a7e648445ea4a189b5a0f25800520f4ba6068cef3072264cab52ae', '0xe87d60713066825e55a3fbfca2563b118dfb0542648e5b5ac8df529c4661de05', '0x4d51d5c34a293fbe3ec6789e0038d6a86857627443a751f7592aa7b192f72742', '0x206cba3e2615efb8d8b3b6573dd62923ae389f2c8e4c0ec60d04f2c94c8de398', '0xc0debc7e25a83df4b9e91de0af432bba787b88d96b644a71582ff4ec39a64e58', '0x652bbcd3530f68a1ff1bd61c902eb253e25c43d46ce5a27b26648c6be92ec46f', '0x8828b0787b0d31b04edcccfd033e28d6f6f33f8e455ae4df5b4b7ef1a2c24964', '0xae3d99efcd9ebbba7e064449f9189d67ef36e2a248c21751edcc211b708e002e', '0xc085b8e36bd8a522dc3989b90cdf82f8a720a4a890c9f945f9e432094ceae018', '0x867d0cd9ef0414b68d4b93abd6b3cf505291686bacd650bdc12f63e5b37da69e', '0x135e23cde64a4c129bd5096bf5bae91263e1cf00befe6bb78e4f6d173a1402c1', '0x261f2569a9f8b965b77b27234399e44566638d8209d425ebb8eb587564166663', '0xfa3a905da4dbe23f013222f709f31fb5316f3a063b77c1ea182e000352b89966', '0xfa8654ffbc67f379eac9a6a7693dea23f25e3c981f01727ee9e996a0c84bbea3', '0x0cf791b6d52ca9dd547589560f224767cde7ba8ff9478cd2fa1f1f5766cf1dbb', '0x60515fee8f9b49843bdd4166863e2180aba02361d9e249039a868d324b28c9ac', '0x1335eaf1f1c3363cefa1ff53c44ef83da51bb0ddcb86b81173837fc083623166', '0x12c0478825fdd8f295fb1db42a5b8d5b4a697c0b792bec8946c8104a40360d55', '0xf68adcfd367154708a3714b2e1e613376ac189c8ff7eab70bd10856bdf6adb56', '0x1ba2580e4ac70f4996a6826fb86c332b3ca0bb48a301974d053a082a5450f559', '0xfdc03427feb566b5a205dabd91a973739d5c1f405ef21e9fe33cd26aa5287794', '0xeb499629521c53a3605b9cbee07167347858377edb5412d0648d130c9963f490', '0x8af715b7cfa8c5b6b31d3c5a70f38465b751eb130c3f5bf04e44d188e398e2cf', '0xd1e680dec54bbdd53bd020e9253c3a57ba8e81604acc283a4efddd7ad1de11dd', '0x4b0b224dd011bf128dbe69b5e39af18f277eabe984319a2e51f853b1853a3a63', '0xbbc95e779d6e085d0a050dcd16e545b934f24426b094bb4ec346a311494f3ad3', '0x3129edf855d7d42e3ee8530880ce728d34c0d353e7cb1181275ef8fc93828876', '0xdc0dd5203d4daa702ae4f2c4515b9995c5645d02a1b04429c6e9b21324ac0313', '0x3095802de883d53bc412be0c9a3f4d34b8d61d78a94d2788f31cfb7de48f3146', '0x80f13673851ef0e088a40f3e6bf538adcea372cac05d7751c7f9798271419e8f', '0x8f95774b8f21f27ab393d48e210d241abc2fef9a4d6c04d9a0cde82c2a33aa02', '0xe0b32bed531f540eae08a2d100009d39670ff1cf072e6bd860423b7a7ac339d3', '0x85367a6a2a37d2de9571cb01abcf8d712689718c530e5a2c1867d1ae809628c9', '0x8b8f6d02c67515b6b2960d8f07858518bceffb4a008ad650e92af208cf98afd1', '0xabec4487548ad8f8e12b0864bee141d77d2c96073725b134838fdaace2dded28', '0xe32b015a8c7b058f726bdf142a04b0a7042a402e410bb1b4dae312b79a497d57', '0x8b937629aadb691d7f7ba697c3a46bd0e5462e42b4bf4d59967134e03678a934', '0xb305f7b77d3f41149ccc38c380e4e2810b81b9c123c92e69327a8c6f4b660f0c'
];
const m = [
  '0x0000000000000000000000000000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000000', '0x000000000000000000000000000000000000000000000042ed123f1606884be3'
];
const v = [
  '0x2d125eab2689ef946df5e546e5fe262111aca27d04b70dcd5dd5478a0ab63a47', '0x7e21b81667ac2d1029ce8c95368a7f6540dec02f8fde07194a17e024e4628797', '0x2b4b5612622611f0a2f89ee53654cbec16c026352e502e86f812263fa28a851a', '0x9ba0d8c402cb5529270ac1c49a106c151462505503f296ad846501d170c86925'
];
const y_hat = [
  '0x1d40b2bdd6b34132d3e1e3c0bab756a073cad4ece092b060cc16bcfa2199ae5c', '0xd5e18e260c6f27324b5572a4386959b30bcd6441cc94bb9d3026c116c70f0e0d', '0xf8247fb1c144d04134619337ae90befeaeda32c3ffde60d9de68fec4789c6706', '0xd4ee7cba1bf1e6f6c6703993c17c0ff466927401f98b034564b688bb1a7ffd04'
];

const sendBallot = async (_message, _pubKeyAccum, _linkableTag, _signature, onHash, onConfirmed) => {
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];
  const Contract = new web3.eth.Contract(abi, addr);
  let flag = false;
  Contract.methods.recieveBallot(_message, _pubKeyAccum, _linkableTag, _signature)
  .send({from: Account})
  .on('transactionHash', onHash)
  .on('confirmation', (confirmationNumber, receipt) => {
    if(!flag) {
      flag = true;
      onConfirmed(confirmationNumber, receipt);
    }
  });
}

const sigVerify1 = async (id, onHash, onConfirmed) => {
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];
  const Contract = new web3.eth.Contract(abi, addr);
  let flag = false;
  Contract.methods.verify1(id)
  .send({from: Account})
  .on('transactionHash', onHash)
  .on('confirmation', (confirmationNumber, receipt) => {
    if(!flag) {
      flag = true;
      onConfirmed(confirmationNumber, receipt);
    }
  });
}

const verifyPubKeyAccum = async (_id, _v) => {
  const Contract = new web3.eth.Contract(abi, addr);
  const result = await Contract.methods.verifyPubKeyAccum(_id, _v).call()
  .then(data => {
    return data;
  })
  .catch(error => {
    console.error(error);
    return false;
  });
  console.log(result);
  return result;
}

const test = async () => {
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];
  const Contract = new web3.eth.Contract(abi, addr);
  await Contract.methods.verify1(0).estimateGas({from: Account})
  .then(function(gasAmount){
      console.log("Got amount:", gasAmount);
  })
  .catch(function(error){
    console.log("Something bad happened");
      console.error(error);
  });
}

const test2 = async () => {
  await window.ethereum.enable();
  const accounts = await web3.eth.getAccounts();
  if(!Array.isArray(accounts) || accounts.length < 1) throw new Error("Get account error!");
  const Account = accounts[0];
  const Contract = new web3.eth.Contract(abi, addr);
  await Contract.methods.recieveBallot(m, v, y_hat, sig).estimateGas({from: Account})
  .then(function(gasAmount){
      console.log("Got amount:", gasAmount);
  })
  .catch(function(error){
    console.log("Something bad happened");
      console.error(error);
  });
}

//sendBallot(m, v, y_hat, sig, hash => console.log("Sendballot, hash:", hash), (confirmationNumber, receipt) => console.log((confirmationNumber, receipt)));
//sigVerify1(1, hash => console.log(hash), (num, rec) => console.log(num, rec));
//verifyPubKeyAccum(1, v);

export { sendBallot, sigVerify1, verifyPubKeyAccum, test, test2 }