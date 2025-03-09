import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import ContentPlatformABI from './abis/ContentPlatform.json'; // Import your contract ABI

// Create the context and export it
export const Web3Context = createContext(null);

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
        contractAddress
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