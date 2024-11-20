import create from 'zustand';

export interface Suggestion {
  id: string;
  type: 'improvement' | 'warning' | 'validation';
  message: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  autoFixAvailable: boolean;
  appliedAt?: Date;
}

interface AISuggestionsState {
  suggestions: Suggestion[];
  selectedSuggestions: Set<string>;
  appliedSuggestions: Set<string>;
  loading: boolean;
  error: string | null;
  
  // Actions
  setSuggestions: (suggestions: Suggestion[]) => void;
  toggleSuggestion: (id: string) => void;
  applySuggestions: (ids: string[]) => Promise<void>;
  fetchSuggestions: () => Promise<void>;
  clearSelected: () => void;
  clearError: () => void;
}

export const useAISuggestionsStore = create<AISuggestionsState>((set, get) => ({
  suggestions: [],
  selectedSuggestions: new Set(),
  appliedSuggestions: new Set(),
  loading: false,
  error: null,

  setSuggestions: (suggestions) => set({ suggestions }),

  toggleSuggestion: (id) => {
    const { selectedSuggestions } = get();
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    set({ selectedSuggestions: newSelected });
  },

  applySuggestions: async (ids) => {
    try {
      set({ loading: true });
      // TODO: Implement API call to apply suggestions
      const { suggestions, appliedSuggestions } = get();
      const newApplied = new Set(appliedSuggestions);
      ids.forEach(id => {
        const suggestion = suggestions.find(s => s.id === id);
        if (suggestion) {
          suggestion.appliedAt = new Date();
          newApplied.add(id);
        }
      });
      set({ 
        appliedSuggestions: newApplied,
        selectedSuggestions: new Set(),
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to apply suggestions',
        loading: false 
      });
    }
  },

  fetchSuggestions: async () => {
    try {
      set({ loading: true });
      // TODO: Implement API call to fetch suggestions
      const mockSuggestions: Suggestion[] = [
        {
          id: '1',
          type: 'improvement',
          message: 'Optimize visit schedule for patient retention',
          recommendation: 'Consider reducing the frequency of on-site visits by implementing remote monitoring for non-critical assessments.',
          impact: 'high',
          category: 'protocol',
          autoFixAvailable: true
        },
        {
          id: '2',
          type: 'warning',
          message: 'Potential data collection redundancy detected',
          recommendation: 'Remove duplicate vital signs collection from Visit 3 and consolidate with existing measurements.',
          impact: 'medium',
          category: 'forms',
          autoFixAvailable: true
        },
        {
          id: '3',
          type: 'validation',
          message: 'Missing key safety assessments',
          recommendation: 'Add standardized adverse event reporting forms to all follow-up visits.',
          impact: 'high',
          category: 'validation',
          autoFixAvailable: false
        }
      ];
      
      set({ suggestions: mockSuggestions, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch suggestions',
        loading: false 
      });
    }
  },

  clearSelected: () => set({ selectedSuggestions: new Set() }),
  clearError: () => set({ error: null })
}));
