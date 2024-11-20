import OpenAI from 'openai';
import { aiService } from './ai';

export class ConsentService {
  private openai: any = null;

  private ensureOpenAI() {
    if (!this.openai) {
      const apiKey = aiService.getApiKey();
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }
      this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    }
    return this.openai;
  }

  async sendConsentRequest(participantId: string): Promise<void> {
    // Implementation for sending consent request
  }

  async verifyConsent(participantId: string, signature: any): Promise<void> {
    // Implementation for verifying consent
  }

  async generateConsentSummary(consentData: any): Promise<string> {
    try {
      const openai = this.ensureOpenAI();
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert in clinical research consent documentation. Generate clear, 
            comprehensive summaries of consent information that:
            - Highlight key points in plain language
            - Emphasize participant rights and responsibilities
            - Clearly explain risks and benefits
            - Maintain compliance with regulations`
          },
          {
            role: 'user',
            content: JSON.stringify(consentData)
          }
        ],
        functions: [
          {
            name: 'generate_consent_summary',
            description: 'Generates a clear summary of consent information',
            parameters: {
              type: 'object',
              properties: {
                summary: {
                  type: 'object',
                  properties: {
                    studyOverview: { type: 'string' },
                    keyPoints: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    participantRights: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    risksAndBenefits: {
                      type: 'object',
                      properties: {
                        risks: {
                          type: 'array',
                          items: { type: 'string' }
                        },
                        benefits: {
                          type: 'array',
                          items: { type: 'string' }
                        }
                      },
                      required: ['risks', 'benefits']
                    },
                    nextSteps: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  },
                  required: ['studyOverview', 'keyPoints', 'participantRights', 'risksAndBenefits', 'nextSteps']
                }
              },
              required: ['summary']
            }
          }
        ],
        function_call: { name: 'generate_consent_summary' }
      });

      const functionCall = response.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        throw new Error('Invalid response from AI service');
      }

      return JSON.parse(functionCall.arguments).summary;
    } catch (error) {
      console.error('Error generating consent summary:', error);
      throw error;
    }
  }
}

export const consentService = new ConsentService();