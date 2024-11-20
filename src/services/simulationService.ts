import OpenAI from 'openai';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { aiService } from './ai';

export interface SimulationConfig {
  numberOfPatients: number;
  studyDuration: number; // in months
  visitFrequency: number; // in weeks
  dropoutRate: number; // percentage
  dataQualityIssues: {
    missingData: number; // percentage
    outOfRange: number; // percentage
    inconsistentFormat: number; // percentage
  };
}

export interface SimulationResult {
  summary: {
    totalPatients: number;
    completedPatients: number;
    dropouts: number;
    totalVisits: number;
    missedVisits: number;
    dataQualityScore: number;
    averageCompletionTime: number;
  };
  issues: Array<{
    type: 'data_quality' | 'workflow' | 'validation' | 'usability';
    severity: 'high' | 'medium' | 'low';
    description: string;
    affectedFields: string[];
    recommendation: string;
    canAutoFix: boolean;
  }>;
  dataQualityMetrics: {
    missingDataRate: number;
    outOfRangeRate: number;
    inconsistentFormatRate: number;
    validationFailures: number;
  };
  fieldAnalysis: Array<{
    fieldId: string;
    name: string;
    completionRate: number;
    errorRate: number;
    averageTimeToComplete: number;
    commonIssues: string[];
  }>;
  recommendations: Array<{
    id: string;
    type: 'form_design' | 'validation' | 'workflow';
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
    changes: Array<{
      fieldId: string;
      change: string;
    }>;
  }>;
}

export class SimulationService {
  private openai: OpenAI;

  constructor() {
    const apiKey = aiService.getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }

  async generateTestData(
    crfDefinition: any,
    config: SimulationConfig
  ): Promise<{ csvData: string; simulationResult: SimulationResult }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert clinical research data simulator with deep knowledge of:
            - Clinical trial data patterns and distributions
            - Common data quality issues and their frequencies
            - Realistic patient visit patterns and compliance
            - Medical terminology and measurements
            - Data validation rules and edge cases
            
