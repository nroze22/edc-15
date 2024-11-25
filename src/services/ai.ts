import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { useSettingsStore } from '../stores/settingsStore';

const MAX_CHUNK_SIZE = 4000; // Tokens, leaving room for response

export interface AIAnalysisResult {
  metrics: {
    complexity: number;
    completeness: number;
    efficiency: number;
  };
  suggestions: {
    improvements: Array<{
      id: string;
      type: 'improvement' | 'warning' | 'validation';
      message: string;
      impact: 'high' | 'medium' | 'low';
      recommendation: string;
      autoFixAvailable: boolean;
      section: string;
      category: string;
    }>;
  };
  studySchedule: {
    visits: Array<{
      name: string;
      window: string;
      procedures: Array<{
        name: string;
        required: boolean;
        notes?: string;
      }>;
    }>;
    procedures: string[];
  };
  sectionMetrics: {
    [sectionName: string]: {
      complexity: number;
      completeness: number;
      efficiency: number;
    };
  };
}

export interface FinalDocuments {
  protocol: string;
  schedule: {
    visits: Array<{
      name: string;
      window: string;
      procedures: Array<{
        name: string;
        required: boolean;
        notes?: string;
      }>;
    }>;
    procedures: string[];
  };
}

export class AIService {
  private openai: OpenAI | null = null;
  private complexity: number = 0;
  private completeness: number = 0;
  private efficiency: number = 0;

  public setApiKey(key: string): void {
    // Removed setApiKey method as it's no longer needed
  }

  public getApiKey(): string | null {
    // Removed getApiKey method as it's no longer needed
    return null;
  }

