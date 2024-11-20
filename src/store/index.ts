import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  hasSeenTour: boolean;
  setHasSeenTour: (value: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  currentStudy: string | null;
  setCurrentStudy: (studyId: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hasSeenTour: false,
      setHasSeenTour: (value) => set({ hasSeenTour: value }),
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      currentStudy: null,
      setCurrentStudy: (studyId) => set({ currentStudy: studyId }),
    }),
    {
      name: 'talosix-storage',
    }
  )
);
