import React, { useEffect, useState } from 'react';
import { Brain, Loader } from 'lucide-react';
import { useAIStore } from '../../store/useAIStore';
import AISuggestions from './AISuggestions';
import AnalysisMetrics from './AnalysisMetrics';
import AnalysisResults from './AnalysisResults';

interface AIAnalysisPanelProps {
  protocolContent: string;
  onSuggestionsGenerated: (results: any) => void;
}

export default function AIAnalysisPanel({ protocolContent, onSuggestionsGenerated }: AIAnalysisPanelProps) {
  const { analyzeProtocol, isAnalyzing, analysisResults, error } = useAIStore();
  const [isStarted, setIsStarted] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (analysisResults && !error) {
      onSuggestionsGenerated(analysisResults);
    }
  }, [analysisResults, error]);

  const handleStartAnalysis = async () => {
    setIsStarted(true);
    await analyzeProtocol(protocolContent);
  };

  const handleApplySuggestion = (id: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  if (!isStarted) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <Brain className="mx-auto h-12 w-12 text-talosix-blue" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Ready to Analyze Protocol</h3>
        <p className="mt-2 text-sm text-gray-500">
          Our AI will analyze your protocol and provide detailed recommendations for improvements and eCRF design.
        </p>
        <button
          onClick={handleStartAnalysis}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90"
        >
          Start Analysis
          <Brain className="ml-2 h-4 w-4" />
        </button>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <Loader className="mx-auto h-12 w-12 text-talosix-blue animate-spin" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Analyzing Protocol</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while our AI analyzes your protocol document...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={handleStartAnalysis}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-talosix-blue hover:bg-talosix-purple"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!analysisResults) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AnalysisMetrics metrics={analysisResults.metrics} />
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <AISuggestions 
            suggestions={analysisResults.suggestions.improvements}
            onApplySuggestion={handleApplySuggestion}
          />
        </div>
        <div className="col-span-2">
          <AnalysisResults
            suggestions={analysisResults.suggestions.improvements}
            studySchedule={analysisResults.studySchedule}
            protocolContent={protocolContent}
            selectedSuggestions={selectedSuggestions}
            onGenerateFinal={(suggestions, includeSchedule) => {
              // Handle final document generation
            }}
          />
        </div>
      </div>
    </div>
  );
}