import { create } from 'zustand';
import { aiService } from '../services/ai';
import type { AIAnalysisResult } from '../services/ai';

interface AIState {
  analysisResults: AIAnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeProtocol: (content: string) => Promise<void>;
}

export const useAIStore = create<AIState>((set) => ({
  analysisResults: null,
  isAnalyzing: false,
  error: null,

  analyzeProtocol: async (content: string) => {
    set({ isAnalyzing: true, error: null });
    try {
      const results = await aiService.analyzeProtocol(content);
      set({ analysisResults: results, isAnalyzing: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error analyzing protocol',
        isAnalyzing: false 
      });
    }
  }
}));