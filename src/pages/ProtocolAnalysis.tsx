import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Settings, ChevronRight } from 'lucide-react';
import ProtocolUpload from '../components/protocol/ProtocolUpload';
import ProtocolAnalysisSteps from '../components/protocol/ProtocolAnalysisSteps';
import AnalysisResults from '../components/protocol/AnalysisResults';
import FinalReview from '../components/protocol/FinalReview';
import { useSettingsStore } from '../stores/settingsStore';
import { useProtocolStore } from '../stores/protocolStore';
import ApiKeyRequired from '../components/common/ApiKeyRequired';

export default function ProtocolAnalysis() {
  const navigate = useNavigate();
  const { hasValidApiKey } = useSettingsStore();
  const { 
    currentStep,
    protocolFile,
    protocolContent,
    studyDetails,
    analysisResults,
    isAnalyzing,
    error,
    setProtocolFile,
    setProtocolContent,
    setStudyDetails,
    analyzeProtocol,
    generateFinalDocuments,
    nextStep,
    previousStep
  } = useProtocolStore();

  const [showSettings, setShowSettings] = useState(false);

  const steps = [
    { id: 1, name: 'Protocol Upload', description: 'Upload protocol and study details' },
    { id: 2, name: 'AI Analysis', description: 'Review AI suggestions and optimizations' },
    { id: 3, name: 'Final Review', description: 'Review and finalize protocol' }
  ];

  const handleFileUpload = async (file: File, content: string) => {
    setProtocolFile(file);
    setProtocolContent(content);
  };

  const handleDetailsSubmit = async (details: typeof studyDetails) => {
    setStudyDetails(details);
    await analyzeProtocol();
  };

  const handleSuggestionSelection = async (selectedSuggestions: string[], includeSchedule: boolean) => {
    await generateFinalDocuments(selectedSuggestions, includeSchedule);
    // After finalizing, show option to proceed to Form Builder
    if (includeSchedule) {
      navigate('/app/form-builder');
    }
  };

  if (!hasValidApiKey()) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Protocol Analysis</h1>
        <ApiKeyRequired message="Protocol Analysis requires an OpenAI API key to analyze and process your protocol document." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Protocol Analysis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload and analyze your protocol document to generate study forms and schedules
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSettings(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      <ProtocolAnalysisSteps steps={steps} currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 && (
          <ProtocolUpload
            onFileUpload={handleFileUpload}
            onDetailsSubmit={handleDetailsSubmit}
            studyDetails={studyDetails}
            isAnalyzing={isAnalyzing}
            error={error}
          />
        )}
        {currentStep === 2 && (
          <AnalysisResults
            results={analysisResults}
            isLoading={isAnalyzing}
            error={error}
            onNext={nextStep}
            onBack={previousStep}
            onSuggestionSelection={handleSuggestionSelection}
          />
        )}
        {currentStep === 3 && (
          <div className="space-y-6">
            <FinalReview
              protocolContent={protocolContent}
              suggestions={analysisResults?.suggestions || []}
              studySchedule={analysisResults?.studySchedule}
              onFinalize={generateFinalDocuments}
              onBack={previousStep}
            />
            
            {/* Next Steps Card */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h3>
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => navigate('/app/form-builder')}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple rounded-md hover:opacity-90"
                >
                  Proceed to Form Builder
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}