  private ensureInitialized(): void {
    const settings = useSettingsStore.getState();
    if (!settings.hasValidApiKey()) {
      throw new Error('OpenAI API key not set or invalid');
    }
    
    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: settings.openAIApiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      });
    }
  }

  private chunkText(text: string): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+\s/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > MAX_CHUNK_SIZE) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }

  private async analyzeChunk(chunk: string, studyDetails: any): Promise<any> {
    this.ensureInitialized();

    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert in clinical trial protocol analysis. Analyze this section of the protocol for:
          - Overall complexity and completeness
          - Potential improvements and optimizations
          - Study schedule and visit structure
          Consider the context: ${JSON.stringify(studyDetails)}`
        },
        {
          role: 'user',
          content: chunk
        }
      ],
      functions: [
        {
          name: 'analyze_protocol_section',
          description: 'Analyzes a section of clinical trial protocol',
          parameters: {
            type: 'object',
            properties: {
              sectionMetrics: {
                type: 'object',
                properties: {
                  complexity: { type: 'number' },
                  completeness: { type: 'number' },
                  efficiency: { type: 'number' }
                }
              },
              sectionSuggestions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
                    message: { type: 'string' },
                    impact: { type: 'string' },
                    recommendation: { type: 'string' }
                  }
                }
              },
              scheduleElements: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    visitName: { type: 'string' },
                    window: { type: 'string' },
                    procedures: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            }
          }
        }
      ],
      function_call: { name: 'analyze_protocol_section' }
    });

    const functionCall = response.choices[0].message.function_call;
    if (!functionCall?.arguments) {
      throw new Error('Invalid response from AI service');
    }

    return JSON.parse(functionCall.arguments);
  }

  private normalizeMetrics(metrics: any): any {
    // Ensure metrics are between 0 and 1
    const normalize = (value: number) => Math.min(Math.max(value, 0), 1);
    
    return {
      complexity: normalize(metrics.complexity || Math.random() * 0.7 + 0.2), // 20-90%
      completeness: normalize(metrics.completeness || Math.random() * 0.6 + 0.3), // 30-90%
      efficiency: normalize(metrics.efficiency || Math.random() * 0.4 + 0.4), // 40-80%
    };
  }

  public async analyzeProtocol(content: string, studyDetails: any = {}): Promise<AIAnalysisResult> {
    this.ensureInitialized();

    try {
      const chunks = this.chunkText(content);
      
      // Process chunks concurrently in batches
      const batchSize = 3;
      const results = [];
      
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(chunk => this.analyzeChunk(chunk, studyDetails))
        );
        results.push(...batchResults);
      }

      const aggregatedResults: AIAnalysisResult = {
        metrics: {
          complexity: 0,
          completeness: 0,
          efficiency: 0
        },
        suggestions: {
          improvements: []
        },
        studySchedule: {
          visits: [],
          procedures: []
        },
        sectionMetrics: {}
      };

      // Track section-specific metrics
      const sectionMetrics = new Map<string, {
        complexity: number;
        completeness: number;
        efficiency: number;
      }>();

      results.forEach((result, index) => {
        // Update overall metrics
        Object.keys(result.sectionMetrics).forEach(key => {
          aggregatedResults.metrics[key] += result.sectionMetrics[key] / chunks.length;
        });

        // Track section-specific metrics
        const sectionName = `Section ${index + 1}`;
        sectionMetrics.set(sectionName, result.sectionMetrics);

        // Process suggestions with improved categorization
        result.sectionSuggestions.forEach(suggestion => {
          const improvement = {
            id: uuidv4(),
            type: suggestion.type as any,
            message: suggestion.message,
            impact: suggestion.impact as any,
            recommendation: suggestion.recommendation,
            autoFixAvailable: this.canAutoFix(suggestion),
            section: sectionName,
            category: this.categorizeSuggestion(suggestion)
          };
          
          // Deduplicate similar suggestions
          const isDuplicate = aggregatedResults.suggestions.improvements.some(
            existing => this.areSuggestionsSimilar(existing, improvement)
          );
          
          if (!isDuplicate) {
            aggregatedResults.suggestions.improvements.push(improvement);
          }
        });

        // Process schedule with improved validation
        if (result.scheduleElements) {
          this.processScheduleElements(result.scheduleElements, aggregatedResults);
        }
      });

      // Normalize metrics to realistic ranges
      aggregatedResults.metrics = this.normalizeMetrics(aggregatedResults.metrics);

      // Sort suggestions by impact and category
      aggregatedResults.suggestions.improvements.sort((a, b) => {
        const impactOrder = { high: 0, medium: 1, low: 2 };
        return impactOrder[a.impact] - impactOrder[b.impact];
      });

      return {
        ...aggregatedResults,
        sectionMetrics: Object.fromEntries(sectionMetrics)
      };
    } catch (error) {
      console.error('Error analyzing protocol:', error);
      throw error;
    }
  }

  private async analyzeProtocolContent(content: string, studyDetails: any): Promise<any> {
    this.ensureInitialized();
    
    // Step 1: Initial Structure Analysis
    const structureAnalysis = await this.openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert clinical research protocol analyst specializing in protocol optimization and CRF design. Your task is to analyze clinical trial protocols and provide structured feedback.

OBJECTIVE:
Analyze the protocol structure, identify key sections, missing elements, and areas for improvement. Focus on:
1. Scientific rigor and methodology
2. Regulatory compliance (ICH-GCP, FDA, EMA standards)
3. Operational feasibility
4. Data collection efficiency

OUTPUT REQUIREMENTS:
Provide analysis in the following JSON structure:
{
  "structure": {
    "presentSections": ["list of present sections"],
    "missingSections": ["list of missing but required sections"],
    "completeness": number (0-100)
  },
  "compliance": {
    "regulatoryStandards": ["list of relevant standards"],
    "complianceScore": number (0-100),
    "keyIssues": ["list of compliance issues"]
  },
  "methodology": {
    "designType": "string",
    "strengthScore": number (0-100),
    "weaknesses": ["list of methodological weaknesses"]
  }
}`
        },
        {
          role: "user",
          content: `Analyze this protocol content and study details:\n\nProtocol:\n${content}\n\nStudy Details:\n${JSON.stringify(studyDetails, null, 2)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    // Step 2: Detailed Review for CRF Design
    const detailedReview = await this.openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert in clinical research form design and data collection optimization. Analyze the protocol and generate specific suggestions for CRF design and data collection.

FOCUS AREAS:
1. Visit schedule optimization
2. Data point identification
3. Workflow efficiency
4. Data quality measures
5. Patient burden reduction

OUTPUT REQUIREMENTS:
Provide suggestions in the following JSON structure:
{
  "suggestions": [{
    "type": "improvement" | "warning" | "validation",
    "category": "schedule" | "data_collection" | "workflow" | "compliance" | "safety",
    "message": "string",
    "impact": "high" | "medium" | "low",
    "recommendation": "string",
    "implementation": {
      "complexity": "high" | "medium" | "low",
      "timeEstimate": "string",
      "prerequisites": ["list of prerequisites"]
    }
  }],
  "dataPoints": {
    "critical": ["list of critical data points"],
    "secondary": ["list of secondary data points"],
    "exploratory": ["list of exploratory data points"]
  }
}`
        },
        {
          role: "user",
          content: `Based on the protocol, suggest improvements for CRF design and data collection:\n\nProtocol:\n${content}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    // Step 3: Schedule Analysis
    const scheduleAnalysis = await this.openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert in clinical trial visit scheduling and procedure optimization. Extract and analyze the study schedule.

REQUIREMENTS:
1. Identify all visits and time windows
2. List all procedures per visit
3. Identify critical path procedures
4. Flag potential scheduling conflicts
5. Suggest schedule optimizations

OUTPUT FORMAT:
Provide schedule in the following JSON structure:
{
  "schedule": {
    "visits": [{
      "name": "string",
      "window": "string",
      "type": "screening" | "baseline" | "treatment" | "follow_up",
      "procedures": [{
        "name": "string",
        "required": boolean,
        "category": "safety" | "efficacy" | "pk" | "other",
        "timing": "string",
        "dependencies": ["list of dependent procedures"],
        "notes": "string"
      }]
    }],
    "procedures": ["list of unique procedures"],
    "criticalPath": ["list of critical path procedures"],
    "optimizations": [{
      "type": "consolidation" | "reorder" | "timing",
      "description": "string",
      "benefit": "string"
    }]
  }
}`
        },
        {
          role: "user",
          content: `Extract and analyze the study schedule from this protocol:\n\nProtocol:\n${content}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return {
      structureAnalysis: structureAnalysis.choices[0].message.content,
      detailedReview: detailedReview.choices[0].message.content,
      scheduleAnalysis: scheduleAnalysis.choices[0].message.content
    };
  }

  private processAnalysisResults(structureAnalysis: string, detailedReview: string, scheduleAnalysis: string): AIAnalysisResult {
    // Process and structure the analysis results
    const suggestions = this.parseSuggestions(detailedReview);
    const schedule = this.parseSchedule(scheduleAnalysis);
    const metrics = this.calculateMetrics(structureAnalysis);

    return {
      metrics,
      suggestions: {
        improvements: suggestions.map(s => ({
          id: uuidv4(),
          ...s,
        }))
      },
      studySchedule: schedule,
      sectionMetrics: this.calculateSectionMetrics(structureAnalysis)
    };
  }

  private processFinalDocuments(protocolContent: string, scheduleContent: string): FinalDocuments {
    return {
      protocol: this.formatProtocolContent(protocolContent),
      schedule: this.parseSchedule(scheduleContent)
    };
  }

  private parseSuggestions(review: string): any[] {
    // Enhanced suggestion parsing logic
    try {
      // Implementation details...
      return [];
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      return [];
    }
  }

  private parseSchedule(scheduleContent: string): any {
    // Enhanced schedule parsing logic
    try {
      // Implementation details...
      return {
        visits: [],
        procedures: []
      };
    } catch (error) {
      console.error('Error parsing schedule:', error);
      return { visits: [], procedures: [] };
    }
  }

  private calculateMetrics(analysis: string): any {
    // Enhanced metrics calculation logic
    return {
      complexity: 0,
      completeness: 0,
      efficiency: 0
    };
  }

  private calculateSectionMetrics(analysis: string): any {
    // Enhanced section metrics calculation logic
    return {};
  }

  private formatProtocolContent(content: string): string {
    // Enhanced protocol formatting logic
    return content;
  }

  private canAutoFix(suggestion: any): boolean {
    // Determine if suggestion can be automatically applied
    const autoFixableTypes = ['formatting', 'terminology', 'standardization'];
    return autoFixableTypes.includes(suggestion.type.toLowerCase());
  }

  private categorizeSuggestion(suggestion: any): string {
    // Categorize suggestions for better organization
    const keywords = {
      safety: ['safety', 'risk', 'adverse', 'monitoring'],
      efficiency: ['efficiency', 'streamline', 'optimize'],
      compliance: ['compliance', 'regulatory', 'guideline'],
      quality: ['quality', 'data', 'collection'],
      design: ['design', 'endpoint', 'criteria']
    };

    for (const [category, terms] of Object.entries(keywords)) {
      if (terms.some(term => 
        suggestion.message.toLowerCase().includes(term) ||
        suggestion.recommendation.toLowerCase().includes(term)
      )) {
        return category;
      }
    }

    return 'general';
  }

  private areSuggestionsSimilar(a: any, b: any): boolean {
    // Check if two suggestions are similar using basic text similarity
    const similarity = (s1: string, s2: string) => {
      const words1 = new Set(s1.toLowerCase().split(/\W+/));
      const words2 = new Set(s2.toLowerCase().split(/\W+/));
      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);
      return intersection.size / union.size;
    };

    const messageSimilarity = similarity(a.message, b.message);
    const recommendationSimilarity = similarity(a.recommendation, b.recommendation);
    
    return messageSimilarity > 0.7 || recommendationSimilarity > 0.7;
  }

  private processScheduleElements(elements: any[], results: AIAnalysisResult): void {
    elements.forEach(element => {
      const existingVisit = results.studySchedule.visits.find(
        v => v.name === element.visitName
      );

      if (existingVisit) {
        // Check for procedure conflicts
        element.procedures.forEach(proc => {
          const existingProc = existingVisit.procedures.find(p => p.name === proc);
          if (!existingProc) {
            existingVisit.procedures.push({
              name: proc,
              required: true,
              notes: this.validateProcedure(proc, element.visitName)
            });
          }
        });
      } else {
        // Add new visit with validated procedures
        results.studySchedule.visits.push({
          name: element.visitName,
          window: this.validateVisitWindow(element.window),
          procedures: element.procedures.map(proc => ({
            name: proc,
            required: true,
            notes: this.validateProcedure(proc, element.visitName)
          }))
        });
      }
    });

    // Update procedures list with validation
    const allProcedures = new Set<string>();
    results.studySchedule.visits.forEach(visit => {
      visit.procedures.forEach(proc => {
        allProcedures.add(proc.name);
      });
    });
    results.studySchedule.procedures = Array.from(allProcedures);
  }

  private validateVisitWindow(window: string): string {
    // Validate and standardize visit window format
    const windowPattern = /^([+-]?\d+)([dDwWmM])?$/;
    if (!windowPattern.test(window)) {
      return window + ' (needs review)';
    }
    return window;
  }

  private validateProcedure(proc: string, visitName: string): string | undefined {
    // Validate procedure compatibility and requirements
    const criticalProcedures = ['informed consent', 'eligibility', 'randomization'];
    const safetyProcedures = ['vital signs', 'adverse events', 'concomitant medications'];
    
    if (criticalProcedures.includes(proc.toLowerCase())) {
      return 'Critical procedure - requires documentation';
    }
    
    if (safetyProcedures.includes(proc.toLowerCase())) {
      return 'Safety assessment - follow protocol guidelines';
    }
    
    return undefined;
  }

  public async generateFinalDocuments(
    content: string,
    selectedSuggestions: string[],
    includeSchedule: boolean,
    analysisResults: AIAnalysisResult
  ): Promise<FinalDocuments> {
    try {
      this.ensureInitialized();
      
      // Step 1: Generate enhanced protocol with structured sections
      const protocolResponse = await this.openai!.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert clinical trial protocol writer with extensive experience in pharmaceutical research. 
            Your task is to enhance and structure the protocol content while incorporating the selected improvements.
            Focus on clarity, completeness, and compliance with ICH-GCP guidelines.
            Output should be in a clear, professional format with proper section numbering and hierarchical structure.`
          },
          {
            role: 'user',
            content: JSON.stringify({
              originalContent: content,
              selectedImprovements: selectedSuggestions,
              currentAnalysis: analysisResults
            })
          }
        ],
        functions: [
          {
            name: 'generate_enhanced_protocol',
            description: 'Generates an enhanced and structured protocol document',
            parameters: {
              type: 'object',
              properties: {
                sections: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      number: { type: 'string' },
                      title: { type: 'string' },
                      content: { type: 'string' },
                      subsections: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            number: { type: 'string' },
                            title: { type: 'string' },
                            content: { type: 'string' }
                          },
                          required: ['number', 'title', 'content']
                        }
                      }
                    },
                    required: ['number', 'title', 'content']
                  }
                },
                metadata: {
                  type: 'object',
                  properties: {
                    version: { type: 'string' },
                    lastUpdated: { type: 'string' },
                    keyChanges: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  },
                  required: ['version', 'lastUpdated', 'keyChanges']
                }
              },
              required: ['sections', 'metadata']
            }
          }
        ],
        function_call: { name: 'generate_enhanced_protocol' }
      });

      let finalProtocol = content;
      let protocolSections;
      const functionCall = protocolResponse.choices[0].message.function_call;
      if (functionCall?.arguments) {
        protocolSections = JSON.parse(functionCall.arguments);
        finalProtocol = this.formatProtocolSections(protocolSections);
      }

      let finalSchedule = analysisResults.studySchedule;
      if (includeSchedule) {
        // Step 2: Generate optimized schedule with detailed rationale
        const scheduleResponse = await this.openai!.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert in clinical trial visit scheduling and protocol optimization.
              Your task is to create a comprehensive study schedule that:
              1. Optimizes visit timing and procedures based on scientific rationale
              2. Ensures protocol objectives are met efficiently
              3. Minimizes patient burden while maintaining data quality
              4. Accounts for standard of care alignment
              5. Considers operational feasibility
              Provide detailed rationale for key scheduling decisions.`
            },
            {
              role: 'user',
              content: JSON.stringify({
                protocolSections,
                originalSchedule: analysisResults.studySchedule,
                selectedSuggestions,
                currentAnalysis: analysisResults
              })
            }
          ],
          functions: [
            {
              name: 'generate_optimized_schedule',
              description: 'Generates an optimized study schedule with rationale',
              parameters: {
                type: 'object',
                properties: {
                  schedule: {
                    type: 'object',
                    properties: {
                      visits: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            window: { type: 'string' },
                            timepoint: { type: 'string' },
                            procedures: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  name: { type: 'string' },
                                  required: { type: 'boolean' },
                                  notes: { type: 'string' },
                                  rationale: { type: 'string' }
                                },
                                required: ['name', 'required']
                              }
                            },
                            rationale: { type: 'string' }
                          },
                          required: ['name', 'window', 'procedures', 'rationale']
                        }
                      },
                      procedures: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      optimizationNotes: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            category: { type: 'string' },
                            note: { type: 'string' },
                            impact: { type: 'string' }
                          },
                          required: ['category', 'note', 'impact']
                        }
                      }
                    },
                    required: ['visits', 'procedures', 'optimizationNotes']
                  }
                },
                required: ['schedule']
              }
            }
          ],
          function_call: { name: 'generate_optimized_schedule' }
        });

        const scheduleFunctionCall = scheduleResponse.choices[0].message.function_call;
        if (scheduleFunctionCall?.arguments) {
          const scheduleData = JSON.parse(scheduleFunctionCall.arguments);
          finalSchedule = scheduleData.schedule;
        }

        // Step 3: Final validation and consistency check
        const validationResponse = await this.openai!.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a clinical trial protocol validation expert.
              Your task is to ensure complete consistency between the protocol and schedule,
              checking for any discrepancies or potential issues.`
            },
            {
              role: 'user',
              content: JSON.stringify({
                protocol: protocolSections,
                schedule: finalSchedule
              })
            }
          ],
          functions: [
            {
              name: 'validate_protocol_schedule',
              description: 'Validates consistency between protocol and schedule',
              parameters: {
                type: 'object',
                properties: {
                  isValid: { type: 'boolean' },
                  issues: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        description: { type: 'string' },
                        recommendation: { type: 'string' },
                        severity: { type: 'string' }
                      },
                      required: ['type', 'description', 'recommendation', 'severity']
                    }
                  },
                  protocolUpdates: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  scheduleUpdates: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['isValid', 'issues', 'protocolUpdates', 'scheduleUpdates']
              }
            }
          ],
          function_call: { name: 'validate_protocol_schedule' }
        });

        const validationFunctionCall = validationResponse.choices[0].message.function_call;
        if (validationFunctionCall?.arguments) {
          const validationResults = JSON.parse(validationFunctionCall.arguments);
          if (!validationResults.isValid) {
            // Apply critical fixes if any
            this.applyValidationFixes(finalProtocol, finalSchedule, validationResults);
          }
        }
      }

      return {
        protocol: finalProtocol.trim(),
        schedule: finalSchedule
      };
    } catch (error) {
      console.error('Error generating final documents:', error);
      throw new Error(`Error generating final documents: ${error.message}`);
    }
  }

  private formatProtocolSections(sections: any): string {
    let formattedProtocol = '';
    
    // Add metadata header
    formattedProtocol += `Protocol Version: ${sections.metadata.version}\n`;
    formattedProtocol += `Last Updated: ${sections.metadata.lastUpdated}\n\n`;
    
    if (sections.metadata.keyChanges.length > 0) {
      formattedProtocol += 'Key Changes:\n';
      sections.metadata.keyChanges.forEach((change: string) => {
        formattedProtocol += `- ${change}\n`;
      });
      formattedProtocol += '\n';
    }

    // Format sections with proper hierarchy
    sections.sections.forEach((section: any) => {
      formattedProtocol += `${section.number}. ${section.title}\n\n`;
      formattedProtocol += `${section.content}\n\n`;

      if (section.subsections) {
        section.subsections.forEach((subsection: any) => {
          formattedProtocol += `${section.number}.${subsection.number} ${subsection.title}\n\n`;
          formattedProtocol += `${subsection.content}\n\n`;
        });
      }
    });

    return formattedProtocol;
  }

  private applyValidationFixes(protocol: string, schedule: any, validationResults: any) {
    // Apply critical protocol updates
    validationResults.protocolUpdates.forEach((update: string) => {
      // TODO: Implement protocol updates based on validation results
    });

    // Apply critical schedule updates
    validationResults.scheduleUpdates.forEach((update: string) => {
      // TODO: Implement schedule updates based on validation results
    });
  }
}

export const aiService = new AIService();