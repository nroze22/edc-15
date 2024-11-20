import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { aiService } from './ai';

export interface CRFSuggestion {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  matchScore: number;
  templateAvailable: boolean;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    codingStandard?: string;
    validation?: string[];
    domain?: string;
    variable?: string;
    format?: string;
    options?: string[];
    units?: string[];
    description?: string;
  }>;
  rationale: string;
  regulatoryAlignment: string[];
  dataStandards: string[];
  annotations: {
    regulatory: string[];
    dataManagement: string[];
    quality: string[];
  };
}

export interface CRFOptimization {
  id: string;
  type: 'layout' | 'validation' | 'coding' | 'workflow';
  description: string;
  impact: 'high' | 'medium' | 'low';
  currentIssue: string;
  suggestedChange: string;
  benefits: string[];
  effort: 'high' | 'medium' | 'low';
  autoApplicable: boolean;
}

export interface CRFForm {
  id: string;
  name: string;
  version: string;
  description: string;
  fields: Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
    codingStandard?: string;
    validation?: string[];
    domain?: string;
    variable?: string;
    format?: string;
    options?: string[];
    units?: string[];
    description?: string;
  }>;
  annotations: {
    regulatory: string[];
    dataManagement: string[];
    quality: string[];
  };
  validations: Array<{
    type: string;
    field: string;
    rule: string;
    message: string;
  }>;
  workflow: {
    triggers: string[];
    dependencies: string[];
    conditionalLogic: string[];
  };
}

export class CRFService {
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

  async generateCRFSuggestions(
    protocolContent: string,
    studyPhase: string,
    therapeuticArea: string
  ): Promise<CRFSuggestion[]> {
    try {
      const openai = this.ensureOpenAI();
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert in clinical research form design with deep knowledge of:
            - Clinical trial protocols and procedures
            - CDISC standards (CDASH, SDTM)
            - Regulatory requirements
            - Data collection best practices
            - Form design optimization
            
            Analyze the protocol and suggest comprehensive eCRF designs that:
            - Cover all required data collection points
            - Follow regulatory standards
            - Optimize data quality
            - Minimize user burden
            - Support efficient workflows`
          },
          {
            role: 'user',
            content: JSON.stringify({
              protocol: protocolContent,
              phase: studyPhase,
              therapeuticArea
            })
          }
        ],
        functions: [
          {
            name: 'suggest_crfs',
            description: 'Suggests eCRF designs based on protocol analysis',
            parameters: {
              type: 'object',
              properties: {
                suggestions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      priority: {
                        type: 'string',
                        enum: ['high', 'medium', 'low']
                      },
                      category: { type: 'string' },
                      matchScore: { type: 'number' },
                      templateAvailable: { type: 'boolean' },
                      fields: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            type: { type: 'string' },
                            required: { type: 'boolean' },
                            codingStandard: { type: 'string' },
                            validation: {
                              type: 'array',
                              items: { type: 'string' }
                            },
                            domain: { type: 'string' },
                            variable: { type: 'string' },
                            format: { type: 'string' },
                            options: {
                              type: 'array',
                              items: { type: 'string' }
                            },
                            units: {
                              type: 'array',
                              items: { type: 'string' }
                            },
                            description: { type: 'string' }
                          },
                          required: ['name', 'type', 'required']
                        }
                      },
                      rationale: { type: 'string' },
                      regulatoryAlignment: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      dataStandards: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      annotations: {
                        type: 'object',
                        properties: {
                          regulatory: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          dataManagement: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          quality: {
                            type: 'array',
                            items: { type: 'string' }
                          }
                        },
                        required: ['regulatory', 'dataManagement', 'quality']
                      }
                    },
                    required: ['id', 'name', 'description', 'priority', 'category', 'matchScore', 'templateAvailable', 'fields', 'rationale', 'regulatoryAlignment', 'dataStandards', 'annotations']
                  }
                }
              },
              required: ['suggestions']
            }
          }
        ],
        function_call: { name: 'suggest_crfs' }
      });

      const functionCall = response.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        throw new Error('Invalid response from AI service');
      }

      return JSON.parse(functionCall.arguments).suggestions;
    } catch (error) {
      console.error('Error generating CRF suggestions:', error);
      throw error;
    }
  }

  // Rest of the service methods remain the same...
}

export const crfService = new CRFService();