import { create } from 'zustand';
import { screeningService } from '../services/screening';
import { aiService } from '../services/ai';

interface ScreeningState {
  criteria: any[];
  processedDocuments: any[];
  screeningResults: Array<{
    id: string;
    name: string;
    matchScore: number;
    status: 'pending' | 'approved' | 'rejected';
    extractedData: Record<string, any>;
    documents: Array<{
      id: string;
      name: string;
      content: string;
      entities: Array<{
        text: string;
        category: string;
        confidence: number;
        position: {
          start: number;
          end: number;
        };
      }>;
    }>;
  }>;
  isProcessing: boolean;
  error: string | null;

  setCriteria: (criteria: any[]) => void;
  uploadDocuments: (files: File[]) => Promise<void>;
  processScreening: () => Promise<void>;
  updatePatientStatus: (patientId: string, status: 'approve' | 'reject') => Promise<void>;
}

export const useScreeningStore = create<ScreeningState>((set, get) => ({
  criteria: [],
  processedDocuments: [],
  screeningResults: [],
  isProcessing: false,
  error: null,

  setCriteria: (criteria) => set({ criteria }),

  uploadDocuments: async (files) => {
    set({ isProcessing: true, error: null });
    try {
      // Ensure OpenAI is initialized
      if (!aiService.getApiKey()) {
        throw new Error('OpenAI API key not configured');
      }
      
      const processedDocs = await screeningService.processDocuments(files);
      set({ processedDocuments: processedDocs });
      await get().processScreening();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error processing documents' });
    } finally {
      set({ isProcessing: false });
    }
  },

  processScreening: async () => {
    const { criteria, processedDocuments } = get();
    set({ isProcessing: true, error: null });

    try {
      // Ensure OpenAI is initialized
      if (!aiService.getApiKey()) {
        throw new Error('OpenAI API key not configured');
      }

      const results = await screeningService.screenPatients(criteria, processedDocuments);
      set({ screeningResults: results });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error screening patients' });
    } finally {
      set({ isProcessing: false });
    }
  },

  updatePatientStatus: async (patientId, status) => {
    set(state => ({
      screeningResults: state.screeningResults.map(patient =>
        patient.id === patientId
          ? { ...patient, status: status === 'approve' ? 'approved' : 'rejected' }
          : patient
      )
    }));
  }
}));