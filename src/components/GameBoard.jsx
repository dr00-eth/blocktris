import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';

const CELL_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const GameBoard = ({ gameState }) => {
  const stageRef = useRef(null);
  const { board, currentBlock, currentBlockPosition } = gameState;
  
  // Draw the game board grid
  const renderGrid = () => {
    const grid = [];
    
    // Draw background grid
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        grid.push(
          <Rect
            key={`grid-${x}-${y}`}
            x={x * CELL_SIZE}
            y={y * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            stroke="#333"
            strokeWidth={1}
            fill="#111"
          />
        );
      }
    }
    
    return grid;
  };
  
  // Render placed blocks on the board
  const renderPlacedBlocks = () => {
    const blocks = [];
    
    if (!board || !board.length) return blocks;
    
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const cell = board[y][x];
        if (cell) {
          blocks.push(
            <Rect
              key={`block-${x}-${y}`}
              x={x * CELL_SIZE}
              y={y * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={cell.color || '#3366FF'}
              stroke="#000"
              strokeWidth={1}
            />
          );
        }
      }
    }
    
    return blocks;
  };
  
  // Render the current active block
  const renderCurrentBlock = () => {
    const blocks = [];
    
    if (!currentBlock || !currentBlockPosition) return blocks;
    
    const { shape, color } = currentBlock;
    const { x: posX, y: posY } = currentBlockPosition;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          blocks.push(
            <Rect
              key={`current-${x}-${y}`}
              x={(posX + x) * CELL_SIZE}
              y={(posY + y) * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={color || '#3366FF'}
              stroke="#000"
              strokeWidth={1}
            />
          );
        }
      }
    }
    
    return blocks;
  };
  
  return (
    <div className="game-board">
      <Stage
        ref={stageRef}
        width={BOARD_WIDTH * CELL_SIZE}
        height={BOARD_HEIGHT * CELL_SIZE}
        className="border border-gray-700 rounded-md overflow-hidden"
      >
        <Layer>
          <Group>{renderGrid()}</Group>
          <Group>{renderPlacedBlocks()}</Group>
          <Group>{renderCurrentBlock()}</Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default GameBoard;
