import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { aiService } from './ai';

export interface DocumentChange {
  type: 'addition' | 'deletion' | 'modification' | 'comment';
  content: string;
  location: string;
  author?: string;
  timestamp?: string;
  comment?: string;
}

export interface ChangeAnalysis {
  changes: DocumentChange[];
  summary: string;
  potentialIssues: Array<{
    description: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
}

export class DocumentService {
  async exportToWord(crfContent: string, annotations: any): Promise<Buffer> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Clinical Research Form",
                bold: true,
                size: 32
              })
            ]
          }),
          // Convert CRF content to Word format
          ...this.convertContentToWordFormat(crfContent, annotations)
        ]
      }]
    });

    return await Packer.toBuffer(doc);
  }

  private convertContentToWordFormat(content: string, annotations: any): Paragraph[] {
    // Implementation to convert CRF content and annotations to Word paragraphs
    // This would be a detailed conversion of your CRF structure to Word format
    return [];
  }

  async importFromWord(file: File): Promise<{ content: string; changes: DocumentChange[] }> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    // Extract comments and track changes if present
    const changes = await this.extractChanges(arrayBuffer);
    
    return {
      content: result.value,
      changes
    };
  }

  private async extractChanges(arrayBuffer: ArrayBuffer): Promise<DocumentChange[]> {
    // Implementation to extract tracked changes and comments from Word doc
    // This would use mammoth's custom transform options to detect changes
    return [];
  }

  async analyzeChanges(originalContent: string, newContent: string, changes: DocumentChange[]): Promise<ChangeAnalysis> {
    try {
      const response = await aiService.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in clinical research form analysis and regulatory compliance.'
          },
          {
            role: 'user',
            content: JSON.stringify({
              original: originalContent,
              new: newContent,
              changes: changes
            })
          }
        ],
        functions: [
          {
            name: 'analyze_crf_changes',
            description: 'Analyzes changes made to a CRF document',
            parameters: {
              type: 'object',
              properties: {
                changes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['addition', 'deletion', 'modification', 'comment']
                      },
                      content: { type: 'string' },
                      location: { type: 'string' },
                      author: { type: 'string' },
                      timestamp: { type: 'string' },
                      comment: { type: 'string' }
                    },
                    required: ['type', 'content', 'location']
                  }
                },
                summary: { type: 'string' },
                potentialIssues: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      description: { type: 'string' },
                      severity: {
                        type: 'string',
                        enum: ['high', 'medium', 'low']
                      },
                      recommendation: { type: 'string' }
                    },
                    required: ['description', 'severity', 'recommendation']
                  }
                }
              },
              required: ['changes', 'summary', 'potentialIssues']
            }
          }
        ],
        function_call: { name: 'analyze_crf_changes' }
      });

      const functionCall = response.choices[0].message.function_call;
      if (!functionCall?.arguments) {
        throw new Error('Invalid response from AI service');
      }

      return JSON.parse(functionCall.arguments);
    } catch (error) {
      console.error('Error analyzing changes:', error);
      throw error;
    }
  }
}

export const documentService = new DocumentService();