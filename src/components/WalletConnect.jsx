import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onConnect }) => {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  // The Base chain IDs
  const BASE_CHAIN_ID = 8453;
  const BASE_TESTNET_CHAIN_ID = 84531;

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Set up event listeners for wallet changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Check existing connection
  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          
          const network = await provider.getNetwork();
          setChainId(network.chainId);
          
          if (onConnect) {
            onConnect(accounts[0]);
          }
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount('');
      setError('Please connect to MetaMask.');
    } else {
      setAccount(accounts[0]);
      setError('');
      if (onConnect) {
        onConnect(accounts[0]);
      }
    }
  };

  // Handle chain changes
  const handleChainChanged = (chainId) => {
    // MetaMask recommends reloading the page on chain changes
    window.location.reload();
  };

  // Connect to wallet
  const connectWallet = async () => {
    setConnecting(true);
    setError('');

    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const network = await provider.getNetwork();
        setChainId(network.chainId);

        // Check if we're on Base or Base Testnet
        if (network.chainId !== BASE_CHAIN_ID && network.chainId !== BASE_TESTNET_CHAIN_ID) {
          setError('Please connect to Base or Base Testnet network');
        } else {
          handleAccountsChanged(accounts);
        }
      } catch (err) {
        if (err.code === 4001) {
          setError('Please connect to MetaMask.');
        } else {
          setError('Error connecting to wallet.');
          console.error(err);
        }
      }
    } else {
      setError('Please install MetaMask!');
    }

    setConnecting(false);
  };

  // Switch to Base network
  const switchToBase = async (testnet = false) => {
    if (!window.ethereum) return;

    const targetChainId = testnet ? BASE_TESTNET_CHAIN_ID : BASE_CHAIN_ID;
    const chainIdHex = '0x' + targetChainId.toString(16);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError) {
      // This error code means the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: testnet ? 'Base Goerli Testnet' : 'Base Mainnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [testnet ? 'https://goerli.base.org' : 'https://mainnet.base.org'],
                blockExplorerUrls: [testnet ? 'https://goerli.basescan.org' : 'https://basescan.org'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Base network:', addError);
        }
      }
      console.error('Error switching to Base network:', switchError);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="wallet-connect p-4 border border-gray-700 rounded-md">
      {!account ? (
        <div className="flex flex-col space-y-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            onClick={connectWallet}
            disabled={connecting}
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">Connected:</span>
            <span className="text-green-500">{formatAddress(account)}</span>
          </div>
          
          {chainId && chainId !== BASE_CHAIN_ID && chainId !== BASE_TESTNET_CHAIN_ID && (
            <div className="flex flex-col space-y-2">
              <div className="text-yellow-500">Please switch to Base network</div>
              <div className="flex space-x-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                  onClick={() => switchToBase(false)}
                >
                  Switch to Base
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm"
                  onClick={() => switchToBase(true)}
                >
                  Switch to Base Testnet
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
