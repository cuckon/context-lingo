import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface InputAreaProps {
  input: string;
  setInput: (val: string) => void;
  onTranslate: () => void;
  isTranslating: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ input, setInput, onTranslate, isTranslating }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative">
        <textarea
          className="w-full h-48 p-6 rounded-2xl border border-slate-200 shadow-sm text-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 bg-white"
          placeholder="Paste an English paragraph here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTranslating}
        />
        <div className="absolute bottom-4 right-4">
          <button
            onClick={onTranslate}
            disabled={!input.trim() || isTranslating}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-medium text-white shadow-lg transition-all transform active:scale-95
              ${!input.trim() || isTranslating 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'
              }`}
          >
            {isTranslating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Start Learning</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-slate-400">
        Powered by Gemini 2.5 • Context-Aware Translation
      </p>
    </div>
  );
};
