import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  History,
  MessageSquare,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface ValidationIssue {
  id: string;
  fieldName: string;
  message: string;
  severity: 'error' | 'warning';
}

interface Query {
  id: string;
  fieldName: string;
  message: string;
  status: 'open' | 'pending' | 'resolved';
  createdAt: Date;
  createdBy: string;
  responses?: {
    message: string;
    createdAt: Date;
    createdBy: string;
  }[];
}

interface AuditEntry {
  id: string;
  fieldName: string;
  action: string;
  timestamp: Date;
  user: string;
  oldValue?: string;
  newValue?: string;
}

interface FormSidebarProps {
  validationIssues: ValidationIssue[];
  queries: Query[];
  auditTrail: AuditEntry[];
  onClose: () => void;
  onResolveValidation?: (issueId: string) => void;
  onResolveQuery?: (queryId: string) => void;
  onAddQueryResponse?: (queryId: string, response: string) => void;
}

export default function FormSidebar({
  validationIssues,
  queries,
  auditTrail,
  onClose,
  onResolveValidation,
  onResolveQuery,
  onAddQueryResponse
}: FormSidebarProps) {
  const [activeTab, setActiveTab] = useState<'validation' | 'queries' | 'audit'>('validation');
  const [expandedQueries, setExpandedQueries] = useState<string[]>([]);
  const [newResponses, setNewResponses] = useState<Record<string, string>>({});

  const toggleQueryExpansion = (queryId: string) => {
    setExpandedQueries(prev =>
      prev.includes(queryId)
        ? prev.filter(id => id !== queryId)
        : [...prev, queryId]
    );
  };

  const handleAddResponse = (queryId: string) => {
    const response = newResponses[queryId];
    if (response && onAddQueryResponse) {
      onAddQueryResponse(queryId, response);
      setNewResponses(prev => {
        const next = { ...prev };
        delete next[queryId];
        return next;
      });
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'validation'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Validation
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'queries'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Queries
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'audit'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Audit
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'validation' && (
          <div className="divide-y divide-gray-200">
            {validationIssues.map(issue => (
              <div key={issue.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertCircle
                      className={`h-5 w-5 ${
                        issue.severity === 'error' ? 'text-red-500' : 'text-amber-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {issue.fieldName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {issue.message}
                      </p>
                    </div>
                  </div>
                  {onResolveValidation && (
                    <button
                      onClick={() => onResolveValidation(issue.id)}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="divide-y divide-gray-200">
            {queries.map(query => (
              <div key={query.id} className="p-4">
                <button
                  onClick={() => toggleQueryExpansion(query.id)}
                  className="flex items-start justify-between w-full text-left"
                >
                  <div className="flex items-start space-x-3">
                    <MessageSquare
                      className={`h-5 w-5 ${
                        query.status === 'open'
                          ? 'text-red-500'
                          : query.status === 'pending'
                          ? 'text-amber-500'
                          : 'text-green-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {query.fieldName}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {query.message}
                      </p>
                      <div className="mt-1 text-xs text-gray-500">
                        {format(query.createdAt, 'PPp')} by {query.createdBy}
                      </div>
                    </div>
                  </div>
                  {expandedQueries.includes(query.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {expandedQueries.includes(query.id) && (
                  <div className="mt-4 pl-8">
                    {query.responses?.map((response, index) => (
                      <div key={index} className="mb-3">
                        <p className="text-sm text-gray-900">{response.message}</p>
                        <div className="mt-1 text-xs text-gray-500">
                          {format(response.createdAt, 'PPp')} by{' '}
                          {response.createdBy}
                        </div>
                      </div>
                    ))}

                    <div className="mt-3">
                      <textarea
                        value={newResponses[query.id] || ''}
                        onChange={e =>
                          setNewResponses(prev => ({
                            ...prev,
                            [query.id]: e.target.value
                          }))
                        }
                        placeholder="Add a response..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                      <div className="mt-2 flex justify-end space-x-2">
                        {onResolveQuery && query.status !== 'resolved' && (
                          <button
                            onClick={() => onResolveQuery(query.id)}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => handleAddResponse(query.id)}
                          disabled={!newResponses[query.id]}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="divide-y divide-gray-200">
            {auditTrail.map(entry => (
              <div key={entry.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <History className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.fieldName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {entry.action}
                      {entry.oldValue && entry.newValue && (
                        <>
                          : <span className="line-through">{entry.oldValue}</span>{' '}
                          → {entry.newValue}
                        </>
                      )}
                    </p>
                    <div className="mt-1 text-xs text-gray-500">
                      {format(entry.timestamp, 'PPp')} by {entry.user}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
