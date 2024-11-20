import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Brain, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import StudyScheduleGrid from './StudyScheduleGrid';
import SuggestionList from './SuggestionList';

interface AnalysisResultsProps {
  results: {
    metrics: {
      complexity: number;
      completeness: number;
      efficiency: number;
    };
    suggestions: {
      improvements: Array<{
        id: string;
        type: 'improvement' | 'warning' | 'validation';
        message: string;
        impact: 'high' | 'medium' | 'low';
        recommendation: string;
        autoFixAvailable: boolean;
      }>;
    };
    studySchedule: {
      visits: Array<{
        name: string;
        window: string;
        procedures: Array<{
          name: string;
          required: boolean;
          notes?: string;
        }>;
      }>;
      procedures: string[];
    };
  };
  onSuggestionSelect: (selectedIds: string[], includeSchedule: boolean) => void;
  onBack: () => void;
}

export default function AnalysisResults({ 
  results, 
  onSuggestionSelect,
  onBack 
}: AnalysisResultsProps) {
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [includeSchedule, setIncludeSchedule] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleSuggestionToggle = (id: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleContinue = () => {
    onSuggestionSelect(Array.from(selectedSuggestions), includeSchedule);
  };

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-talosix-blue mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
          </div>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="text-sm text-talosix-blue hover:text-talosix-purple"
          >
            {showSchedule ? 'View Suggestions' : 'View Study Schedule'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { 
              label: 'Protocol Complexity', 
              value: results.metrics.complexity,
              description: 'Overall complexity score based on procedures and requirements'
            },
            { 
              label: 'Completeness', 
              value: results.metrics.completeness,
              description: 'Coverage of essential protocol elements'
            },
            { 
              label: 'Efficiency Rating', 
              value: results.metrics.efficiency,
              description: 'Operational efficiency and clarity score'
            }
          ].map((metric) => (
            <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900">{metric.label}</h4>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.value >= 80 ? 'bg-green-500' :
                        metric.value >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {Math.round(metric.value)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {showSchedule ? (
        <StudyScheduleGrid schedule={results.studySchedule} />
      ) : (
        <SuggestionList
          suggestions={results.suggestions.improvements}
          selectedSuggestions={selectedSuggestions}
          onSuggestionToggle={handleSuggestionToggle}
        />
      )}

      {/* Schedule Option */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeSchedule"
            checked={includeSchedule}
            onChange={(e) => setIncludeSchedule(e.target.checked)}
            className="h-4 w-4 text-talosix-blue border-gray-300 rounded focus:ring-talosix-blue"
          />
          <label htmlFor="includeSchedule" className="ml-2 text-sm text-gray-700">
            Include optimized study schedule in the final protocol
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedSuggestions.size === 0}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90 disabled:opacity-50"
        >
          Generate Final Protocol
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}