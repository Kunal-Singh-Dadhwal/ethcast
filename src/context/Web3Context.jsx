import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
i
ContentPlatformABI=[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "ContentAccessed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contentType",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ContentPublished",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CreatorBalanceWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CreatorPaid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PlatformFeeWithdrawn",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			}
		],
		"name": "accessContent",
		"outputs": [
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			}
		],
		"name": "publishFreeContent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "publishPaidContent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawCreatorBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawPlatformFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_paymentToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "creatorBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FREE_CONTENT_TYPE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			}
		],
		"name": "getPostInfo",
		"outputs": [
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "contentType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserPosts",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextPostId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
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
		"inputs": [],
		"name": "PAID_CONTENT_TYPE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paymentToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PLATFORM_FEE_PERCENT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
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
		"name": "posts",
		"outputs": [
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "contentType",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userPosts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postId",
				"type": "uint256"
			}
		],
		"name": "viewContent",
		"outputs": [
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Create the context
const Web3Context = createContext(null);

// Initial state
const initialState = {
  web3: null,
  accounts: [],
  currentAccount: null,
  contract: null,
  isConnected: false,
  isLoading: true,
  error: null,
  networkId: null,
  balance: '0',
  userPosts: [],
};

export const Web3Provider = ({ children, contractAddress }) => {
  const [state, setState] = useState(initialState);

  // Initialize web3 connection
  const initWeb3 = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      let web3Instance;
      // Check if MetaMask is installed
      if (window.ethereum) {
        web3Instance = new Web3(window.ethereum);
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          throw new Error('User denied account access');
        }
      } 
      // Legacy dapp browsers
      else if (window.web3) {
        web3Instance = new Web3(window.web3.currentProvider);
      } 
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        throw new Error('No Web3 provider detected. Please install MetaMask or use a Web3 enabled browser.');
      }

      // Get network ID
      const networkId = await web3Instance.eth.net.getId();
      
      // Get accounts
      const accounts = await web3Instance.eth.getAccounts();
      const currentAccount = accounts[0];
      
      // Get ETH balance
      const balance = currentAccount 
        ? await web3Instance.eth.getBalance(currentAccount)
        : '0';
      
      // Initialize contract instance
      const contract = new web3Instance.eth.Contract(
        ContentPlatformABI,
        0xF31AE64d9A256C6F141E7C29296D1011016b22Cc,
      );

      // Set up event listeners for MetaMask
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', () => window.location.reload());
      }

      setState({
        web3: web3Instance,
        accounts,
        currentAccount,
        contract,
        isConnected: true,
        isLoading: false,
        error: null,
        networkId,
        balance: web3Instance.utils.fromWei(balance, 'ether'),
        userPosts: [],
      });

      // Load user posts if connected
      if (currentAccount) {
        loadUserPosts(contract, currentAccount);
      }
    } catch (error) {
      console.error('Error initializing web3:', error);
      setState(prev => ({
        ...initialState,
        isLoading: false,
        error: error.message,
      }));
    }
  }, [contractAddress]);

  // Handle account changes
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User logged out
      setState(prev => ({
        ...prev,
        accounts: [],
        currentAccount: null,
        isConnected: false,
        balance: '0',
        userPosts: [],
      }));
    } else {
      // Get updated balance
      const balance = await state.web3.eth.getBalance(accounts[0]);
      
      setState(prev => ({
        ...prev,
        accounts,
        currentAccount: accounts[0],
        isConnected: true,
        balance: state.web3.utils.fromWei(balance, 'ether'),
        userPosts: [],
      }));

      // Reload user posts with new account
      if (state.contract) {
        loadUserPosts(state.contract, accounts[0]);
      }
    }
  };

  // Load user posts
  const loadUserPosts = async (contract, account) => {
    try {
      const postIds = await contract.methods.getUserPosts(account).call();
      
      // Only process if we have posts
      if (postIds && postIds.length > 0) {
        const postPromises = postIds.map(async (postId) => {
          const postInfo = await contract.methods.getPostInfo(postId).call();
          return {
            id: postId,
            author: postInfo.author,
            contentType: postInfo.contentType,
            price: state.web3.utils.fromWei(postInfo.price, 'ether'),
            timestamp: new Date(postInfo.timestamp * 1000), // Convert to JavaScript Date
          };
        });
        
        const posts = await Promise.all(postPromises);
        setState(prev => ({ ...prev, userPosts: posts }));
      }
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (state.isConnected) return;
    await initWeb3();
  }, [state.isConnected, initWeb3]);

  // Disconnect wallet (for UI purposes only - can't actually disconnect MetaMask)
  const disconnectWallet = useCallback(() => {
    setState(prev => ({
      ...initialState,
      web3: prev.web3, // Keep the web3 instance
      isLoading: false,
    }));
  }, []);

  // Publish free content
  const publishFreeContent = useCallback(async (content) => {
    if (!state.contract || !state.currentAccount) return null;
    
    try {
      const result = await state.contract.methods
        .publishFreeContent(content)
        .send({ from: state.currentAccount });
      
      // Reload user posts after publishing
      await loadUserPosts(state.contract, state.currentAccount);
      
      return result;
    } catch (error) {
      console.error('Error publishing free content:', error);
      throw error;
    }
  }, [state.contract, state.currentAccount]);

  // Publish paid content
  const publishPaidContent = useCallback(async (content, price) => {
    if (!state.contract || !state.currentAccount) return null;
    
    try {
      const priceInWei = state.web3.utils.toWei(price.toString(), 'ether');
      const result = await state.contract.methods
        .publishPaidContent(content, priceInWei)
        .send({ from: state.currentAccount });
      
      // Reload user posts after publishing
      await loadUserPosts(state.contract, state.currentAccount);
      
      return result;
    } catch (error) {
      console.error('Error publishing paid content:', error);
      throw error;
    }
  }, [state.contract, state.currentAccount, state.web3]);

  // Access content
  const accessContent = useCallback(async (postId) => {
    if (!state.contract || !state.currentAccount) return null;
    
    try {
      const postInfo = await state.contract.methods.getPostInfo(postId).call();
      
      // If content is free or user is the author, use viewContent
      if (postInfo.contentType === '0' || postInfo.author.toLowerCase() === state.currentAccount.toLowerCase()) {
        return await state.contract.methods.viewContent(postId).call({ from: state.currentAccount });
      } else {
        // For paid content, call accessContent which handles payment
        return await state.contract.methods.accessContent(postId).send({ from: state.currentAccount });
      }
    } catch (error) {
      console.error('Error accessing content:', error);
      throw error;
    }
  }, [state.contract, state.currentAccount]);

  // Withdraw creator balance
  const withdrawCreatorBalance = useCallback(async () => {
    if (!state.contract || !state.currentAccount) return null;
    
    try {
      return await state.contract.methods
        .withdrawCreatorBalance()
        .send({ from: state.currentAccount });
    } catch (error) {
      console.error('Error withdrawing creator balance:', error);
      throw error;
    }
  }, [state.contract, state.currentAccount]);

  // Initialize web3 on component mount
  useEffect(() => {
    initWeb3();
    
    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [initWeb3]);

  // Context value
  const contextValue = {
    ...state,
    connectWallet,
    disconnectWallet,
    publishFreeContent,
    publishPaidContent,
    accessContent,
    withdrawCreatorBalance,
    refreshUserPosts: () => loadUserPosts(state.contract, state.currentAccount),
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === null) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};