import React from 'react';
import { AIHintResponse } from '../types';

interface AIHintModalProps {
  hint: AIHintResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const AIHintModal: React.FC<AIHintModalProps> = ({ hint, isOpen, onClose, onApply }) => {
  if (!isOpen || !hint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                AI Coach Insight
            </h3>
        </div>
        
        <div className="p-6">
            <div className="mb-4 text-slate-600 leading-relaxed">
                <p>{hint.explanation}</p>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {hint.value}
                </div>
                <div className="text-sm text-indigo-900">
                    Suggested move at Row <strong>{hint.row + 1}</strong>, Column <strong>{hint.col + 1}</strong>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    Dismiss
                </button>
                <button
                    onClick={() => {
                        onApply();
                        onClose();
                    }}
                    className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                >
                    Apply Move
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIHintModal;
