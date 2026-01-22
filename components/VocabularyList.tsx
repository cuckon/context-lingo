import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { X, Trash2, ChevronDown, ChevronUp, BookOpen, Lightbulb, MessageCircle, Calendar } from 'lucide-react';

interface VocabularyListProps {
  isOpen: boolean;
  onClose: () => void;
  items: VocabularyItem[];
  onDelete: (id: string) => void;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({ isOpen, onClose, items, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-slate-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">My Vocabulary</h2>
            <p className="text-sm text-slate-500">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={24} className="text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">No words saved yet</p>
              <p className="text-sm mt-2 max-w-[200px]">Analyze words in the text and click the bookmark icon to save them here.</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                  expandedId === item.id 
                    ? 'border-indigo-200 shadow-md ring-1 ring-indigo-500/20' 
                    : 'border-slate-200 shadow-sm hover:border-indigo-200'
                }`}
              >
                {/* Card Header (Always Visible) */}
                <div 
                  className="p-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-indigo-700 capitalize font-serif">{item.word}</h3>
                      <p className="text-sm text-slate-500 italic">{item.analysis.wordInContext}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Sentence Snippet (if not expanded) */}
                  {expandedId !== item.id && (
                    <div className="text-sm text-slate-600 line-clamp-2 leading-relaxed border-l-2 border-slate-200 pl-3 mt-2">
                      {item.analysis.sentence}
                    </div>
                  )}

                   {/* Expand Indicator */}
                   <div className="flex justify-center mt-2 text-slate-300">
                      {expandedId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                   </div>
                </div>

                {/* Expanded Details */}
                {expandedId === item.id && (
                  <div className="bg-slate-50/80 border-t border-slate-100 p-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Phrase info */}
                    {item.analysis.phraseDetected && (
                      <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <div className="flex items-center space-x-2 text-amber-700 mb-1">
                          <BookOpen size={14} />
                          <span className="text-xs font-bold uppercase tracking-wider">Phrase</span>
                        </div>
                        <p className="font-semibold text-slate-800">{item.analysis.phraseDetected}</p>
                        <p className="text-sm text-slate-600 mt-1">{item.analysis.phraseExplanation}</p>
                      </div>
                    )}

                    {/* Nuance */}
                    <div>
                      <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                        <Lightbulb size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Nuance</span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {item.analysis.nuance}
                      </p>
                    </div>

                    {/* Sentence & Translation */}
                    <div>
                      <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                        <MessageCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Context</span>
                      </div>
                      <div className="text-sm space-y-2">
                        <p className="text-slate-500 italic border-l-2 border-slate-300 pl-3">
                          "{item.analysis.sentence}"
                        </p>
                        <p className="text-slate-800 font-medium pl-3">
                          {item.analysis.sentenceTranslation}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
                       <span className="flex items-center gap-1">
                         <Calendar size={12}/>
                         Saved on {new Date(item.timestamp).toLocaleDateString()}
                       </span>
                    </div>

                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};