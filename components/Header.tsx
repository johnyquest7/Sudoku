import React from 'react';
import { Difficulty } from '../types';

interface HeaderProps {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  timer: number;
  mistakes: number;
  onNewGame: () => void;
}

const Header: React.FC<HeaderProps> = ({ difficulty, setDifficulty, timer, mistakes, onNewGame }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full max-w-lg mx-auto mb-6 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">MindFlow Sudoku</h1>
        <div className="text-sm font-medium text-slate-500">
          Mistakes: <span className={`${mistakes > 2 ? 'text-red-500' : 'text-slate-800'}`}>{mistakes}/3</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm border border-slate-200">
        <div className="flex gap-1">
          {Object.values(Difficulty).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${
                difficulty === diff 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
             <div className="text-base font-mono font-medium text-slate-700">
                {formatTime(timer)}
            </div>
            <button 
                onClick={onNewGame}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide"
            >
                New Game
            </button>
        </div>
       
      </div>
    </header>
  );
};

export default Header;
