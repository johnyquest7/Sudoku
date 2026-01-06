export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface CellData {
  row: number;
  col: number;
  value: number | null;
  isInitial: boolean; // True if part of the original puzzle
  notes: number[];   // User pencil marks
  isError: boolean;  // True if conflicts with row/col/box
}

export type BoardGrid = CellData[][];

export interface GameState {
  board: BoardGrid;
  difficulty: Difficulty;
  selectedCell: { row: number; col: number } | null;
  mistakes: number;
  timer: number; // in seconds
  isGameOver: boolean;
  isWon: boolean;
  history: BoardGrid[]; // For undo functionality
  isNotesMode: boolean;
}

export interface AIHintResponse {
  row: number;
  col: number;
  value: number;
  explanation: string;
}
