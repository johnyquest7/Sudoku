import React from 'react';
import { CellData } from '../types';

interface CellProps {
  data: CellData;
  isSelected: boolean;
  isRelated: boolean; // True if in same row/col/box as selected
  isSameValue: boolean; // True if has same value as selected
  onClick: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({ data, isSelected, isRelated, isSameValue, onClick }) => {
  const { row, col, value, isInitial, notes, isError } = data;

  // Border logic for 3x3 subgrids
  const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-indigo-400' : 'border-r border-slate-300';
  const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-indigo-400' : 'border-b border-slate-300';
  
  // Background logic
  let bgClass = 'bg-white';
  if (isError) bgClass = 'bg-red-100';
  else if (isSelected) bgClass = 'bg-indigo-500 text-white';
  else if (isSameValue && value !== null) bgClass = 'bg-indigo-200';
  else if (isRelated) bgClass = 'bg-slate-100';
  else if (isInitial) bgClass = 'bg-slate-50';

  // Text Color
  let textClass = 'text-slate-900';
  if (isSelected) textClass = 'text-white';
  else if (isError) textClass = 'text-red-600';
  else if (isInitial) textClass = 'text-slate-900 font-bold'; // Initial numbers are bolder
  else textClass = 'text-indigo-600 font-medium'; // User entered numbers

  return (
    <div
      onClick={() => onClick(row, col)}
      className={`
        w-full h-full aspect-square flex items-center justify-center cursor-pointer select-none relative
        text-xl sm:text-2xl transition-colors duration-75
        ${borderRight} ${borderBottom}
        ${bgClass} ${textClass}
        hover:opacity-90
      `}
    >
      {value !== null ? (
        value
      ) : (
        // Notes Grid
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full pointer-events-none p-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <div key={n} className="flex items-center justify-center text-[8px] sm:text-[10px] leading-none text-slate-500">
              {notes.includes(n) ? n : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cell;
