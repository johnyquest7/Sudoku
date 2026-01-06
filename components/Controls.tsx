import React from 'react';

interface ControlsProps {
  onNumberClick: (num: number) => void;
  onErase: () => void;
  onUndo: () => void;
  onNoteToggle: () => void;
  onHint: () => void;
  isNotesMode: boolean;
  canUndo: boolean;
  hintLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onNumberClick,
  onErase,
  onUndo,
  onNoteToggle,
  onHint,
  isNotesMode,
  canUndo,
  hintLoading
}) => {
  return (
    <div className="flex flex-col gap-4 mt-6 max-w-lg mx-auto w-full">
      {/* Numpad */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className="aspect-[4/5] sm:aspect-square flex items-center justify-center text-xl sm:text-2xl font-semibold bg-white text-indigo-600 rounded-md shadow-sm border border-slate-200 hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          <span className="text-xs font-medium">Undo</span>
        </button>

        <button
          onClick={onErase}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
          </svg>
          <span className="text-xs font-medium">Erase</span>
        </button>

        <button
          onClick={onNoteToggle}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
            isNotesMode ? 'bg-indigo-600 text-white shadow-inner' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
          <span className="text-xs font-medium">{isNotesMode ? 'Notes ON' : 'Notes OFF'}</span>
        </button>

         <button
          onClick={onHint}
          disabled={hintLoading}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
           {hintLoading ? (
             <svg className="animate-spin h-6 w-6 mb-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
           ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
           )}
          <span className="text-xs font-medium">AI Hint</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;
