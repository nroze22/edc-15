import React, { useState } from 'react';
import { Upload, Brain, AlertTriangle } from 'lucide-react';

interface UploadFormProps {
  onFileUpload: (file: File, content: string) => void;
  onStudyDetailsChange: (details: any) => void;
}

export default function UploadForm({ onFileUpload, onStudyDetailsChange }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [studyDetails, setStudyDetails] = useState({
    title: '',
    phase: '',
    indication: '',
    population: '',
    primaryEndpoint: '',
    secondaryEndpoints: '',
    visitSchedule: '',
    estimatedDuration: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
    }
  };

  const handleDetailsChange = (field: string, value: string) => {
    const updates = { [field]: value };
    setStudyDetails(prev => ({ ...prev, ...updates }));
    onStudyDetailsChange(updates);
  };

  const handleAnalyze = async () => {
    if (!file || !studyDetails.title) {
      setError('Please upload a file and enter study details');
      return;
    }

    try {
      const text = await file.text();
      onFileUpload(file, text);
      setError(null);
    } catch (err) {
      setError('Error reading file content');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-gray-900">Upload Protocol</h3>
          <label className="block">
            <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              file ? 'border-talosix-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-talosix-blue hover:text-talosix-purple">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
          </label>
          {file && (
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="truncate">{file.name}</span>
              <span className="ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>
      </div>

      {/* Study Details */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <h3 className="text-xl font-medium text-gray-900 mb-6">Study Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Study Title</label>
            <input
              type="text"
              value={studyDetails.title}
              onChange={(e) => handleDetailsChange('title', e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phase</label>
            <select
              value={studyDetails.phase}
              onChange={(e) => handleDetailsChange('phase', e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
            >
              <option value="">Select phase...</option>
              <option value="1">Phase I</option>
              <option value="2">Phase II</option>
              <option value="3">Phase III</option>
              <option value="4">Phase IV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Indication</label>
            <input
              type="text"
              value={studyDetails.indication}
              onChange={(e) => handleDetailsChange('indication', e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Population</label>
            <input
              type="text"
              value={studyDetails.population}
              onChange={(e) => handleDetailsChange('population', e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Primary Endpoint</label>
            <textarea
              value={studyDetails.primaryEndpoint}
              onChange={(e) => handleDetailsChange('primaryEndpoint', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
            />
          </div>
        </div>
      </div>

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

      <div className="flex justify-end">
        <button
          onClick={handleAnalyze}
          disabled={!file || !studyDetails.title}
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Brain className="h-6 w-6 mr-2" />
          Analyze Protocol
        </button>
      </div>
    </div>
  );
}