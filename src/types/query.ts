export type QueryStatus = 
  | 'open'
  | 'pending_site_response'
  | 'pending_monitor_review'
  | 'closed'
  | 'cancelled';

export type QueryPriority = 'low' | 'medium' | 'high' | 'critical';

export type QueryCategory = 
  | 'missing_data'
  | 'inconsistent_data'
  | 'protocol_deviation'
  | 'out_of_range'
  | 'coding_query'
  | 'other';

export interface QueryResponse {
  id: string;
  queryId: string;
  responderId: string;
  responderRole: string;
  response: string;
  attachments?: string[];
  createdAt: Date;
  aiAssisted?: boolean;
}

export interface Query {
  id: string;
  studyId: string;
  siteId: string;
  subjectId: string;
  formId: string;
  fieldId: string;
  visitId?: string;
  category: QueryCategory;
  priority: QueryPriority;
  status: QueryStatus;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  responses: QueryResponse[];
  aiSuggestions?: {
    recommendedResponse?: string;
    relatedQueries?: string[];
    insights?: string[];
  };
  metadata: {
    formName: string;
    fieldName: string;
    visitName?: string;
    currentValue?: string;
    expectedValue?: string;
  };
}
