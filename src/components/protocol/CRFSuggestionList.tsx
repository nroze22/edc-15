import React from 'react';
import { CheckCircle2, AlertTriangle, Brain, ArrowRight, CheckCircle, Printer, Template, Shield } from 'lucide-react';
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
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-talosix-blue"></div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Analyzing Protocol</h3>
            <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
              Our AI is analyzing your protocol to generate compliant and efficient CRF forms. 
              This typically takes 15-30 seconds.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Identifying required data points
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Matching with certified templates
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Validating against clinical standards
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">AI-Generated Forms</h3>
            <p className="mt-1 text-sm text-gray-500">
              Forms automatically generated based on your protocol analysis
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {suggestions.length} forms suggested
            </span>
            <button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Export Suggestions
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => onSelect(suggestion.id)}
              className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                selectedForms.has(suggestion.id)
                  ? 'border-talosix-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">{suggestion.name}</h4>
                    {suggestion.templateId && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        <Template className="h-3 w-3 mr-1" />
                        Certified Template
                      </span>
                    )}
                    {suggestion.standardsCompliance?.map((standard) => (
                      <span 
                        key={standard}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {standard}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{suggestion.description}</p>
                </div>
              </div>

              {suggestion.sections && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Suggested Sections</h5>
                  <div className="grid grid-cols-2 gap-4">
                    {suggestion.sections.map((section) => (
                      <div key={section.id} className="bg-gray-50 rounded p-2">
                        <h6 className="text-xs font-medium text-gray-900">{section.title}</h6>
                        <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                        <div className="mt-2 space-y-1">
                          {section.fields.slice(0, 3).map((field) => (
                            <div key={field.id} className="flex items-center text-xs text-gray-500">
                              <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-1.5"></div>
                              {field.label}
                              {field.required && <span className="text-red-500 ml-0.5">*</span>}
                            </div>
                          ))}
                          {section.fields.length > 3 && (
                            <div className="text-xs text-gray-400">
                              +{section.fields.length - 3} more fields
                            </div>
                          )}
                        </div>
                      </div>
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