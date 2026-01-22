export interface AnalysisResult {
  wordInContext: string;
  phraseDetected: string | null;
  phraseExplanation: string | null;
  sentence: string;
  sentenceTranslation: string;
  nuance: string;
}

export type AppStatus = 'idle' | 'translating' | 'translated' | 'analyzing' | 'error';

export interface WordToken {
  text: string;
  isWord: boolean;
  id: string; // unique identifier for React keys
}
