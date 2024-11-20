import { create } from 'zustand';
import { crfService, type CRFSuggestion, type CRFForm, type CRFOptimization } from '../services/crfService';

interface CRFState {
  suggestions: CRFSuggestion[];
  selectedCRF: CRFForm | null;
  detailedCRF: CRFForm | null;
  optimizations: CRFOptimization[];
  isLoading: boolean;
  error: string | null;

  generateSuggestions: (
    protocolContent: string,
    studyPhase: string,
    therapeuticArea: string
  ) => Promise<void>;
  selectCRF: (suggestion: CRFSuggestion) => Promise<void>;
  exportToWord: (form: CRFForm) => Promise<void>;
  reset: () => void;
}

export const useCRFStore = create<CRFState>((set, get) => ({
  suggestions: [],
  selectedCRF: null,
  detailedCRF: null,
  optimizations: [],
  isLoading: false,
  error: null,

  generateSuggestions: async (protocolContent, studyPhase, therapeuticArea) => {
    set({ isLoading: true, error: null });
    try {
      const suggestions = await crfService.generateCRFSuggestions(
        protocolContent,
        studyPhase,
        therapeuticArea
      );
      set({ suggestions, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error generating CRF suggestions',
        isLoading: false 
      });
    }
  },

  selectCRF: async (suggestion) => {
    set({ isLoading: true, error: null });
    try {
      const detailedCRF = await crfService.generateDetailedCRF(suggestion);
      set({ 
        selectedCRF: suggestion,
        detailedCRF,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error generating detailed CRF',
        isLoading: false 
      });
    }
  },

  exportToWord: async (form) => {
    set({ isLoading: true, error: null });
    try {
      await crfService.exportToWord(form);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error exporting CRF to Word',
        isLoading: false 
      });
    }
  },

  reset: () => set({
    suggestions: [],
    selectedCRF: null,
    detailedCRF: null,
    optimizations: [],
    isLoading: false,
    error: null
  })
}));