import React, { useMemo } from 'react';
import { WordToken } from '../types';

interface InteractiveTextProps {
  text: string;
  onWordClick: (word: string) => void;
  selectedWord: string | null;
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({ text, onWordClick, selectedWord }) => {
  
  const tokens: WordToken[] = useMemo(() => {
    // Regex matches sequences of alphanumeric characters + apostrophes (for words like "They've")
    // The capturing group () keeps the separators in the result array
    const parts = text.split(/([a-zA-Z0-9'’-]+)/);
    
    return parts.map((part, index) => {
      // Basic check if it's a word (has letters/numbers)
      const isWord = /[a-zA-Z0-9]/.test(part);
      return {
        text: part,
        isWord: isWord,
        id: `token-${index}-${part}`
      };
    });
  }, [text]);

  return (
    <div className="font-serif text-xl leading-relaxed text-slate-800 break-words whitespace-pre-wrap">
      {tokens.map((token) => {
        if (!token.isWord) {
          return <span key={token.id}>{token.text}</span>;
        }

        const isSelected = selectedWord === token.text;

        return (
          <span
            key={token.id}
            onClick={() => onWordClick(token.text)}
            className={`
              cursor-pointer rounded px-0.5 py-0.5 transition-colors duration-200 border-b-2 
              ${isSelected 
                ? 'bg-indigo-100 border-indigo-500 text-indigo-900 font-medium' 
                : 'border-transparent hover:bg-indigo-50 hover:border-indigo-200'
              }
            `}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};
