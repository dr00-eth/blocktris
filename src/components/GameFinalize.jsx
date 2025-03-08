import React, { useState } from 'react';
import { NFTStorage } from 'nft.storage';

const GameFinalize = ({ gameState, finalizeGame, blockTrisContract, disabled }) => {
  const [finalizing, setFinalizing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  
  // NFT Storage client
  const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_KEY || '';
  
  const handleFinalize = async () => {
    if (disabled || finalizing) return;
    
    setFinalizing(true);
    setError('');
    setSuccess(false);
    
    try {
      // Get game data and replay data
      const { gameData, replayData } = await finalizeGame();
      
      if (!gameData) {
        throw new Error('Failed to finalize game data');
      }
      
      // Store replay data on IPFS if we have an API key
      let replayCID = '';
      if (NFT_STORAGE_KEY) {
        const client = new NFTStorage({ token: NFT_STORAGE_KEY });
        const blob = new Blob([JSON.stringify(replayData)], { type: 'application/json' });
        replayCID = await client.storeBlob(blob);
        console.log('Replay data stored on IPFS:', replayCID);
      }
      
      // Submit to blockchain
      const receipt = await blockTrisContract.finalizeGame(
        gameData.gameId,
        gameData.score,
        gameData.boardState,
        gameData.hash
      );
      
      setTxHash(receipt.transactionHash);
      setSuccess(true);
      
      console.log('Game finalized successfully!', receipt);
    } catch (err) {
      console.error('Error finalizing game:', err);
      setError(err.message || 'Failed to finalize game');
    } finally {
      setFinalizing(false);
    }
  };
  
  return (
    <div className="game-finalize mt-6 p-4 border border-gray-700 rounded-md">
      <h3 className="text-xl font-bold mb-4">Finalize Game</h3>
      
      <p className="text-gray-400 mb-4">
        When you finalize your game, your board and score will be minted as an NFT on the blockchain!
      </p>
      
      <button
        className={`w-full py-2 px-4 rounded font-bold ${
          disabled
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        onClick={handleFinalize}
        disabled={disabled || finalizing}
      >
        {finalizing ? 'Finalizing...' : 'Finalize & Mint NFT'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-md text-red-400">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded-md text-green-400">
          <p>Game finalized successfully!</p>
          {txHash && (
            <p className="mt-2 text-xs">
              Transaction: <a 
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                View on BaseScan
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameFinalize;
