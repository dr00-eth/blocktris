import React from 'react';

const ScoreBoard = ({ score, linesCleared, gameOver }) => {
  // Calculate level based on lines cleared
  const level = Math.floor(linesCleared / 10) + 1;
  
  return (
    <div className="score-board p-4 border border-gray-700 rounded-md bg-gray-800">
      <h3 className="text-xl font-bold mb-4 text-center">Stats</h3>
      
      <div className="stats grid grid-cols-2 gap-y-4">
        <div className="stat">
          <div className="text-gray-400 text-sm">Score</div>
          <div className="text-2xl font-bold text-white">{score}</div>
        </div>
        
        <div className="stat">
          <div className="text-gray-400 text-sm">Level</div>
          <div className="text-2xl font-bold text-white">{level}</div>
        </div>
        
        <div className="stat">
          <div className="text-gray-400 text-sm">Lines</div>
          <div className="text-2xl font-bold text-white">{linesCleared}</div>
        </div>
        
        <div className="stat">
          <div className="text-gray-400 text-sm">Status</div>
          <div className={`text-lg font-bold ${gameOver ? 'text-red-500' : 'text-green-500'}`}>
            {gameOver ? 'Game Over' : 'Active'}
          </div>
        </div>
      </div>
      
      {gameOver && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="font-medium text-center text-yellow-500">Game Completed!</h4>
          <div className="text-center text-sm text-gray-400 mt-1">
            Finalize your game to mint as an NFT
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
