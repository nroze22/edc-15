import { create } from 'zustand';
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
  hasValidApiKey: () => boolean;
}

const defaultSettings: Settings = {
  modelVersion: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setOpenAIApiKey: (key: string) => {
        // Remove any whitespace
        const trimmedKey = key.trim();
        // Only set if key is not empty
        if (trimmedKey) {
          set({ openAIApiKey: trimmedKey });
        } else {
          set({ openAIApiKey: undefined });
        }
      },
      setModelVersion: (version: string) => set({ modelVersion: version }),
      setTemperature: (temp: number) => set({ temperature: temp }),
      setMaxTokens: (tokens: number) => set({ maxTokens: tokens }),
      clearSettings: () => set(defaultSettings),
      hasValidApiKey: () => {
        const key = get().openAIApiKey;
        return Boolean(key && key.trim().startsWith('sk-') && key.length > 20);
      }
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
