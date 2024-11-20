import React from 'react';
import { Brain, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'improvement' | 'warning' | 'validation';
  message: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  autoFixAvailable: boolean;
}

interface AISuggestionsProps {
  suggestions: Suggestion[];
  onApplySuggestion: (id: string) => void;
}

export default function AISuggestions({ suggestions, onApplySuggestion }: AISuggestionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-talosix-blue mr-2" />
          <h3 className="text-lg font-medium text-gray-900">AI Analysis & Suggestions</h3>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Real-time analysis and recommendations for your protocol
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion.id}
            className="flex items-start p-4 rounded-lg bg-white border border-gray-200 hover:border-talosix-blue transition-colors"
          >
            <div className="flex-shrink-0">
              {suggestion.type === 'improvement' && (
                <Lightbulb className="h-5 w-5 text-yellow-500" />
              )}
              {suggestion.type === 'warning' && (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
              {suggestion.type === 'validation' && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{suggestion.message}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${suggestion.impact === 'high' ? 'bg-red-100 text-red-800' :
                    suggestion.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}`}>
                  {suggestion.impact} impact
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{suggestion.recommendation}</p>
              {suggestion.autoFixAvailable && (
                <button
                  onClick={() => onApplySuggestion(suggestion.id)}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-talosix-blue bg-blue-50 hover:bg-blue-100"
                >
                  Apply Suggestion
                  <CheckCircle2 className="ml-1.5 h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}