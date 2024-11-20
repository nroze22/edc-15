import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'improvement' | 'warning' | 'validation';
  message: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  autoFixAvailable: boolean;
}

interface SuggestionListProps {
  suggestions: Suggestion[];
  selectedSuggestions: Set<string>;
  onSuggestionToggle: (id: string) => void;
}

export default function SuggestionList({
  suggestions,
  selectedSuggestions,
  onSuggestionToggle
}: SuggestionListProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'validation':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Suggested Improvements
        </h3>

        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border-2 rounded-lg p-4 transition-colors ${
                selectedSuggestions.has(suggestion.id)
                  ? 'border-talosix-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    checked={selectedSuggestions.has(suggestion.id)}
                    onChange={() => onSuggestionToggle(suggestion.id)}
                    className="h-4 w-4 text-talosix-blue border-gray-300 rounded focus:ring-talosix-blue"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getTypeIcon(suggestion.type)}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {suggestion.message}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getImpactColor(suggestion.impact)
                    }`}>
                      {suggestion.impact} impact
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {suggestion.recommendation}
                  </p>
                  {suggestion.autoFixAvailable && (
                    <div className="mt-2">
                      <span className="inline-flex items-center text-xs text-talosix-blue">
                        Auto-fix available
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}