import OpenAI from 'openai';
import { aiService } from './ai';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface ExtractedEntity {
  value: string;
  confidence: number;
  source: {
    pageNumber?: number;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    text: string;
    context: string;
  };
}

export interface ExtractionResult {
  demographics: {
    firstName?: ExtractedEntity;
    lastName?: ExtractedEntity;
    dateOfBirth?: ExtractedEntity;
    gender?: ExtractedEntity;
    race?: ExtractedEntity;
    ethnicity?: ExtractedEntity;
    address?: ExtractedEntity;
    phone?: ExtractedEntity;
    email?: ExtractedEntity;
    emergencyContact?: ExtractedEntity;
    insuranceProvider?: ExtractedEntity;
    medicalRecordNumber?: ExtractedEntity;
  };
  medicalHistory?: Array<{
    condition: string;
    diagnosisDate?: string;
    status: string;
    source: ExtractedEntity['source'];
  }>;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    startDate?: string;
    source: ExtractedEntity['source'];
  }>;
}

export class DocumentExtractionService {
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

  async extractFromPDF(file: File): Promise<{ text: string; pageCount: number }> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;
    
    let fullText = '';
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return { text: fullText, pageCount };
  }

  async extractFromText(content: string): Promise<ExtractionResult> {
    try {
      const openai = this.ensureOpenAI();
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert medical data extraction system. Extract structured patient information from clinical notes with high precision. For each extracted field:
            - Provide confidence scores
            - Include source context
            - Maintain exact original text
            - Follow strict medical terminology
            - Respect data privacy guidelines`
          },
          {
            role: 'user',
            content: content
          }
        ],
        functions: [
          {
            name: 'extract_patient_data',
            description: 'Extracts structured patient data from clinical notes',
            parameters: {
              type: 'object',
              properties: {
                demographics: {
                  type: 'object',
                  properties: {
                    firstName: {
                      type: 'object',
                      properties: {
                        value: { type: 'string' },
                        confidence: { type: 'number' },
                        source: {
                          type: 'object',
                          properties: {
                            text: { type: 'string' },
                            context: { type: 'string' }
                          },
                          required: ['text', 'context']
                        }
                      },
                      required: ['value', 'confidence', 'source']
                    },
                    lastName: { type: 'object', properties: {
                      value: { type: 'string' },
                      confidence: { type: 'number' },
                      source: {
                        type: 'object',
                        properties: {
                          text: { type: 'string' },
                          context: { type: 'string' }
                        },
                        required: ['text', 'context']
                      }
                    }, required: ['value', 'confidence', 'source'] },
                    dateOfBirth: { type: 'object', properties: {
                      value: { type: 'string' },
                      confidence: { type: 'number' },
                      source: {
                        type: 'object',
                        properties: {
                          text: { type: 'string' },
                          context: { type: 'string' }
                        },
                        required: ['text', 'context']
                      }
                    }, required: ['value', 'confidence', 'source'] },
                    gender: { type: 'object', properties: {
                      value: { type: 'string' },
                      confidence: { type: 'number' },
                      source: {
                        type: 'object',
                        properties: {
                          text: { type: 'string' },
                          context: { type: 'string' }
                        },
                        required: ['text', 'context']
                      }
                    }, required: ['value', 'confidence', 'source'] }
                  },
                  required: ['firstName', 'lastName', 'dateOfBirth', 'gender']
                }
              },
              required: ['demographics']
            }
          }
        ],
        function_call: { name: 'extract_patient_data' }
      });

      const functionCall = response.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        throw new Error('Invalid response from AI service');
      }

      return JSON.parse(functionCall.arguments);
    } catch (error) {
      console.error('Error extracting data:', error);
      throw error;
    }
  }

  async processDocument(file: File): Promise<ExtractionResult> {
    let text: string;
    
    if (file.type === 'application/pdf') {
      const { text: extractedText } = await this.extractFromPDF(file);
      text = extractedText;
    } else {
      text = await file.text();
    }

    return await this.extractFromText(text);
  }
}

export const documentExtractionService = new DocumentExtractionService();