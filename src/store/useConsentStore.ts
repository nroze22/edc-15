import create from 'zustand';
import { consentService } from '../services/consent';

interface ConsentState {
  consentTemplate: any;
  emailTemplate: any;
  mfaSettings: {
    smsEnabled: boolean;
    authenticatorEnabled: boolean;
    requiredForConsent: boolean;
  };
  isLoading: boolean;
  error: string | null;

  updateConsentTemplate: (template: any) => void;
  updateEmailTemplate: (template: any) => void;
  updateMFASettings: (settings: any) => void;
  sendConsentRequest: (participantId: string) => Promise<void>;
  verifyConsent: (participantId: string, signature: any) => Promise<void>;
}

export const useConsentStore = create<ConsentState>((set, get) => ({
  consentTemplate: null,
  emailTemplate: null,
  mfaSettings: {
    smsEnabled: true,
    authenticatorEnabled: true,
    requiredForConsent: true
  },
  isLoading: false,
  error: null,

  updateConsentTemplate: (template) => set({ consentTemplate: template }),
  
  updateEmailTemplate: (template) => set({ emailTemplate: template }),
  
  updateMFASettings: (settings) => set({ mfaSettings: settings }),

  sendConsentRequest: async (participantId) => {
    set({ isLoading: true, error: null });
    try {
      await consentService.sendConsentRequest(participantId);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error sending consent request' });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyConsent: async (participantId, signature) => {
    set({ isLoading: true, error: null });
    try {
      await consentService.verifyConsent(participantId, signature);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error verifying consent' });
    } finally {
      set({ isLoading: false });
    }
  }
}));