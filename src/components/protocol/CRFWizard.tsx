import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { crfService } from '../../services/crfService';
import type { CRFSuggestion, CRFOptimization } from '../../services/crfService';
import CRFSuggestionList from './CRFSuggestionList';
import FormBuilder from './FormBuilder';
import SimulationConfig from './SimulationConfig';
import SimulationResults from './SimulationResults';
import OptimizationPanel from './OptimizationPanel';
import { useProtocolStore } from '../../store/useProtocolStore';

interface CRFWizardProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function CRFWizard({ onComplete, onBack }: CRFWizardProps) {
  const [step, setStep] = useState(1);
  const [suggestions, setSuggestions] = useState<CRFSuggestion[]>([]);
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const [formDefinitions, setFormDefinitions] = useState<any[]>([]);
  const [optimizations, setOptimizations] = useState<CRFOptimization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { protocolContent, studyDetails } = useProtocolStore();

  useEffect(() => {
    if (step === 1) {
      generateSuggestions();
    }
  }, [step]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await crfService.generateCRFSuggestions(
        protocolContent,
        studyDetails.phase,
        studyDetails.indication
      );
      setSuggestions(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSelect = (formId: string) => {
    setSelectedForms(prev => {
      const next = new Set(prev);
      if (next.has(formId)) {
        next.delete(formId);
      } else {
        next.add(formId);
      }
      return next;
    });
  };

  const handleOptimizationApply = async (optimization: CRFOptimization) => {
    try {
      const updatedForm = await crfService.applyOptimization(
        formDefinitions[0], // Update to handle multiple forms
        optimization
      );
      setFormDefinitions([updatedForm]); // Update to handle multiple forms
    } catch (err) {
      console.error('Error applying optimization:', err);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <CRFSuggestionList
            suggestions={suggestions}
            selectedForms={selectedForms}
            onSelect={handleFormSelect}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <FormBuilder
            selectedForms={Array.from(selectedForms).map(id => 
              suggestions.find(s => s.id === id)!
            )}
            onSave={setFormDefinitions}
          />
        );
      case 3:
        return (
          <div className="space-y-6">
            <SimulationConfig
              onStartSimulation={(config) => {
                // Handle simulation
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
              onDownloadData={() => {}}
              onApplyRecommendation={() => {}}
            />
          </div>
        );
      case 4:
        return (
          <OptimizationPanel
            optimizations={optimizations}
            onApply={handleOptimizationApply}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between">
          {[
            'Suggested Forms',
            'Form Builder',
            'Testing',
            'Optimizations'
          ].map((stepName, index) => (
            <div
              key={stepName}
              className={`flex items-center ${
                index + 1 === step
                  ? 'text-talosix-blue'
                  : index + 1 < step
                  ? 'text-green-500'
                  : 'text-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 === step
                  ? 'bg-talosix-blue text-white'
                  : index + 1 < step
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}>
                {index + 1 < step ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="ml-2 text-sm font-medium">{stepName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 1 ? (
          <button
            onClick={() => setStep(prev => prev - 1)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </button>
        ) : (
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Protocol
          </button>
        )}
        
        {step < 4 ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            disabled={step === 1 && selectedForms.size === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple disabled:opacity-50"
          >
            Continue
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple"
          >
            Complete Setup
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}