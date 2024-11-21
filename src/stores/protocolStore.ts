import { create } from 'zustand';
import { AIAnalysisResult } from '../services/ai';
import { aiService } from '../services/ai';

interface StudyDetails {
  title?: string;
  phase?: string;
  sponsor?: string;
  indication?: string;
  population?: string;
}

interface ProtocolState {
  currentStep: number;
  protocolFile: File | null;
  protocolContent: string | null;
  studyDetails: StudyDetails;
  analysisResults: AIAnalysisResult | null;
  selectedSuggestions: string[];
  isAnalyzing: boolean;
  error: string | null;
  setCurrentStep: (step: number) => void;
  setProtocolFile: (file: File | null) => void;
  setProtocolContent: (content: string | null) => void;
  setStudyDetails: (details: StudyDetails) => void;
  setAnalysisResults: (results: AIAnalysisResult | null) => void;
  setSelectedSuggestions: (suggestions: string[]) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setError: (error: string | null) => void;
  analyzeProtocol: () => Promise<void>;
  generateFinalDocuments: (selectedSuggestions: string[], includeSchedule: boolean) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  protocolFile: null,
  protocolContent: null,
  studyDetails: {},
  analysisResults: null,
  selectedSuggestions: [],
  isAnalyzing: false,
  error: null,
};

export const useProtocolStore = create<ProtocolState>()((set, get) => ({
  ...initialState,

  setCurrentStep: (step: number) => set({ currentStep: step }),
  
  setProtocolFile: (file: File | null) => set({ protocolFile: file }),
  
  setProtocolContent: (content: string | null) => set({ protocolContent: content }),
  
  setStudyDetails: (details: StudyDetails) => 
    set((state) => ({ 
      studyDetails: { ...state.studyDetails, ...details } 
    })),
  
  setAnalysisResults: (results: AIAnalysisResult | null) => 
    set({ analysisResults: results }),
  
  setSelectedSuggestions: (suggestions: string[]) => 
    set({ selectedSuggestions: suggestions }),
  
  setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),
  
  setError: (error: string | null) => set({ error: error }),

  analyzeProtocol: async () => {
    const { protocolContent, studyDetails } = get();
    if (!protocolContent) {
      set({ error: 'No protocol content to analyze' });
      return;
    }

    set({ isAnalyzing: true, error: null });

    try {
      const results = await aiService.analyzeProtocol(protocolContent, studyDetails);
      set({ 
        analysisResults: results,
        currentStep: 2,
        error: null
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error analyzing protocol' });
    } finally {
      set({ isAnalyzing: false });
    }
  },

  generateFinalDocuments: async (selectedSuggestions: string[], includeSchedule: boolean) => {
    const { protocolContent, analysisResults } = get();
    if (!protocolContent || !analysisResults) {
      set({ error: 'Missing protocol content or analysis results' });
      return;
    }

    set({ isAnalyzing: true, error: null });

    try {
      const finalDocs = await aiService.generateFinalDocuments(
        protocolContent,
        selectedSuggestions,
        includeSchedule,
        analysisResults
      );
      set({ 
        currentStep: 3,
        error: null
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error generating final documents' });
    } finally {
      set({ isAnalyzing: false });
    }
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  
  previousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  
  reset: () => set(initialState),
}));
