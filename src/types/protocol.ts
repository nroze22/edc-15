export interface ProtocolSection {
  title: string;
  content: string;
}

export interface StudyDetails {
  title: string;
  phase: string;
  sponsor: string;
  indication: string;
  studyType: string;
  population: string;
  estimatedDuration: string;
  sampleSize: number;
}

export interface ValidationResult {
  section: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string[];
  recommendations?: string[];
}

export interface AnalysisResult {
  studyOverview: {
    title: string;
    phase: string;
    sponsor: string;
    indication: string;
  };
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  procedures: Array<{
    name: string;
    description: string;
    timing: string;
    frequency: string;
    requirements: string[];
  }>;
  schedule: {
    visits: Array<{
      name: string;
      timepoint: string;
      window: string;
      procedures: string[];
      assessments: string[];
    }>;
  };
  safetyParameters: Array<{
    category: string;
    parameters: string[];
    frequency: string;
    thresholds?: {
      normal: string;
      clinicallySignificant: string;
    };
  }>;
  endpoints: Array<{
    type: 'primary' | 'secondary' | 'exploratory';
    description: string;
    timepoint: string;
    analysisMethod: string;
  }>;
  statistics: {
    primaryAnalysis: string;
    secondaryAnalyses: string[];
    populations: string[];
    handlingMissingData: string;
    interimAnalyses?: Array<{
      timepoint: string;
      criteria: string;
    }>;
  };
  recommendations: Array<{
    category: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
  }>;
}

export interface CRFTemplate {
  id: string;
  name: string;
  version: string;
  sections: Array<{
    id: string;
    title: string;
    fields: Array<{
      id: string;
      label: string;
      type: string;
      required: boolean;
      validation?: {
        type: string;
        params?: any;
      };
      options?: string[];
      dependencies?: Array<{
        field: string;
        condition: string;
        value: any;
      }>;
    }>;
  }>;
}

export interface ScheduleOfAssessments {
  visits: Array<{
    id: string;
    name: string;
    timepoint: string;
    window: {
      before: string;
      after: string;
    };
    procedures: Array<{
      id: string;
      name: string;
      required: boolean;
      forms: string[];
      conditions?: string[];
    }>;
  }>;
  procedures: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    requirements: string[];
    safetyConsiderations?: string[];
  }>;
  windows: {
    screening: string;
    treatment: string;
    followup: string;
  };
  criticalTimepoints: Array<{
    timepoint: string;
    description: string;
    requirements: string[];
  }>;
}
