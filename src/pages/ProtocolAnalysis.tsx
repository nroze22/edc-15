import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Settings, ChevronRight } from 'lucide-react';
import ProtocolUpload from '../components/protocol/ProtocolUpload';
import ProtocolAnalyzer from '../components/protocol/ProtocolAnalyzer';
import AnalysisResults from '../components/protocol/AnalysisResults';
import FinalReview from '../components/protocol/FinalReview';
import { useSettingsStore } from '../stores/settingsStore';
import { useProtocolStore } from '../stores/protocolStore';
import ApiKeyRequired from '../components/common/ApiKeyRequired';
import { AnalysisResult, StudyDetails } from '../types/protocol';

export default function ProtocolAnalysis() {
  const navigate = useNavigate();
  const { hasValidApiKey, apiKey } = useSettingsStore();
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
    setAnalysisResults,
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

  const handleDetailsSubmit = async (details: StudyDetails) => {
    setStudyDetails(details);
    await analyzeProtocol();
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResults(result);
    nextStep();
  };

  const handleSuggestionSelection = async (selectedSuggestions: string[], includeSchedule: boolean) => {
    await generateFinalDocuments(selectedSuggestions, includeSchedule);
  };

  if (!hasValidApiKey) {
    return <ApiKeyRequired />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                <div className="flex items-center">
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                      step.id < currentStep
                        ? 'bg-blue-600'
                        : step.id === currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span className="text-white text-sm">{step.id}</span>
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div className="absolute top-4 w-full h-0.5 -right-4">
                      <div
                        className={`h-0.5 ${
                          step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">{step.name}</span>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-sm rounded-lg">
        {currentStep === 1 && (
          <ProtocolUpload
            onFileUpload={handleFileUpload}
            onDetailsSubmit={handleDetailsSubmit}
            file={protocolFile}
            studyDetails={studyDetails}
          />
        )}

        {currentStep === 2 && (
          <div className="p-6">
            <ProtocolAnalyzer
              content={protocolContent}
              studyDetails={studyDetails}
              onAnalysisComplete={handleAnalysisComplete}
              apiKey={apiKey}
            />
          </div>
        )}

        {currentStep === 3 && analysisResults && (
          <div className="p-6">
            <AnalysisResults
              results={analysisResults}
              onSuggestionSelection={handleSuggestionSelection}
              isLoading={isAnalyzing}
              error={error}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={previousStep}
          disabled={currentStep === 1}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {currentStep < steps.length && (
          <button
            onClick={nextStep}
            disabled={!analysisResults && currentStep === 2}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}