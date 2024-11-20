import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Brain, Settings } from 'lucide-react';
import ProtocolUpload from '../components/protocol/ProtocolUpload';
import ProtocolAnalysisSteps from '../components/protocol/ProtocolAnalysisSteps';
import AnalysisResults from '../components/protocol/AnalysisResults';
import FinalReview from '../components/protocol/FinalReview';
import CRFDesigner from '../components/protocol/CRFDesigner';
import FormBuilder from '../components/protocol/FormBuilder';
import SimulationConfig from '../components/protocol/SimulationConfig';
import SimulationResults from '../components/protocol/SimulationResults';
import { useSettingsStore } from '../store/useSettingsStore';
import { useProtocolStore } from '../store/useProtocolStore';

export default function ProtocolAnalysis() {
  const navigate = useNavigate();
  const { hasApiKey } = useSettingsStore();
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
    { id: 3, name: 'Final Review', description: 'Review and edit final documents' },
    { id: 4, name: 'CRF Design', description: 'Design and configure eCRFs' },
    { id: 5, name: 'Form Builder', description: 'Build and customize forms' },
    { id: 6, name: 'Testing', description: 'Test and validate forms' },
    { id: 7, name: 'Publish', description: 'Review and publish forms' }
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
  };

  if (!hasApiKey) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">OpenAI API Key Required</h3>
          <p className="text-sm text-gray-500 mb-6">
            To use the protocol analysis features, please configure your OpenAI API key in the settings.
          </p>
          <button
            onClick={() => setShowSettings(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90"
          >
            <Settings className="h-4 w-4 mr-2" />
            Open Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Protocol Analysis</h2>
            <p className="mt-1 text-sm text-gray-500">
              AI-powered protocol analysis and optimization
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

        {/* Progress Steps */}
        <ProtocolAnalysisSteps steps={steps} currentStep={currentStep} />

        {/* Main Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <div className="bg-white shadow rounded-lg p-6">
              <ProtocolUpload
                onFileUpload={handleFileUpload}
                onDetailsSubmit={handleDetailsSubmit}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )}

          {currentStep === 2 && analysisResults && (
            <div className="bg-white shadow rounded-lg p-6">
              <AnalysisResults
                results={analysisResults}
                onSuggestionSelect={handleSuggestionSelection}
                onBack={previousStep}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white shadow rounded-lg p-6">
              <FinalReview
                protocolContent={protocolContent}
                analysisResults={analysisResults}
                onGenerateDocuments={generateFinalDocuments}
                onComplete={nextStep}
                onBack={previousStep}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white shadow rounded-lg p-6">
              <CRFDesigner
                onComplete={nextStep}
                onBack={previousStep}
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="bg-white shadow rounded-lg p-6">
              <FormBuilder
                onComplete={nextStep}
                onBack={previousStep}
              />
            </div>
          )}

          {currentStep === 6 && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <SimulationConfig
                onStartSimulation={(config) => {
                  // Handle simulation start
                  console.log('Starting simulation with config:', config);
                }}
              />
              <SimulationResults
                results={{
                  summary: {
                    totalPatients: 100,
                    completedPatients: 95,
                    dropouts: 5,
                    totalVisits: 450,
                    missedVisits: 12,
                    dataQualityScore: 98,
                    averageCompletionTime: 15
                  },
                  issues: [],
                  dataQualityMetrics: {
                    missingDataRate: 2.5,
                    outOfRangeRate: 1.8,
                    inconsistentFormatRate: 0.5,
                    validationFailures: 15
                  },
                  fieldAnalysis: [],
                  recommendations: []
                }}
                onDownloadData={() => {
                  // Handle download
                  console.log('Downloading simulation data');
                }}
                onApplyRecommendation={(id) => {
                  // Handle recommendation
                  console.log('Applying recommendation:', id);
                }}
              />
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}