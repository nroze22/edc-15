import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  openAIApiKey?: string;
  modelVersion: string;
  temperature: number;
  maxTokens: number;
}

interface SettingsState extends Settings {
  setOpenAIApiKey: (key: string) => void;
  setModelVersion: (version: string) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  clearSettings: () => void;
}

const defaultSettings: Settings = {
  modelVersion: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setOpenAIApiKey: (key: string) => set({ openAIApiKey: key }),
      setModelVersion: (version: string) => set({ modelVersion: version }),
      setTemperature: (temp: number) => set({ temperature: temp }),
      setMaxTokens: (tokens: number) => set({ maxTokens: tokens }),
      clearSettings: () => set(defaultSettings),
    }),
    {
      name: 'talosix-settings',
      partialize: (state) => ({
        openAIApiKey: state.openAIApiKey,
        modelVersion: state.modelVersion,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
      }),
    }
  )
);
