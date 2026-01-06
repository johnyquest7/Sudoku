import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BoardGrid, Difficulty, AIHintResponse, CellData } from './types';
import { generateSudoku, checkConflicts, isBoardComplete } from './services/sudokuGenerator';
import { getAIHint } from './services/geminiService';
import Board from './components/Board';
import Controls from './components/Controls';
import Header from './components/Header';
import AIHintModal from './components/AIHintModal';

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [board, setBoard] = useState<BoardGrid>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [history, setHistory] = useState<BoardGrid[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  
  // AI State
  const [hintLoading, setHintLoading] = useState(false);
  const [hintData, setHintData] = useState<AIHintResponse | null>(null);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);

  const timerRef = useRef<number | null>(null);

  const startNewGame = useCallback((diff: Difficulty) => {
    const newBoard = generateSudoku(diff);
    setBoard(newBoard);
    setHistory([]);
    setMistakes(0);
    setTimer(0);
    setIsGameOver(false);
    setIsWon(false);
    setSelectedCell(null);
    setIsNotesMode(false);
  }, []);

  // Initial load
  useEffect(() => {
    startNewGame(difficulty);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer logic
  useEffect(() => {
    if (!isGameOver && !isWon) {
      timerRef.current = window.setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, isWon]);

  // Handle Difficulty Change
  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    startNewGame(diff);
  };

  const handleCellClick = (row: number, col: number) => {
    if (isGameOver || isWon) return;
    setSelectedCell({ row, col });
  };

  const updateBoardWithHistory = (newBoard: BoardGrid) => {
    setHistory(prev => [...prev.slice(-10), board]); // Keep last 10 moves
    setBoard(newBoard);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isGameOver || isWon) return;
    const { row, col } = selectedCell;
    const cell = board[row][col];

    if (cell.isInitial) return;

    if (isNotesMode) {
      // Toggle note
      const newBoard = board.map(r => r.map(c => ({ ...c })));
      const currentNotes = newBoard[row][col].notes;
      if (currentNotes.includes(num)) {
        newBoard[row][col].notes = currentNotes.filter(n => n !== num);
      } else {
        newBoard[row][col].notes = [...currentNotes, num].sort();
      }
      updateBoardWithHistory(newBoard);
    } else {
      // Set Value
      if (cell.value === num) return; // No change

      const newBoard = board.map(r => r.map(c => ({ ...c })));
      newBoard[row][col].value = num;
      newBoard[row][col].notes = []; // Clear notes if value set
      
      // Validate immediate conflicts
      const checkedBoard = checkConflicts(newBoard);
      
      if (checkedBoard[row][col].isError) {
        setMistakes(m => {
            const newM = m + 1;
            if (newM >= 3) {
                 setIsGameOver(true);
            }
            return newM;
        });
      }

      updateBoardWithHistory(checkedBoard);

      if (isBoardComplete(checkedBoard)) {
        setIsWon(true);
      }
    }
  };

  const handleErase = () => {
    if (!selectedCell || isGameOver || isWon) return;
    const { row, col } = selectedCell;
    if (board[row][col].isInitial) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].value = null;
    newBoard[row][col].notes = [];
    newBoard[row][col].isError = false;
    
    // Re-check board for other error removal
    const checkedBoard = checkConflicts(newBoard);
    updateBoardWithHistory(checkedBoard);
  };

  const handleUndo = () => {
    if (history.length === 0 || isGameOver || isWon) return;
    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory(prev => prev.slice(0, -1));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || isWon) return;
      
      // Numbers
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
        return;
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
        return;
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        handleUndo();
        return;
      }

      // Navigation
      if (!selectedCell) return;
      let { row, col } = selectedCell;
      if (e.key === 'ArrowUp') row = Math.max(0, row - 1);
      if (e.key === 'ArrowDown') row = Math.min(8, row + 1);
      if (e.key === 'ArrowLeft') col = Math.max(0, col - 1);
      if (e.key === 'ArrowRight') col = Math.min(8, col + 1);
      setSelectedCell({ row, col });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, selectedCell, isNotesMode, isGameOver, isWon]); // Dependencies for closure

  const handleAIHint = async () => {
    if (hintLoading || isGameOver || isWon) return;
    setHintLoading(true);
    
    const hint = await getAIHint(board);
    setHintLoading(false);
    
    if (hint) {
      setHintData(hint);
      setIsHintModalOpen(true);
    } else {
        alert("Could not generate a hint at this time. Please check your API key configuration.");
    }
  };

  const applyHint = () => {
    if (!hintData) return;
    const { row, col, value } = hintData;
    
    // Select the cell
    setSelectedCell({ row, col });
    
    // Apply value logic
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].value = value;
    newBoard[row][col].notes = [];
    const checkedBoard = checkConflicts(newBoard);
    updateBoardWithHistory(checkedBoard);
    
    if (isBoardComplete(checkedBoard)) {
        setIsWon(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 flex flex-col items-center">
      <Header
        difficulty={difficulty}
        setDifficulty={handleDifficultyChange}
        timer={timer}
        mistakes={mistakes}
        onNewGame={() => startNewGame(difficulty)}
      />

      <div className="relative w-full max-w-lg">
        <Board
          board={board}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />
        
        {/* Game Over / Won Overlays */}
        {isGameOver && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 animate-in fade-in duration-300">
                <h2 className="text-4xl font-bold text-red-600 mb-2">Game Over</h2>
                <p className="text-slate-600 mb-6">Too many mistakes!</p>
                <button onClick={() => startNewGame(difficulty)} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition">Try Again</button>
            </div>
        )}
         {isWon && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10 animate-in fade-in duration-300">
                <h2 className="text-4xl font-bold text-green-600 mb-2">You Won!</h2>
                <p className="text-slate-600 mb-6">Time: {Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}</p>
                <button onClick={() => startNewGame(difficulty)} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-700 transition">New Game</button>
            </div>
        )}
      </div>

      <Controls
        onNumberClick={handleNumberInput}
        onErase={handleErase}
        onUndo={handleUndo}
        onNoteToggle={() => setIsNotesMode(!isNotesMode)}
        onHint={handleAIHint}
        isNotesMode={isNotesMode}
        canUndo={history.length > 0}
        hintLoading={hintLoading}
      />

      <AIHintModal 
        hint={hintData}
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        onApply={applyHint}
      />
      
      <div className="mt-8 text-center text-slate-400 text-xs max-w-md">
        <p>Use arrow keys to navigate. Select a cell and press a number. Use 'Notes' mode to track candidates. Ask the Gemini AI Coach for help if you get stuck.</p>
      </div>
    </div>
  );
}

export default App;
