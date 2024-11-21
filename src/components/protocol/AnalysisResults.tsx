import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Calendar,
  BarChart3,
  ArrowRight,
  Filter,
  Brain
} from 'lucide-react';
import clsx from 'classnames';

interface AnalysisResultsProps {
  results: any;
  onSuggestionSelection: (selectedSuggestions: string[], includeSchedule: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

export default function AnalysisResults({
  results,
  onSuggestionSelection,
  isLoading,
  error
}: AnalysisResultsProps) {
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [includeSchedule, setIncludeSchedule] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');

  const handleSuggestionToggle = (id: string) => {
    setSelectedSuggestions(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleApplySelected = () => {
    onSuggestionSelection(selectedSuggestions, includeSchedule);
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredSuggestions = results?.suggestions?.improvements.filter((suggestion: any) => {
    if (filterCategory !== 'all' && suggestion.category !== filterCategory) return false;
    if (filterImpact !== 'all' && suggestion.impact.toLowerCase() !== filterImpact) return false;
    return true;
  }) || [];

  const categories = [...new Set(results?.suggestions?.improvements.map((s: any) => s.category))];
  const sections = [...new Set(results?.suggestions?.improvements.map((s: any) => s.section))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-talosix-blue mx-auto"></div>
          <p className="text-gray-500">Analyzing protocol and generating suggestions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Protocol Complexity</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {(results.metrics.complexity * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Based on visit frequency and procedures
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Data Burden</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {(results.metrics.dataBurden * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Relative to similar studies
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Optimization Score</h3>
            <Brain className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {(results.metrics.optimizationScore * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Potential for improvement
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-md border-gray-300 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category: string) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
          className="rounded-md border-gray-300 text-sm"
        >
          <option value="all">All Impact Levels</option>
          <option value="high">High Impact</option>
          <option value="medium">Medium Impact</option>
          <option value="low">Low Impact</option>
        </select>
      </div>

      {/* Suggestions List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Protocol Improvement Suggestions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select suggestions to incorporate into the final protocol
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sections.map((section: string) => (
            <div key={section} className="divide-y divide-gray-100">
              <button
                onClick={() => setActiveSection(activeSection === section ? null : section)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">{section}</span>
                {activeSection === section ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {activeSection === section && (
                <div className="px-4 py-2 space-y-4">
                  {filteredSuggestions
                    .filter((suggestion: any) => suggestion.section === section)
                    .map((suggestion: any) => (
                      <div
                        key={suggestion.id}
                        className={clsx(
                          'p-4 rounded-lg border',
                          selectedSuggestions.includes(suggestion.id)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-gray-200'
                        )}
                      >
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedSuggestions.includes(suggestion.id)}
                            onChange={() => handleSuggestionToggle(suggestion.id)}
                            className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={clsx(
                                'px-2 py-1 text-xs font-medium rounded-full border',
                                getImpactColor(suggestion.impact)
                              )}>
                                {suggestion.impact.toUpperCase()} IMPACT
                              </span>
                              <span className="text-xs text-gray-500 font-medium">
                                {suggestion.category}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-900">
                              {suggestion.message}
                            </p>
                            <div className="mt-2 text-sm text-gray-700">
                              <span className="font-medium">Recommendation: </span>
                              {suggestion.recommendation}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={includeSchedule}
            onChange={(e) => setIncludeSchedule(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Include optimized study schedule</span>
        </div>
        
        <button
          onClick={handleApplySelected}
          disabled={selectedSuggestions.length === 0}
          className={clsx(
            'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium',
            selectedSuggestions.length > 0
              ? 'text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90'
              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
          )}
        >
          Apply Selected Suggestions
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}