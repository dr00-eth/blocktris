import React, { useState, useCallback } from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import BlockPreview from './BlockPreview';
import ScoreBoard from './ScoreBoard';
import GameFinalize from './GameFinalize';
import { useGameEngine } from '../hooks/useGameEngine';

const Game = ({ gameId, seed, blockSequence, blockTrisContract }) => {
  const [gameStatus, setGameStatus] = useState('new'); // new, playing, ended
  const { gameState, handleInput, finalizeGame } = useGameEngine(gameId, seed, blockSequence);
  
  // Handle game input
  const onInput = useCallback((inputType) => {
    if (gameStatus === 'new') {
      setGameStatus('playing');
    }
    
    if (gameStatus === 'ended') {
      return;
    }
    
    const result = handleInput(inputType);
    
    // If game is over, update status
    if (gameState.gameOver) {
      setGameStatus('ended');
    }
    
    return result;
  }, [gameStatus, handleInput, gameState.gameOver]);
  
  return (
    <div className="game-container">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="game-main">
          <GameBoard gameState={gameState} />
          <GameControls onInput={onInput} gameOver={gameState.gameOver} />
        </div>
        
        <div className="game-sidebar max-w-xs w-full">
          <div className="game-info flex flex-col gap-4">
            <ScoreBoard 
              score={gameState.score} 
              linesCleared={gameState.linesCleared}
              gameOver={gameState.gameOver} 
            />
            
            <BlockPreview nextBlock={gameState.nextBlock} />
            
            <GameFinalize 
              gameState={gameState}
              finalizeGame={finalizeGame}
              blockTrisContract={blockTrisContract}
              disabled={!gameState.gameOver}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
