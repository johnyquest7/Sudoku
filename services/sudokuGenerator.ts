import { Difficulty, BoardGrid, CellData } from '../types';

// Constants
const GRID_SIZE = 9;

export const BLANK = 0;

// Helper to check if a number can be placed at board[row][col]
const isValidPlacement = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check Row
  for (let x = 0; x < GRID_SIZE; x++) {
    if (board[row][x] === num) return false;
  }

  // Check Col
  for (let x = 0; x < GRID_SIZE; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 Box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Backtracking solver
const solveSudoku = (board: number[][]): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === BLANK) {
        // Try numbers 1-9
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // Shuffle for randomness if needed, though usually standard fill is fine for generation base
        shuffleArray(nums);
        
        for (const num of nums) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const shuffleArray = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const fillDiagonal = (board: number[][]) => {
  for (let i = 0; i < GRID_SIZE; i += 3) {
    fillBox(board, i, i);
  }
};

const fillBox = (board: number[][], row: number, col: number) => {
  let num: number;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9) + 1;
      } while (!isSafeInBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
};

const isSafeInBox = (board: number[][], rowStart: number, colStart: number, num: number) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[rowStart + i][colStart + j] === num) return false;
    }
  }
  return true;
};

const removeDigits = (board: number[][], count: number) => {
  let attempts = count;
  while (attempts > 0) {
    let i = Math.floor(Math.random() * GRID_SIZE);
    let j = Math.floor(Math.random() * GRID_SIZE);
    if (board[i][j] !== BLANK) {
      // Logic could be added here to ensure unique solution, 
      // but for a lightweight web app, standard removal is usually sufficient.
      // A strict unique solver check can be expensive.
      board[i][j] = BLANK;
      attempts--;
    }
  }
};

export const generateSudoku = (difficulty: Difficulty): BoardGrid => {
  // 1. Create Empty Board
  const rawBoard = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(BLANK));

  // 2. Fill Diagonals (independent)
  fillDiagonal(rawBoard);

  // 3. Solve the rest
  solveSudoku(rawBoard);

  // 4. Create a full solution copy (for validation later if needed, but we mostly just need the puzzle)
  // We can just proceed to remove digits from this solved state.

  // 5. Remove Digits based on difficulty
  let attempts = 30; // default
  switch (difficulty) {
    case Difficulty.EASY:
      attempts = 35; // Remove ~35 cells (Leaves ~46)
      break;
    case Difficulty.MEDIUM:
      attempts = 45; // Remove ~45 cells (Leaves ~36)
      break;
    case Difficulty.HARD:
      attempts = 54; // Remove ~54 cells (Leaves ~27)
      break;
  }
  
  removeDigits(rawBoard, attempts);

  // 6. Convert to BoardGrid format
  const grid: BoardGrid = rawBoard.map((row, rIndex) => 
    row.map((val, cIndex) => ({
      row: rIndex,
      col: cIndex,
      value: val === 0 ? null : val,
      isInitial: val !== 0,
      notes: [],
      isError: false
    }))
  );

  return grid;
};

// Check if the current board state has any conflicts
export const checkConflicts = (grid: BoardGrid): BoardGrid => {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell, isError: false })));

  // We only check rows, cols, and boxes for duplicate non-null values
  
  // Rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number[]>(); // value -> col indices
    for (let c = 0; c < 9; c++) {
      const val = newGrid[r][c].value;
      if (val) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)?.push(c);
      }
    }
    seen.forEach((cols, val) => {
      if (cols.length > 1) {
        cols.forEach(c => newGrid[r][c].isError = true);
      }
    });
  }

  // Cols
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number[]>(); // value -> row indices
    for (let r = 0; r < 9; r++) {
      const val = newGrid[r][c].value;
      if (val) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)?.push(r);
      }
    }
    seen.forEach((rows, val) => {
      if (rows.length > 1) {
        rows.forEach(r => newGrid[r][c].isError = true);
      }
    });
  }

  // Boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Map<number, {r: number, c: number}[]>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = boxRow * 3 + i;
          const c = boxCol * 3 + j;
          const val = newGrid[r][c].value;
          if (val) {
            if (!seen.has(val)) seen.set(val, []);
            seen.get(val)?.push({r, c});
          }
        }
      }
      seen.forEach((coords, val) => {
        if (coords.length > 1) {
          coords.forEach(coord => newGrid[coord.r][coord.c].isError = true);
        }
      });
    }
  }

  return newGrid;
};

export const isBoardComplete = (grid: BoardGrid): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!grid[r][c].value || grid[r][c].isError) return false;
    }
  }
  return true;
};
