import React, { useState } from 'react';
import { FileText, AlertCircle, Settings, Download, Eye, Code, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { crfService } from '../../services/crfService';
import CRFFormPreview from './CRFFormPreview';
import CRFAnnotations from './CRFAnnotations';
import CRFCodingView from './CRFCodingView';
import { useProtocolStore } from '../../store/useProtocolStore';
import { useCRFStore } from '../../store/useCRFStore';

interface CRFDesignerProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function CRFDesigner({ onComplete, onBack }: CRFDesignerProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'annotations' | 'coding'>('preview');
  const { selectedCRF, detailedCRF, isLoading, error, exportToWord } = useCRFStore();

  const handleExport = async () => {
    if (detailedCRF) {
      await exportToWord(detailedCRF);
    }
  };

  if (!selectedCRF || !detailedCRF) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No CRF Selected</h3>
        <p className="text-base text-gray-600 mb-6">
          Please select a CRF template to begin designing your form.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Templates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{selectedCRF.name}</h3>
            <p className="mt-1 text-base text-gray-600">{selectedCRF.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-talosix-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('annotations')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'annotations'
                    ? 'bg-talosix-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('coding')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'coding'
                    ? 'bg-talosix-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Code className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleExport}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export to Word
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {viewMode === 'preview' && (
          <CRFFormPreview form={detailedCRF} />
        )}
        
        {viewMode === 'annotations' && (
          <CRFAnnotations form={detailedCRF} />
        )}
        
        {viewMode === 'coding' && (
          <CRFCodingView form={detailedCRF} />
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </button>
        <button
          onClick={onComplete}
          className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90"
        >
          Continue
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}