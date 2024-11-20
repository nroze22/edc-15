import React from 'react';
import { CheckCircle2, AlertTriangle, Brain, ArrowRight } from 'lucide-react';
import type { CRFSuggestion } from '../../services/crfService';

interface CRFSuggestionListProps {
  suggestions: CRFSuggestion[];
  selectedForms: Set<string>;
  onSelect: (formId: string) => void;
  isLoading: boolean;
}

export default function CRFSuggestionList({
  suggestions,
  selectedForms,
  onSelect,
  isLoading
}: CRFSuggestionListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Brain className="mx-auto h-12 w-12 text-talosix-blue animate-pulse" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Analyzing Protocol</h3>
        <p className="mt-2 text-sm text-gray-500">
          Generating eCRF suggestions based on your protocol...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Suggested eCRFs</h3>
            <p className="mt-1 text-sm text-gray-500">
              AI-generated form suggestions based on your protocol
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {suggestions.length} forms suggested
          </span>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => onSelect(suggestion.id)}
              className={`relative rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                selectedForms.has(suggestion.id)
                  ? 'border-talosix-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-gray-900">{suggestion.name}</h4>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      suggestion.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : suggestion.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {suggestion.priority} priority
                    </span>
                    {suggestion.templateAvailable && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Template Available
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{suggestion.description}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(suggestion.matchScore * 100)}%
                    </span>
                    <span className="ml-1 text-xs text-gray-500">match</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Fields</h5>
                  <ul className="space-y-1">
                    {suggestion.fields.slice(0, 4).map((field) => (
                      <li key={field.name} className="flex items-center text-xs text-gray-500">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {field.name}
                        {field.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </li>
                    ))}
                    {suggestion.fields.length > 4 && (
                      <li className="text-xs text-gray-400">
                        +{suggestion.fields.length - 4} more fields
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Standards</h5>
                  <div className="space-y-1">
                    {suggestion.dataStandards.map((standard) => (
                      <div key={standard} className="flex items-center text-xs text-gray-500">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                        {standard}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {suggestion.regulatoryAlignment.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Regulatory Alignment</h5>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.regulatoryAlignment.map((reg) => (
                      <span
                        key={reg}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"
                      >
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}