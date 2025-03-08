import React, { useEffect, useState } from 'react';

const GameControls = ({ onInput, gameOver }) => {
  const [touchControls, setTouchControls] = useState(false);

  // Handle keyboard controls
  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          onInput('left');
          e.preventDefault();
          break;
        case 'ArrowRight':
          onInput('right');
          e.preventDefault();
          break;
        case 'ArrowDown':
          onInput('down');
          e.preventDefault();
          break;
        case 'ArrowUp':
          onInput('rotateClockwise');
          e.preventDefault();
          break;
        case 'z':
        case 'Z':
          onInput('rotateCounterClockwise');
          e.preventDefault();
          break;
        case ' ':
          onInput('hardDrop');
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setTouchControls(isMobile);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onInput, gameOver]);

  return (
    <div className="game-controls mt-4">
      {touchControls && (
        <div className="touch-controls grid grid-cols-3 gap-2 mx-auto max-w-xs">
          <button
            className="btn col-start-1 row-start-2 bg-gray-700 p-4 rounded-lg"
            onClick={() => onInput('left')}
            disabled={gameOver}
          >
            ←
          </button>
          <button
            className="btn col-start-3 row-start-2 bg-gray-700 p-4 rounded-lg"
            onClick={() => onInput('right')}
            disabled={gameOver}
          >
            →
          </button>
          <button
            className="btn col-start-2 row-start-1 bg-gray-700 p-4 rounded-lg"
            onClick={() => onInput('rotateClockwise')}
            disabled={gameOver}
          >
            ↻
          </button>
          <button
            className="btn col-start-2 row-start-2 bg-gray-700 p-4 rounded-lg"
            onClick={() => onInput('down')}
            disabled={gameOver}
          >
            ↓
          </button>
          <button
            className="btn col-start-2 row-start-3 bg-blue-600 p-4 rounded-lg"
            onClick={() => onInput('hardDrop')}
            disabled={gameOver}
          >
            ⤓
          </button>
        </div>
      )}
      <div className="keyboard-instructions mt-4 text-gray-400 text-sm">
        <h3 className="font-bold">Controls:</h3>
        <ul className="list-disc list-inside">
          <li>Arrow keys: Move block</li>
          <li>Up Arrow / Z: Rotate</li>
          <li>Space: Hard drop</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls;
