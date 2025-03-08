import { useState, useEffect, useCallback } from 'react';
import { BlockTrisEngine } from '../engine/BlockTrisEngine';

export function useGameEngine(gameId, seed, blockSequence) {
  const [game, setGame] = useState(null);
  const [gameState, setGameState] = useState({
    board: [],
    currentBlock: null,
    nextBlock: null,
    score: 0,
    linesCleared: 0,
    gameOver: false
  });

  // Initialize game
  useEffect(() => {
    if (gameId && seed && blockSequence) {
      const newGame = new BlockTrisEngine(gameId, seed, blockSequence);
      setGame(newGame);
    }
  }, [gameId, seed, blockSequence]);

  // Update game state
  useEffect(() => {
    if (!game) return;

    const interval = setInterval(() => {
      setGameState({
        board: game.board,
        currentBlock: game.currentBlock,
        currentBlockPosition: game.currentBlockPosition,
        nextBlock: game.nextBlock,
        score: game.score,
        linesCleared: game.linesCleared,
        gameOver: game.gameOver
      });
    }, 100);

    return () => clearInterval(interval);
  }, [game]);

  // Handle user input
  const handleInput = useCallback((inputType) => {
    if (!game) return false;
    return game.handleInput(inputType);
  }, [game]);

  // Finalize game
  const finalizeGame = useCallback(async () => {
    if (!game) return null;
    return game.finalizeGame();
  }, [game]);

  return {
    gameState,
    handleInput,
    finalizeGame
  };
}
