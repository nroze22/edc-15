import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import type { ExtractionResult, ExtractedEntity } from '../../services/documentExtraction';
import DocumentProcessor from './DocumentProcessor';

interface DemographicsFormProps {
  patientId: string;
  onSave: (data: any) => void;
}

interface FieldHighlight {
  field: string;
  source: ExtractedEntity['source'];
}

export default function DemographicsForm({ patientId, onSave }: DemographicsFormProps) {
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    race: '',
    ethnicity: '',
  });
  const [activeHighlight, setActiveHighlight] = useState<FieldHighlight | null>(null);

  useEffect(() => {
    if (extractedData?.demographics) {
      setFormData({
        firstName: extractedData.demographics.firstName?.value || '',
        lastName: extractedData.demographics.lastName?.value || '',
        dateOfBirth: extractedData.demographics.dateOfBirth?.value || '',
        gender: extractedData.demographics.gender?.value || '',
        race: extractedData.demographics.race?.value || '',
        ethnicity: extractedData.demographics.ethnicity?.value || '',
      });
    }
  }, [extractedData]);

  const handleExtraction = (result: ExtractionResult) => {
    setExtractedData(result);
  };

  const handleFieldFocus = (field: string) => {
    if (extractedData?.demographics) {
      const entityData = extractedData.demographics[field as keyof typeof extractedData.demographics];
      if (entityData && 'source' in entityData) {
        setActiveHighlight({
          field,
          source: entityData.source
        });
      }
    }
  };

  const renderConfidenceIndicator = (confidence: number) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              confidence >= 0.9 ? 'bg-green-500' :
              confidence >= 0.7 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{Math.round(confidence * 100)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Patient Demographics</h3>
          
          <div className="space-y-4">
            {Object.entries(formData).map(([field, value]) => {
              const entityData = extractedData?.demographics?.[field as keyof typeof extractedData.demographics];
              
              return (
                <div key={field} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <div className="relative">
                    <input
                      type={field === 'dateOfBirth' ? 'date' : 'text'}
                      value={value}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [field]: e.target.value
                      }))}
                      onFocus={() => handleFieldFocus(field)}
                      className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm ${
                        entityData ? 'pr-20' : ''
                      }`}
                    />
                    {entityData && 'confidence' in entityData && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {renderConfidenceIndicator(entityData.confidence)}
                      </div>
                    )}
                  </div>
                  {entityData && 'source' in entityData && (
                    <div className="mt-1 flex items-center">
                      <button
                        onClick={() => handleFieldFocus(field)}
                        className="text-xs text-talosix-blue hover:text-talosix-purple flex items-center"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View source
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => onSave(formData)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-talosix-blue hover:bg-talosix-purple"
            >
              Save Demographics
            </button>
          </div>
        </div>

        <DocumentProcessor onExtraction={handleExtraction} />
      </div>

      {/* Source Document Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Source Document</h3>
        </div>
        <div className="p-4">
          {activeHighlight ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-700 whitespace-pre-wrap">
                  {activeHighlight.source.context}
                </div>
                <div className="mt-2 text-xs text-blue-500">
                  Extracted value: <span className="font-medium">{activeHighlight.source.text}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 py-8">
              Click on a field to view its source in the document
            </div>
          )}
        </div>
      </div>
    </div>
  );
}