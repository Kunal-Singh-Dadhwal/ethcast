"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import ContentPlatformABI from './abis/ContentPlatform.json'; // Import your contract ABI
import { useWallet } from './WalletContext'; // Import WalletContext

// Create the context and export it
export const Web3Context = createContext(null);

// Initial state - remove wallet connection related state
const initialState = {
  web3: null,
  contract: null,
  isLoading: true,
  error: null,
  networkId: null,
  balance: '0',
  userPosts: [],
};

export const Web3Provider = ({ children, contractAddress }) => {
  const [state, setState] = useState(initialState);
  
  // Get wallet information from WalletContext
  const { connected, walletAddress, walletType } = useWallet();

  // Initialize web3 connection when wallet gets connected
  const initWeb3 = useCallback(async () => {
    // Only proceed if we have a connected wallet that is MetaMask
    if (!connected || walletType !== 'metamask') {
      setState(prev => ({
        ...initialState,
        isLoading: false,
        error: !connected ? 'Wallet not connected' : 'Unsupported wallet type'
      }));
      return;
    }
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      let web3Instance;
      // Use existing ethereum provider from the connected wallet
      if (window.ethereum) {
        web3Instance = new Web3(window.ethereum);
      } else {
        throw new Error('No Web3 provider detected. Please check your wallet connection.');
      }

      // Get network ID
      const networkId = await web3Instance.eth.net.getId();
      
      // Get ETH balance
      const balance = walletAddress 
        ? await web3Instance.eth.getBalance(walletAddress)
        : '0';
      
      // Initialize contract instance
      const contract = new web3Instance.eth.Contract(
        ContentPlatformABI,
        contractAddress
      );

      setState({
        web3: web3Instance,
        contract,
        isLoading: false,
        error: null,
        networkId,
        balance: web3Instance.utils.fromWei(balance, 'ether'),
        userPosts: [],
      });

      // Load user posts if connected
      if (walletAddress) {
        loadUserPosts(contract, walletAddress);
      }
    } catch (error) {
      console.error('Error initializing web3:', error);
      setState(prev => ({
        ...initialState,
        isLoading: false,
        error: error.message,
      }));
    }
  }, [contractAddress, connected, walletAddress, walletType]);

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

  // Publish free content
  const publishFreeContent = useCallback(async (content) => {
    if (!state.contract || !walletAddress) return null;
    
    try {
      const result = await state.contract.methods
        .publishFreeContent(content)
        .send({ from: walletAddress });
      
      // Reload user posts after publishing
      await loadUserPosts(state.contract, walletAddress);
      
      return result;
    } catch (error) {
      console.error('Error publishing free content:', error);
      throw error;
    }
  }, [state.contract, walletAddress]);

  // Publish paid content
  const publishPaidContent = useCallback(async (content, price) => {
    if (!state.contract || !walletAddress) return null;
    
    try {
      const priceInWei = state.web3.utils.toWei(price.toString(), 'ether');
      const result = await state.contract.methods
        .publishPaidContent(content, priceInWei)
        .send({ from: walletAddress });
      
      // Reload user posts after publishing
      await loadUserPosts(state.contract, walletAddress);
      
      return result;
    } catch (error) {
      console.error('Error publishing paid content:', error);
      throw error;
    }
  }, [state.contract, walletAddress, state.web3]);

  // Access content
  const accessContent = useCallback(async (postId) => {
    if (!state.contract || !walletAddress) return null;
    
    try {
      const postInfo = await state.contract.methods.getPostInfo(postId).call();
      
      // If content is free or user is the author, use viewContent
      if (postInfo.contentType === '0' || postInfo.author.toLowerCase() === walletAddress.toLowerCase()) {
        return await state.contract.methods.viewContent(postId).call({ from: walletAddress });
      } else {
        // For paid content, call accessContent which handles payment
        return await state.contract.methods.accessContent(postId).send({ from: walletAddress });
      }
    } catch (error) {
      console.error('Error accessing content:', error);
      throw error;
    }
  }, [state.contract, walletAddress]);

  // Withdraw creator balance
  const withdrawCreatorBalance = useCallback(async () => {
    if (!state.contract || !walletAddress) return null;
    
    try {
      return await state.contract.methods
        .withdrawCreatorBalance()
        .send({ from: walletAddress });
    } catch (error) {
      console.error('Error withdrawing creator balance:', error);
      throw error;
    }
  }, [state.contract, walletAddress]);

  // Re-initialize web3 when wallet connection changes
  useEffect(() => {
    if (connected && walletAddress) {
      initWeb3();
    } else {
      // Reset state when wallet disconnects
      setState({
        ...initialState,
        isLoading: false,
        error: 'Wallet not connected'
      });
    }
  }, [connected, walletAddress, walletType, initWeb3]);

  // Listen for chain changes
  useEffect(() => {
    const handleChainChanged = () => window.location.reload();
    
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Context value - removed wallet connection functions
  const contextValue = {
    ...state,
    publishFreeContent,
    publishPaidContent,
    accessContent,
    withdrawCreatorBalance,
    refreshUserPosts: () => walletAddress ? loadUserPosts(state.contract, walletAddress) : null,
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