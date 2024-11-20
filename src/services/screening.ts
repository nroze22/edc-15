import OpenAI from 'openai';
import { aiService } from './ai';

export class ScreeningService {
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

  async processDocuments(files: File[]): Promise<any[]> {
    const openai = this.ensureOpenAI();
    const processedDocs = [];

    for (const file of files) {
      const text = await file.text();
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert medical data extraction system. Extract structured patient information from clinical notes with high precision. Focus on:
            - Demographics
            - Medical history
            - Laboratory values
            - Current medications
            - Procedures
            - Vital signs
            Include confidence scores and source locations for each extracted entity.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        functions: [
          {
            name: 'extract_medical_data',
            description: 'Extracts structured medical data from clinical notes',
            parameters: {
              type: 'object',
              properties: {
                documentId: { type: 'string' },
                entities: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      text: { type: 'string' },
                      category: { type: 'string' },
                      value: { type: 'string' },
                      confidence: { type: 'number' },
                      position: {
                        type: 'object',
                        properties: {
                          start: { type: 'number' },
                          end: { type: 'number' }
                        },
                        required: ['start', 'end']
                      }
                    },
                    required: ['text', 'category', 'value', 'confidence', 'position']
                  }
                }
              },
              required: ['documentId', 'entities']
            }
          }
        ],
        function_call: { name: 'extract_medical_data' }
      });

      const functionCall = response.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        throw new Error('Invalid response from AI service');
      }

      const extractedData = JSON.parse(functionCall.arguments);
      processedDocs.push({
        id: extractedData.documentId,
        name: file.name,
        content: text,
        entities: extractedData.entities
      });
    }

    return processedDocs;
  }

  // Rest of the service methods remain the same...
}

export const screeningService = new ScreeningService();