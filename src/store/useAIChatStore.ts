import { create } from 'zustand';
import { aiService } from '../services/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useAIChatStore = create<AIChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (content: string) => {
    const { messages } = get();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    set({
      messages: [...messages, userMessage],
      isLoading: true,
      error: null
    });

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await aiService.sendChatMessage(content, history);
      
      set({
        messages: [...get().messages, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }],
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error sending message',
        isLoading: false
      });
    }
  },

  clearMessages: () => set({ messages: [], error: null })
}));