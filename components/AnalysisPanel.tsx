import React from 'react';
import { AnalysisResult } from '../types';
import { BookOpen, MessageCircle, Lightbulb, Search } from 'lucide-react';

interface AnalysisPanelProps {
  word: string | null;
  isLoading: boolean;
  result: AnalysisResult | null;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ word, isLoading, result }) => {
  if (!word) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center border-l border-slate-100">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Search size={32} className="text-slate-300" />
        </div>
        <p className="text-lg font-medium">Click a word to analyze</p>
        <p className="text-sm mt-2">See detailed context, phrase detection, and sentence breakdown.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 border-l border-slate-100">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Analyzing "{word}"...</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="h-full overflow-y-auto bg-white border-l border-slate-100 shadow-xl shadow-slate-200/50 z-20 flex flex-col">
      <div className="bg-indigo-600 p-6 text-white shrink-0">
        <h2 className="text-3xl font-bold font-serif capitalize tracking-tight">{word}</h2>
        <div className="mt-2 text-indigo-100 text-lg border-l-2 border-indigo-400 pl-3 italic">
           {result.wordInContext}
        </div>
      </div>

      <div className="p-6 space-y-8 grow">
        
        {/* Phrase Detection Section */}
        {result.phraseDetected && (
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
            <div className="flex items-center space-x-2 text-amber-700 mb-3">
              <BookOpen size={20} />
              <h3 className="font-semibold uppercase tracking-wider text-xs">Phrase Detected</h3>
            </div>
            <p className="text-lg font-bold text-slate-800 mb-1">{result.phraseDetected}</p>
            <p className="text-slate-600 leading-relaxed">{result.phraseExplanation}</p>
          </div>
        )}

        {/* Nuance Section */}
        <div>
           <div className="flex items-center space-x-2 text-indigo-600 mb-3">
            <Lightbulb size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Context & Nuance</h3>
          </div>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
            {result.nuance}
          </p>
        </div>

        {/* Sentence Translation Section */}
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 mb-3">
            <MessageCircle size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Full Sentence</h3>
          </div>
          <div className="space-y-3">
             <p className="text-slate-500 text-sm italic border-l-2 border-slate-300 pl-3">
                "{result.sentence}"
             </p>
             <p className="text-slate-800 font-medium text-lg">
                {result.sentenceTranslation}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
