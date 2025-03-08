/**
 * useWallet.js
 * Custom hook for managing wallet connection and state
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  connectWallet, 
  checkNetwork, 
  switchNetwork, 
  getProvider 
} from '../utils/blockchain';

const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [provider, setProvider] = useState(null);

  // Connect wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Connect wallet
      const connectedAddress = await connectWallet();
      setAddress(connectedAddress);
      
      // Check network
      const correctNetwork = await checkNetwork();
      setIsCorrectNetwork(correctNetwork);
      
      // Get provider
      const ethProvider = getProvider();
      setProvider(ethProvider);
      
      return connectedAddress;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Switch to correct network
  const switchToCorrectNetwork = useCallback(async () => {
    setError(null);
    
    try {
      const success = await switchNetwork();
      setIsCorrectNetwork(success);
      return success;
    } catch (err) {
      console.error('Error switching network:', err);
      setError(err.message);
      return false;
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setIsCorrectNetwork(false);
    setProvider(null);
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // Get connected accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            
            // Check network
            const correctNetwork = await checkNetwork();
            setIsCorrectNetwork(correctNetwork);
            
            // Get provider
            const ethProvider = getProvider();
            setProvider(ethProvider);
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // Disconnected
          disconnect();
        } else {
          // Account changed
          setAddress(accounts[0]);
        }
      };
      
      const handleChainChanged = async () => {
        // Check if on correct network
        const correctNetwork = await checkNetwork();
        setIsCorrectNetwork(correctNetwork);
        
        // Refresh provider
        const ethProvider = getProvider();
        setProvider(ethProvider);
      };
      
      // Subscribe to events
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Cleanup
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [disconnect]);

  return {
    address,
    isConnected: !!address,
    isConnecting,
    isCorrectNetwork,
    error,
    provider,
    connect,
    disconnect,
    switchToCorrectNetwork
  };
};

export default useWallet;
