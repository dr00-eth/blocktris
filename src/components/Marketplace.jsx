import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Marketplace = ({ contract, address }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // Load owned games when contract and address are available
    if (contract && address) {
      loadOwnedGames();
    }
  }, [contract, address]);
  
  const loadOwnedGames = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get balance (number of NFTs owned)
      const balance = await contract.balanceOf(address);
      const balanceNumber = balance.toNumber();
      
      const gamePromises = [];
      
      // Load each game
      for (let i = 0; i < balanceNumber; i++) {
        const gamePromise = async () => {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const gameInfo = await contract.getGameInfo(tokenId);
          
          return {
            id: tokenId.toString(),
            player: gameInfo.player,
            startTime: new Date(gameInfo.startTime.toNumber() * 1000),
            endTime: new Date(gameInfo.endTime.toNumber() * 1000),
            score: gameInfo.finalScore.toNumber(),
            finalized: gameInfo.finalized
          };
        };
        
        gamePromises.push(gamePromise());
      }
      
      const loadedGames = await Promise.all(gamePromises);
      setGames(loadedGames);
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Failed to load games. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="marketplace mt-8">
      <h2 className="text-2xl font-bold mb-6">Your BlockTris Collection</h2>
      
      {loading ? (
        <div className="loading-spinner text-center py-8">
          <svg className="animate-spin h-8 w-8 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="mt-3 text-gray-400">Loading your collection...</div>
        </div>
      ) : error ? (
        <div className="error-message p-4 border border-red-700 bg-red-900/20 rounded-md text-red-400">
          {error}
        </div>
      ) : games.length === 0 ? (
        <div className="empty-collection p-8 text-center border border-gray-700 rounded-md">
          <div className="text-xl font-medium text-gray-400">No games found</div>
          <p className="mt-2 text-gray-500">
            Play a game of BlockTris and finalize it to start your collection!
          </p>
        </div>
      ) : (
        <div className="games-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <div key={game.id} className="game-card border border-gray-700 rounded-md overflow-hidden">
              {/* Game preview - this would be a visual representation of the game board */}
              <div className="game-preview h-48 bg-gray-800 flex items-center justify-center">
                <div className="text-lg">Game #{game.id}</div>
              </div>
              
              <div className="game-details p-4">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-400">Score</div>
                  <div className="text-right font-bold">{game.score}</div>
                  
                  <div className="text-gray-400">Date</div>
                  <div className="text-right">{game.endTime.toLocaleDateString()}</div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded text-sm">
                    View Details
                  </button>
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded text-sm">
                    List for Sale
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
