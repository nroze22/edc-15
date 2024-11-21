import { useStore } from '../store';
import { aiService } from './ai';

interface ValidationResult {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  field?: string;
  section?: string;
  suggestion?: any;
}

export const crfAI = {
  async generateForms(data: { protocol: any; studyInfo: any }) {
    try {
      const { protocol, studyInfo } = data;
      
      // First, analyze protocol and study info to determine form requirements
      const analysis = await aiService.sendChatMessage(
        `Analyze this protocol and study information to determine required CRF forms: ${JSON.stringify({ protocol, studyInfo })}`,
        []
      );
      
      // Generate detailed form suggestions with templates and standards
      const response = await aiService.sendChatMessage(
        `Generate detailed CRF form suggestions based on this analysis: ${analysis}`,
        [],
        {
          functions: [{
            name: 'suggest_crfs',
            description: 'Generate detailed CRF suggestions with templates and standards',
            parameters: {
              type: 'object',
              properties: {
                forms: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      templateId: { type: 'string', nullable: true },
                      standardsCompliance: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      sections: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            fields: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string' },
                                  type: { type: 'string' },
                                  label: { type: 'string' },
                                  required: { type: 'boolean' },
                                  codingStandard: { type: 'string' },
                                  validation: {
                                    type: 'array',
                                    items: { type: 'string' }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }]
        }
      );

      return JSON.parse(response).forms;
    } catch (error) {
      console.error('Error generating forms:', error);
      throw error;
    }
  },

  async validateForm(form: any): Promise<ValidationResult[]> {
    try {
      const response = await aiService.sendChatMessage(
        `Validate this CRF form against clinical research standards: ${JSON.stringify(form)}`,
        [],
        {
          functions: [{
            name: 'validate_form',
            description: 'Validate CRF form against clinical research standards',
            parameters: {
              type: 'object',
              properties: {
                results: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', enum: ['error', 'warning', 'info'] },
                      field: { type: 'string', nullable: true },
                      message: { type: 'string' },
                      standardReference: { type: 'string', nullable: true },
                      suggestion: { type: 'object', nullable: true }
                    }
                  }
                }
              }
            }
          }]
        }
      );

      return JSON.parse(response).results;
    } catch (error) {
      console.error('Error validating form:', error);
      return [];
    }
  },

  async generateTestData(form: any, numRecords: number = 10) {
    try {
      const response = await aiService.sendChatMessage(
        `Generate ${numRecords} test records for this CRF form: ${JSON.stringify(form)}`,
        []
      );
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating test data:', error);
      return [];
    }
  },

  async suggestOptimizations(form: any) {
    try {
      const response = await aiService.sendChatMessage(
        `Suggest optimizations for this CRF form: ${JSON.stringify(form)}`,
        []
      );
      return JSON.parse(response);
    } catch (error) {
      console.error('Error suggesting optimizations:', error);
      return [];
    }
  }
};
