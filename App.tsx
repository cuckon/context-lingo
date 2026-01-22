import React, { useState, useEffect } from 'react';
import { InputArea } from './components/InputArea';
import { InteractiveText } from './components/InteractiveText';
import { AnalysisPanel } from './components/AnalysisPanel';
import { VocabularyList } from './components/VocabularyList';
import { translateParagraph, analyzeWordInContext } from './services/gemini';
import { AppStatus, AnalysisResult, VocabularyItem } from './types';
import { Book, RefreshCw, X, Library } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [status, setStatus] = useState<AppStatus>('idle');
  
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisMobile, setShowAnalysisMobile] = useState(false);

  // Vocabulary State
  const [savedItems, setSavedItems] = useState<VocabularyItem[]>(() => {
    const saved = localStorage.getItem('vocabulary');
    return saved ? JSON.parse(saved) : [];
  });
  const [showVocabulary, setShowVocabulary] = useState(false);

  useEffect(() => {
    localStorage.setItem('vocabulary', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setStatus('translating');
    // Clear previous results
    setTranslatedText("");
    setSelectedWord(null);
    setAnalysisResult(null);
    setShowAnalysisMobile(false);

    try {
      const translation = await translateParagraph(input);
      setTranslatedText(translation);
      setStatus('translated');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleWordClick = async (word: string) => {
    const cleanWord = word.replace(/[^a-zA-Z0-9'’-]/g, '');
    if (!cleanWord) return;

    setSelectedWord(word); 
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setShowAnalysisMobile(true); 

    try {
      // Check if we already analyzed this word in this session to avoid re-fetching?
      // For now, always fetch to ensure context is correct if they click around.
      const result = await analyzeWordInContext(input, cleanWord);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveVocabulary = () => {
    if (!selectedWord || !analysisResult) return;

    // Check if already saved (simple check by word + specific sentence context to allow duplicate words in diff contexts)
    const alreadySaved = savedItems.some(item => 
      item.word === selectedWord && item.analysis.sentence === analysisResult.sentence
    );

    if (alreadySaved) {
       // Optional: Toggle off / remove? For now let's just allow removing via list.
       // Or we can just return if already saved.
       return;
    }

    const newItem: VocabularyItem = {
      id: Date.now().toString(),
      word: selectedWord,
      analysis: analysisResult,
      timestamp: Date.now()
    };

    setSavedItems(prev => [newItem, ...prev]);
  };

  const handleDeleteVocabulary = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const resetApp = () => {
    setStatus('idle');
    setInput("");
    setTranslatedText("");
    setSelectedWord(null);
    setAnalysisResult(null);
  };

  const isCurrentWordSaved = analysisResult ? savedItems.some(item => 
    item.word === selectedWord && item.analysis.sentence === analysisResult.sentence
  ) : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-600 cursor-pointer" onClick={() => setStatus('idle')}>
            <Book className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">ContextLingo</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowVocabulary(true)}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center space-x-1.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Library size={18} />
              <span>My Vocabulary</span>
              {savedItems.length > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {savedItems.length}
                </span>
              )}
            </button>

            {status !== 'idle' && (
              <button 
                onClick={resetApp}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RefreshCw size={14} />
                <span>New Text</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {status === 'idle' || status === 'translating' ? (
          <div className="flex-grow flex items-center justify-center">
             <div className="w-full">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
                    Master English in <span className="text-indigo-600">Context</span>
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Paste a paragraph to get a fluent translation. Click any word to understand its nuance, detect idioms, and see sentence-level breakdowns.
                  </p>
                </div>
                <InputArea 
                  input={input} 
                  setInput={setInput} 
                  onTranslate={handleTranslate} 
                  isTranslating={status === 'translating'} 
                />
             </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 relative flex-grow min-h-0">
            
            {/* Left Column: Text & Translation */}
            <div className="lg:w-7/12 flex flex-col gap-6 overflow-y-auto pb-32 lg:pb-0">
              
              {/* Original Text Card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                 <div className="mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Original Text</div>
                 <InteractiveText 
                    text={input} 
                    onWordClick={handleWordClick}
                    selectedWord={selectedWord}
                 />
                 <div className="mt-4 text-sm text-slate-400 flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    <span>Click any word to analyze context</span>
                 </div>
              </div>

              {/* Translation Card */}
              <div className="bg-slate-100/50 rounded-2xl p-6 md:p-8 border border-slate-200/50">
                <div className="mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fluent Translation</div>
                <div className="text-lg leading-relaxed text-slate-700 font-medium">
                  {translatedText}
                </div>
              </div>

            </div>

            {/* Right Column: Analysis Panel (Desktop) */}
            <div className="hidden lg:block lg:w-5/12 sticky top-8 h-[calc(100vh-8rem)]">
              <div className="h-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
                 <AnalysisPanel 
                    word={selectedWord} 
                    isLoading={isAnalyzing} 
                    result={analysisResult} 
                    onSave={handleSaveVocabulary}
                    isSaved={isCurrentWordSaved}
                 />
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Mobile Analysis Drawer */}
      {showAnalysisMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto transition-opacity"
            onClick={() => setShowAnalysisMobile(false)}
          ></div>
          
          {/* Drawer */}
          <div className="bg-white w-full max-w-lg sm:rounded-2xl h-[85vh] sm:h-[80vh] shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 animate-in slide-in-from-bottom">
            <div className="flex justify-end p-2 border-b border-slate-100">
               <button onClick={() => setShowAnalysisMobile(false)} className="p-2 text-slate-400 hover:text-slate-600">
                 <X size={24} />
               </button>
            </div>
            <div className="flex-grow overflow-hidden relative">
               <AnalysisPanel 
                  word={selectedWord} 
                  isLoading={isAnalyzing} 
                  result={analysisResult}
                  onSave={handleSaveVocabulary}
                  isSaved={isCurrentWordSaved}
               />
            </div>
          </div>
        </div>
      )}

      {/* Vocabulary List Drawer */}
      <VocabularyList 
        isOpen={showVocabulary} 
        onClose={() => setShowVocabulary(false)} 
        items={savedItems}
        onDelete={handleDeleteVocabulary}
      />

    </div>
  );
};

export default App;