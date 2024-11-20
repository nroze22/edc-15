import { create } from 'zustand';
import { aiService } from '../services/ai';

interface StudyDetails {
  title: string;
  phase: string;
  indication: string;
  population: string;
  primaryEndpoint: string;
  secondaryEndpoints: string;
  visitSchedule: string;
  estimatedDuration: string;
}

interface ProtocolState {
  currentStep: number;
  protocolFile: File | null;
  protocolContent: string;
  studyDetails: StudyDetails;
  analysisResults: any | null;
  finalDocuments: any | null;
  crfDesigns: any[] | null;
  formBuilderState: any | null;
  simulationResults: any | null;
  isAnalyzing: boolean;
  isGenerating: boolean;
  error: string | null;

  setProtocolFile: (file: File) => void;
  setProtocolContent: (content: string) => void;
  setStudyDetails: (details: Partial<StudyDetails>) => void;
  analyzeProtocol: () => Promise<void>;
  generateFinalDocuments: (selectedSuggestions: string[], includeSchedule: boolean) => Promise<void>;
  saveCRFDesigns: (designs: any[]) => void;
  updateFormBuilderState: (state: any) => void;
  saveSimulationResults: (results: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  protocolFile: null,
  protocolContent: '',
  studyDetails: {
    title: '',
    phase: '',
    indication: '',
    population: '',
    primaryEndpoint: '',
    secondaryEndpoints: '',
    visitSchedule: '',
    estimatedDuration: ''
  },
  analysisResults: null,
  finalDocuments: null,
  crfDesigns: null,
  formBuilderState: null,
  simulationResults: null,
  isAnalyzing: false,
  isGenerating: false,
  error: null
};

export const useProtocolStore = create<ProtocolState>((set, get) => ({
  ...initialState,

  setProtocolFile: (file: File) => set({ protocolFile: file }),
  
  setProtocolContent: (content: string) => set({ protocolContent: content }),
  
  setStudyDetails: (details: Partial<StudyDetails>) => set(state => ({
    studyDetails: { ...state.studyDetails, ...details }
  })),

  analyzeProtocol: async () => {
    const { protocolContent, studyDetails } = get();
    set({ isAnalyzing: true, error: null });

    try {
      const results = await aiService.analyzeProtocol(protocolContent, studyDetails);
      set({ 
        analysisResults: results,
        isAnalyzing: false,
        currentStep: 2
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error analyzing protocol',
        isAnalyzing: false 
      });
    }
  },

  generateFinalDocuments: async (selectedSuggestions: string[], includeSchedule: boolean) => {
    const { protocolContent, analysisResults } = get();
    set({ isGenerating: true, error: null });

    try {
      if (!analysisResults) {
        throw new Error('Analysis results not found. Please analyze the protocol first.');
      }

      const finalDocs = await aiService.generateFinalDocuments(
        protocolContent,
        selectedSuggestions,
        includeSchedule,
        analysisResults
      );

      if (!finalDocs || !finalDocs.protocol) {
        throw new Error('Failed to generate final documents. Please try again.');
      }

      set({ 
        finalDocuments: finalDocs,
        isGenerating: false,
        currentStep: 3,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error generating final documents',
        isGenerating: false 
      });
      throw error; // Re-throw to handle in the UI
    }
  },

  saveCRFDesigns: (designs: any[]) => set({ crfDesigns: designs }),

  updateFormBuilderState: (state: any) => set({ formBuilderState: state }),

  saveSimulationResults: (results: any) => set({ simulationResults: results }),

  nextStep: () => set(state => ({ currentStep: state.currentStep + 1 })),
  
  previousStep: () => set(state => ({ currentStep: state.currentStep - 1 })),

  reset: () => set(initialState)
}));