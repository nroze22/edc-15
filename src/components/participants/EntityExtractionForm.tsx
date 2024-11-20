import React, { useState } from 'react';
import { FileText, Eye, AlertCircle, Upload, Check } from 'lucide-react';
import { documentExtractionService } from '../../services/documentExtraction';
import type { ExtractedEntity } from '../../services/documentExtraction';

interface EntityExtractionFormProps {
  participantId: string;
  onSave: (data: any) => void;
}

export default function EntityExtractionForm({ participantId, onSave }: EntityExtractionFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<Record<string, ExtractedEntity>>({});
  const [selectedEntity, setSelectedEntity] = useState<{
    field: string;
    entity: ExtractedEntity;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);
    setError(null);

    try {
      const result = await documentExtractionService.processDocument(uploadedFile);
      setExtractedData(result.demographics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEntityClick = (field: string, entity: ExtractedEntity) => {
    setSelectedEntity({ field, entity });
  };

  const renderSourcePreview = () => {
    if (!selectedEntity) return null;

    const { entity } = selectedEntity;
    const { text, source } = entity;
    const before = source.context.substring(0, source.context.indexOf(text));
    const after = source.context.substring(source.context.indexOf(text) + text.length);

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-900">
          <span>{before}</span>
          <span className="bg-yellow-200 font-medium">{text}</span>
          <span>{after}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Page {source.pageNumber || 'N/A'}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Form Fields */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Patient Information
          </h3>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block">
              <div className={`mt-1 flex justify-center px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                file ? 'border-talosix-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className="text-center">
                  {file ? (
                    <>
                      <FileText className="mx-auto h-8 w-8 text-talosix-blue" />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900">
                          Upload Source Document
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
              />
            </label>
          </div>

          {/* Extracted Fields */}
          {Object.entries(extractedData).map(([field, entity]) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={entity.value}
                  readOnly
                  className="block w-full rounded-lg border-gray-300 pr-10 focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                />
                <button
                  onClick={() => handleEntityClick(field, entity)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-talosix-blue"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-talosix-blue rounded-full h-1.5"
                    style={{ width: `${entity.confidence * 100}%` }}
                  />
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  {Math.round(entity.confidence * 100)}% confidence
                </span>
              </div>
            </div>
          ))}

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
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

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => onSave(extractedData)}
              disabled={!file || isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple disabled:opacity-50"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Save Extracted Data
            </button>
          </div>
        </div>
      </div>

      {/* Source Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Source Document</h3>
        </div>
        <div className="p-6">
          {selectedEntity ? (
            renderSourcePreview()
          ) : (
            <div className="text-center text-sm text-gray-500 py-8">
              Click the eye icon next to any field to view its source in the document
            </div>
          )}
        </div>
      </div>
    </div>
  );
}