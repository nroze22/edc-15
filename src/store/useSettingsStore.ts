import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { aiService } from '../services/ai';

interface SettingsState {
  apiKey: string | null;
  hasApiKey: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: aiService.getApiKey(),
      hasApiKey: !!aiService.getApiKey(),
      setApiKey: (key: string) => {
        aiService.setApiKey(key);
        set({ apiKey: key, hasApiKey: true });
      },
      clearApiKey: () => {
        localStorage.removeItem('openai_api_key');
        aiService.reinitialize();
        set({ apiKey: null, hasApiKey: false });
      }
    }),
    {
      name: 'talosix-settings',
      partialize: (state) => ({ apiKey: state.apiKey, hasApiKey: state.hasApiKey })
    }
  )
);