            Generate highly realistic test data that:
            - Follows the eCRF structure exactly
            - Includes common data quality issues in specified proportions
            - Reflects realistic patient behavior and dropout patterns
            - Maintains internal consistency across related fields
            - Includes both normal and edge cases
            - Simulates temporal patterns in longitudinal data`
          },
          {
            role: 'user',
            content: JSON.stringify({
              crfDefinition,
              config
            })
          }
        ],
        functions: [
          {
            name: 'generate_study_data',
            description: 'Generates realistic clinical trial test data',
            parameters: {
              type: 'object',
              properties: {
                testData: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: true
                  }
                },
                simulationResult: {
                  type: 'object',
                  properties: {
                    summary: {
                      type: 'object',
                      properties: {
                        totalPatients: { type: 'number' },
                        completedPatients: { type: 'number' },
                        dropouts: { type: 'number' },
                        totalVisits: { type: 'number' },
                        missedVisits: { type: 'number' },
                        dataQualityScore: { type: 'number' },
                        averageCompletionTime: { type: 'number' }
                      },
                      required: ['totalPatients', 'completedPatients', 'dropouts', 'totalVisits', 'missedVisits', 'dataQualityScore', 'averageCompletionTime']
                    },
                    issues: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          type: {
                            type: 'string',
                            enum: ['data_quality', 'workflow', 'validation', 'usability']
                          },
                          severity: {
                            type: 'string',
                            enum: ['high', 'medium', 'low']
                          },
                          description: { type: 'string' },
                          affectedFields: {
                            type: 'array',
                            items: { type: 'string' }
                          },
                          recommendation: { type: 'string' },
                          canAutoFix: { type: 'boolean' }
                        },
                        required: ['type', 'severity', 'description', 'affectedFields', 'recommendation', 'canAutoFix']
                      }
                    },
                    dataQualityMetrics: {
                      type: 'object',
                      properties: {
                        missingDataRate: { type: 'number' },
                        outOfRangeRate: { type: 'number' },
                        inconsistentFormatRate: { type: 'number' },
                        validationFailures: { type: 'number' }
                      },
                      required: ['missingDataRate', 'outOfRangeRate', 'inconsistentFormatRate', 'validationFailures']
                    },
                    fieldAnalysis: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          fieldId: { type: 'string' },
                          name: { type: 'string' },
                          completionRate: { type: 'number' },
                          errorRate: { type: 'number' },
                          averageTimeToComplete: { type: 'number' },
                          commonIssues: {
                            type: 'array',
                            items: { type: 'string' }
                          }
                        },
                        required: ['fieldId', 'name', 'completionRate', 'errorRate', 'averageTimeToComplete', 'commonIssues']
                      }
                    },
                    recommendations: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          type: {
                            type: 'string',
                            enum: ['form_design', 'validation', 'workflow']
                          },
                          description: { type: 'string' },
                          impact: {
                            type: 'string',
                            enum: ['high', 'medium', 'low']
                          },
                          effort: {
                            type: 'string',
                            enum: ['high', 'medium', 'low']
                          },
                          changes: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                fieldId: { type: 'string' },
                                change: { type: 'string' }
                              },
                              required: ['fieldId', 'change']
                            }
                          }
                        },
                        required: ['id', 'type', 'description', 'impact', 'effort', 'changes']
                      }
                    }
                  },
                  required: ['summary', 'issues', 'dataQualityMetrics', 'fieldAnalysis', 'recommendations']
                }
              },
              required: ['testData', 'simulationResult']
            }
          }
        ],
        function_call: { name: 'generate_study_data' }
      });

      const functionCall = response.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        throw new Error('Invalid response from AI service');
      }

      const { testData, simulationResult } = JSON.parse(functionCall.arguments);
      const csvData = Papa.unparse(testData);

      return { csvData, simulationResult };
    } catch (error) {
      console.error('Error generating test data:', error);
      throw error;
    }
  }

  async analyzeSimulationResults(
    crfDefinition: any,
    testData: any[],
    config: SimulationConfig
  ): Promise<SimulationResult> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert clinical research data analyst specializing in:
            - eCRF design optimization
            - Data quality assessment
            - Workflow efficiency analysis
            - Validation rule effectiveness
            - User experience improvement
            
            Analyze the simulation results to:
            - Identify potential issues and bottlenecks
            - Suggest specific improvements to form design
            - Recommend validation rule adjustments
            - Highlight workflow optimization opportunities
            - Quantify data quality metrics`
          },
          {
            role: 'user',
            content: JSON.stringify({
              crfDefinition,
              testData,
              config
            })
          }
        ],
        functions: [
          {
            name: 'analyze_simulation',
            description: 'Analyzes clinical trial simulation results',
            parameters: {
              type: 'object',
              properties: {
                summary: {
                  type: 'object',
                  properties: {
                    totalPatients: { type: 'number' },
                    completedPatients: { type: 'number' },
                    dropouts: { type: 'number' },
                    totalVisits: { type: 'number' },
                    missedVisits: { type: 'number' },
                    dataQualityScore: { type: 'number' },
                    averageCompletionTime: { type: 'number' }
                  },
                  required: ['totalPatients', 'completedPatients', 'dropouts', 'totalVisits', 'missedVisits', 'dataQualityScore', 'averageCompletionTime']
                },
                issues: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['data_quality', 'workflow', 'validation', 'usability']
                      },
                      severity: {
                        type: 'string',
                        enum: ['high', 'medium', 'low']
                      },
                      description: { type: 'string' },
                      affectedFields: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      recommendation: { type: 'string' },
                      canAutoFix: { type: 'boolean' }
                    },
                    required: ['type', 'severity', 'description', 'affectedFields', 'recommendation', 'canAutoFix']
                  }
                },
                dataQualityMetrics: {
                  type: 'object',
                  properties: {
                    missingDataRate: { type: 'number' },
                    outOfRangeRate: { type: 'number' },
                    inconsistentFormatRate: { type: 'number' },
                    validationFailures: { type: 'number' }
                  },
                  required: ['missingDataRate', 'outOfRangeRate', 'inconsistentFormatRate', 'validationFailures']
                },
                fieldAnalysis: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      fieldId: { type: 'string' },
                      name: { type: 'string' },
                      completionRate: { type: 'number' },
                      errorRate: { type: 'number' },
                      averageTimeToComplete: { type: 'number' },
                      commonIssues: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    },
                    required: ['fieldId', 'name', 'completionRate', 'errorRate', 'averageTimeToComplete', 'commonIssues']
                  }
                },
                recommendations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      type: {
                        type: 'string',
                        enum: ['form_design', 'validation', 'workflow']
                      },
                      description: { type: 'string' },
                      impact: {
                        type: 'string',
                        enum: ['high', 'medium', 'low']
                      },
                      effort: {
                        type: 'string',
                        enum: ['high', 'medium', 'low']
                      },
                      changes: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            fieldId: { type: 'string' },
                            change: { type: 'string' }
                          },
                          required: ['fieldId', 'change']
                        }
                      }
                    },
                    required: ['id', 'type', 'description', 'impact', 'effort', 'changes']
                  }
                }
              },
              required: ['summary', 'issues', 'dataQualityMetrics', 'fieldAnalysis', 'recommendations']
            }
          }
        ],
        function_call: { name: 'analyze_simulation' }
      });

      const functionCall = response.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        throw new Error('Invalid response from AI service');
      }

      return JSON.parse(functionCall.arguments);
    } catch (error) {
      console.error('Error analyzing simulation results:', error);
      throw error;
    }
  }

  downloadTestData(csvData: string, filename: string = 'test-data.csv'): void {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }
}

export const simulationService = new SimulationService();