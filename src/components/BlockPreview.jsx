import React from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';

const CELL_SIZE = 20;

const BlockPreview = ({ nextBlock }) => {
  if (!nextBlock) {
    return (
      <div className="block-preview">
        <h3 className="text-lg font-medium mb-2">Next Block</h3>
        <div className="h-24 w-24 border border-gray-700 rounded-md flex items-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  const { shape, color } = nextBlock;
  
  // Calculate dimensions needed for preview
  const width = shape[0].length * CELL_SIZE;
  const height = shape.length * CELL_SIZE;
  
  // Calculate preview box size (with some padding)
  const previewSize = Math.max(width, height) + CELL_SIZE * 2;
  
  // Calculate offset to center the block
  const offsetX = (previewSize - width) / 2;
  const offsetY = (previewSize - height) / 2;

  const renderBlock = () => {
    const blocks = [];
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          blocks.push(
            <Rect
              key={`next-${x}-${y}`}
              x={offsetX + x * CELL_SIZE}
              y={offsetY + y * CELL_SIZE}
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
    <div className="block-preview">
      <h3 className="text-lg font-medium mb-2">Next Block</h3>
      <Stage
        width={previewSize}
        height={previewSize}
        className="border border-gray-700 rounded-md bg-gray-900"
      >
        <Layer>
          <Group>{renderBlock()}</Group>
        </Layer>
      </Stage>
      {nextBlock.rarity && nextBlock.rarity !== 'common' && (
        <div className="mt-1 text-sm">
          <span className={`${nextBlock.rarity === 'legendary' ? 'text-yellow-500' : 'text-blue-400'} font-medium`}>
            {nextBlock.rarity.charAt(0).toUpperCase() + nextBlock.rarity.slice(1)}
          </span>
          {nextBlock.special && (
            <span className="text-gray-400 ml-1">
              ({nextBlock.special})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockPreview;
