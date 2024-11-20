import create from 'zustand';
import type { SimulationConfig, SimulationResult } from '../services/simulationService';
import { simulationService } from '../services/simulationService';

interface SimulationState {
  config: SimulationConfig | null;
  results: SimulationResult | null;
  testData: string | null;
  isSimulating: boolean;
  error: string | null;

  startSimulation: (config: SimulationConfig, crfDefinition: any) => Promise<void>;
  downloadTestData: () => void;
  applyRecommendation: (recommendationId: string) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  config: null,
  results: null,
  testData: null,
  isSimulating: false,
  error: null,

  startSimulation: async (config, crfDefinition) => {
    set({ isSimulating: true, error: null });
    try {
      const { csvData, simulationResult } = await simulationService.generateTestData(
        crfDefinition,
        config
      );
      set({
        config,
        results: simulationResult,
        testData: csvData,
        isSimulating: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error running simulation',
        isSimulating: false
      });
    }
  },

  downloadTestData: () => {
    const { testData } = get();
    if (testData) {
      simulationService.downloadTestData(testData);
    }
  },

  applyRecommendation: (recommendationId: string) => {
    const { results } = get();
    if (!results) return;

    const recommendation = results.recommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      // Apply changes to CRF definition
      // This would be implemented based on your CRF store structure
    }
  },

  reset: () => set({
    config: null,
    results: null,
    testData: null,
    isSimulating: false,
    error: null
  })
}));