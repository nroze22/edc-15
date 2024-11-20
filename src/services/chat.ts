import OpenAI from 'openai';

export class ChatService {
  private static instance: ChatService;
  private openai: OpenAI | null = null;

  private constructor() {
    this.initializeOpenAI();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public getApiKey(): string | null {
    return localStorage.getItem('openai_api_key');
  }

  public initializeOpenAI(): void {
    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (apiKey) {
        this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      }
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
      this.openai = null;
    }
  }

  public reinitialize(): void {
    this.initializeOpenAI();
  }

  private ensureInitialized(): void {
    if (!this.openai) {
      this.initializeOpenAI();
      if (!this.openai) {
        throw new Error('OpenAI API key not configured');
      }
    }
  }

  async sendChatMessage(content: string, history: any[]): Promise<string> {
    this.ensureInitialized();

    try {
      const response = await this.openai!.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful clinical research assistant, providing clear and accurate information about clinical trials, protocols, and EDC systems.'
          },
          ...history,
          { role: 'user', content }
        ]
      });

      return response.choices[0].message.content || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }
}

export const chatService = ChatService.getInstance();