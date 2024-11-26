import { OpenAI } from 'openai';
import { extractTextFromPDF, extractTextFromDOCX } from './documentExtraction';
import { ProtocolSection, AnalysisResult, StudyDetails, ValidationResult } from '../types/protocol';

export class ProtocolAnalysisService {
  private openai: OpenAI;
  
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeProtocol(content: string, studyDetails: StudyDetails): Promise<AnalysisResult> {
    try {
      // Split content into manageable chunks for analysis
      const sections = this.splitIntoSections(content);
      
      // Analyze each section in parallel
      const analysisPromises = sections.map(section => this.analyzeSection(section));
      const sectionAnalyses = await Promise.all(analysisPromises);

      // Combine and process all analyses
      return this.combineAnalyses(sectionAnalyses, studyDetails);
    } catch (error) {
      console.error('Error analyzing protocol:', error);
      throw new Error('Failed to analyze protocol');
    }
  }

  private async analyzeSection(section: ProtocolSection): Promise<any> {
    const prompt = `
      Analyze the following protocol section and extract key information:
      ${section.content}
      
      Please identify and analyze:
      1. Inclusion/Exclusion criteria
      2. Study procedures and timeline
      3. Safety monitoring requirements
      4. Data collection points
      5. Required assessments
      6. Statistical considerations
      7. Potential protocol deviations
      8. Risk factors
      
      Format the response as structured JSON.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert clinical research protocol analyzer. Provide detailed, accurate analysis with specific recommendations for EDC implementation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async validateProtocol(content: string): Promise<ValidationResult[]> {
    const validationChecks = [
      this.checkInclusionExclusionCriteria,
      this.checkSafetyParameters,
      this.checkStudyProcedures,
      this.checkEndpoints,
      this.checkStatisticalConsiderations
    ];

    const results = await Promise.all(
      validationChecks.map(check => check(content))
    );

    return results.flat();
  }

  async generateCRFTemplates(analysis: AnalysisResult): Promise<any> {
    const prompt = `
      Based on the following protocol analysis, generate CRF templates:
      ${JSON.stringify(analysis)}
      
      Include:
      1. Demographics
      2. Medical History
      3. Physical Examination
      4. Vital Signs
      5. Laboratory Tests
      6. Adverse Events
      7. Concomitant Medications
      8. Study Procedures
      
      Format as structured JSON with form definitions.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert in clinical research forms and EDC systems. Generate comprehensive, well-structured CRF templates."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async generateScheduleOfAssessments(analysis: AnalysisResult): Promise<any> {
    const prompt = `
      Based on the following protocol analysis, generate a detailed schedule of assessments:
      ${JSON.stringify(analysis)}
      
      Include:
      1. Visit schedule
      2. Required procedures per visit
      3. Timing windows
      4. Required documentation
      5. Critical timepoints
      
      Format as structured JSON suitable for EDC implementation.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert in clinical trial planning and scheduling. Generate detailed, accurate assessment schedules."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private splitIntoSections(content: string): ProtocolSection[] {
    // Implement smart section splitting logic
    const sections = [];
    const sectionHeaders = [
      'Introduction',
      'Study Objectives',
      'Study Design',
      'Study Population',
      'Study Procedures',
      'Safety Assessments',
      'Statistical Analysis'
    ];

    let currentSection = '';
    let currentContent = '';

    content.split('\n').forEach(line => {
      if (sectionHeaders.some(header => line.toLowerCase().includes(header.toLowerCase()))) {
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent.trim()
          });
        }
        currentSection = line;
        currentContent = '';
      } else {
        currentContent += line + '\n';
      }
    });

    if (currentSection) {
      sections.push({
        title: currentSection,
        content: currentContent.trim()
      });
    }

    return sections;
  }

  private combineAnalyses(sectionAnalyses: any[], studyDetails: StudyDetails): AnalysisResult {
    // Implement smart analysis combination logic
    return {
      studyOverview: {
        title: studyDetails.title,
        phase: studyDetails.phase,
        sponsor: studyDetails.sponsor,
        indication: studyDetails.indication
      },
      inclusionCriteria: this.extractInclusionCriteria(sectionAnalyses),
      exclusionCriteria: this.extractExclusionCriteria(sectionAnalyses),
      procedures: this.extractProcedures(sectionAnalyses),
      schedule: this.extractSchedule(sectionAnalyses),
      safetyParameters: this.extractSafetyParameters(sectionAnalyses),
      endpoints: this.extractEndpoints(sectionAnalyses),
      statistics: this.extractStatistics(sectionAnalyses),
      recommendations: this.generateRecommendations(sectionAnalyses)
    };
  }

  private extractInclusionCriteria(analyses: any[]): string[] {
    return analyses
      .flatMap(analysis => analysis.inclusionCriteria || [])
      .filter(Boolean);
  }

  private extractExclusionCriteria(analyses: any[]): string[] {
    return analyses
      .flatMap(analysis => analysis.exclusionCriteria || [])
      .filter(Boolean);
  }

  private extractProcedures(analyses: any[]): any[] {
    return analyses
      .flatMap(analysis => analysis.procedures || [])
      .filter(Boolean);
  }

  private extractSchedule(analyses: any[]): any {
    const schedules = analyses
      .map(analysis => analysis.schedule)
      .filter(Boolean);
    
    return schedules[0] || {};
  }

  private extractSafetyParameters(analyses: any[]): any[] {
    return analyses
      .flatMap(analysis => analysis.safetyParameters || [])
      .filter(Boolean);
  }

  private extractEndpoints(analyses: any[]): any[] {
    return analyses
      .flatMap(analysis => analysis.endpoints || [])
      .filter(Boolean);
  }

  private extractStatistics(analyses: any[]): any {
    const statistics = analyses
      .map(analysis => analysis.statistics)
      .filter(Boolean);
    
    return statistics[0] || {};
  }

  private generateRecommendations(analyses: any[]): any[] {
    return analyses
      .flatMap(analysis => analysis.recommendations || [])
      .filter(Boolean);
  }
}

export default ProtocolAnalysisService;
