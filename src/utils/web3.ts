import Web3, { Address, ContractAbi } from 'web3'

// Connect to Ethereum node (e.g., Infura)
const web3: Web3 = new Web3('https://sepolia.infura.io/v3/18614d8b7e534f2c80315ca7334420c1');

// Add your smart contract ABI and address
const contractABI: ContractAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_text",
        "type": "string"
      },
      {
        "internalType": "int256[]",
        "name": "_scores",
        "type": "int256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_numWords",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_numHits",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_averages",
        "type": "uint256[]"
      },
      {
        "internalType": "string[]",
        "name": "_types",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "_locales",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "_votes",
        "type": "string[]"
      }
    ],
    "name": "addFeedback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "feedbacks",
    "outputs": [
      {
        "internalType": "string",
        "name": "text",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getFeedback",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "int256",
            "name": "score",
            "type": "int256"
          },
          {
            "internalType": "uint256",
            "name": "numWords",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "numHits",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "average",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "sentimentType",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "locale",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "vote",
            "type": "string"
          }
        ],
        "internalType": "struct FeedbackStorage.Sentiment[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "getFeedbackByUser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "text",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "int256",
                "name": "score",
                "type": "int256"
              },
              {
                "internalType": "uint256",
                "name": "numWords",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "numHits",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "average",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "sentimentType",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "locale",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "vote",
                "type": "string"
              }
            ],
            "internalType": "struct FeedbackStorage.Sentiment[]",
            "name": "sentiments",
            "type": "tuple[]"
          },
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "internalType": "struct FeedbackStorage.Feedback[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vote",
        "type": "string"
      }
    ],
    "name": "getFeedbackByVote",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "text",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "int256",
                "name": "score",
                "type": "int256"
              },
              {
                "internalType": "uint256",
                "name": "numWords",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "numHits",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "average",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "sentimentType",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "locale",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "vote",
                "type": "string"
              }
            ],
            "internalType": "struct FeedbackStorage.Sentiment[]",
            "name": "sentiments",
            "type": "tuple[]"
          },
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "internalType": "struct FeedbackStorage.Feedback[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFeedbackCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const contractAddress: Address = '0x042ecb8d07A72C2b044FFa405642Dd72253Ac40c';

// Create contract instance
const feedbackContract = new web3.eth.Contract(contractABI, contractAddress);

export { feedbackContract, web3, contractABI, contractAddress };

