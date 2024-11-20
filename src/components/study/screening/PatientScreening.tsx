import React, { useState } from 'react';
import { Upload, Users, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import EligibilityCriteria from './EligibilityCriteria';
import DocumentUploader from './DocumentUploader';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';
import { useScreeningStore } from '../../../store/useScreeningStore';
import { useSettingsStore } from '../../../store/useSettingsStore';
import GlobalSettings from '../../settings/GlobalSettings';

export default function PatientScreening() {
  const [currentStep, setCurrentStep] = useState<'criteria' | 'upload' | 'review'>('criteria');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  const { hasApiKey } = useSettingsStore();
  const { 
    criteria,
    processedDocuments,
    screeningResults,
    isProcessing,
    error,
    setCriteria,
    uploadDocuments,
    processScreening,
    updatePatientStatus
  } = useScreeningStore();

  const handleCriteriaSubmit = async (criteria: any) => {
    try {
      setCriteria(criteria);
      setCurrentStep('upload');
    } catch (err) {
      console.error('Error setting criteria:', err);
    }
  };

  const handleDocumentsUpload = async (files: File[]) => {
    try {
      await uploadDocuments(files);
      await processScreening(); // Make sure to call processScreening after upload
      setCurrentStep('review');
    } catch (err) {
      console.error('Error uploading documents:', err);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handlePatientAction = async (patientId: string, action: 'approve' | 'reject') => {
    try {
      await updatePatientStatus(patientId, action);
    } catch (err) {
      console.error('Error updating patient status:', err);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">OpenAI API Key Required</h3>
        <p className="text-sm text-gray-500 mb-6">
          Please configure your OpenAI API key to use patient screening features.
        </p>
        <GlobalSettings />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between">
          {['Define Criteria', 'Upload Documents', 'Review Results'].map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${
                index === (['criteria', 'upload', 'review'].indexOf(currentStep))
                  ? 'text-talosix-blue'
                  : 'text-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === (['criteria', 'upload', 'review'].indexOf(currentStep))
                  ? 'bg-talosix-blue text-white'
                  : 'bg-gray-100'
              }`}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      {currentStep === 'criteria' && (
        <EligibilityCriteria
          initialCriteria={criteria}
          onSubmit={handleCriteriaSubmit}
        />
      )}

      {currentStep === 'upload' && (
        <DocumentUploader
          onUpload={handleDocumentsUpload}
          onBack={() => setCurrentStep('criteria')}
        />
      )}

      {currentStep === 'review' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <PatientList
              patients={screeningResults}
              selectedPatientId={selectedPatientId}
              onPatientSelect={handlePatientSelect}
            />
          </div>
          <div className="col-span-2">
            {selectedPatientId ? (
              <PatientDetails
                patient={screeningResults.find(p => p.id === selectedPatientId)!}
                onAction={handlePatientAction}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Select a Patient
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Choose a patient from the list to view their screening details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}