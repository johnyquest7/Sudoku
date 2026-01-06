import React from 'react';
import { BoardGrid } from '../types';
import Cell from './Cell';

interface BoardProps {
  board: BoardGrid;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, selectedCell, onCellClick }) => {
  
  const getIsRelated = (r: number, c: number) => {
    if (!selectedCell) return false;
    if (selectedCell.row === r) return true;
    if (selectedCell.col === c) return true;
    
    // Check Box
    const startRow = Math.floor(selectedCell.row / 3) * 3;
    const startCol = Math.floor(selectedCell.col / 3) * 3;
    if (r >= startRow && r < startRow + 3 && c >= startCol && c < startCol + 3) return true;

    return false;
  };

  const getIsSameValue = (r: number, c: number) => {
    if (!selectedCell) return false;
    const selectedVal = board[selectedCell.row][selectedCell.col].value;
    if (selectedVal === null) return false;
    return board[r][c].value === selectedVal;
  };

  return (
    <div className="w-full max-w-lg mx-auto aspect-square border-4 border-slate-800 rounded-lg overflow-hidden bg-slate-800 shadow-xl">
      <div className="grid grid-cols-9 grid-rows-9 h-full w-full gap-0 bg-slate-300">
        {board.map((row, rIndex) => (
          row.map((cell, cIndex) => (
            <Cell
              key={`${rIndex}-${cIndex}`}
              data={cell}
              isSelected={selectedCell?.row === rIndex && selectedCell?.col === cIndex}
              isRelated={getIsRelated(rIndex, cIndex)}
              isSameValue={getIsSameValue(rIndex, cIndex)}
              onClick={onCellClick}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default Board;
