import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertTriangle, Brain } from 'lucide-react';
import { StudyDetails } from '../../stores/protocolStore';

interface ProtocolUploadProps {
  onFileUpload: (file: File, content: string) => void;
  onDetailsSubmit: (details: StudyDetails) => void;
  studyDetails?: StudyDetails;
  isAnalyzing: boolean;
  error?: string | null;
}

export default function ProtocolUpload({ 
  onFileUpload, 
  onDetailsSubmit, 
  studyDetails: initialStudyDetails,
  isAnalyzing,
  error: externalError 
}: ProtocolUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(externalError);
  const [studyDetails, setStudyDetails] = useState<StudyDetails>(initialStudyDetails || {
    title: '',
    phase: '',
    indication: '',
    population: ''
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setIsProcessing(true);
    setError(null);

    try {
      const content = await readFileContent(file);
      onFileUpload(file, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing file');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isAnalyzing) return;

    try {
      await onDetailsSubmit(studyDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting details');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">Upload Protocol</h3>
              <p className="mt-2 text-base text-gray-600">
                Upload your study protocol document to begin analysis
              </p>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`mt-4 flex flex-col items-center justify-center px-8 py-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-talosix-blue bg-blue-50/50 scale-[1.02]' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center text-center">
              {isProcessing ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-talosix-blue" />
              ) : file ? (
                <FileText className="h-12 w-12 text-talosix-blue" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
              
              <p className="mt-4 text-sm font-medium text-gray-900">
                {file ? file.name : 'Drop your protocol document here'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {file 
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : 'PDF, DOC, DOCX up to 10MB'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">Study Details</h3>
            <p className="mt-2 text-base text-gray-600">
              Provide basic information about your study
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Study Title
              </label>
              <input
                type="text"
                id="title"
                value={studyDetails.title}
                onChange={(e) => setStudyDetails({ ...studyDetails, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-talosix-blue focus:ring-talosix-blue sm:text-sm"
                placeholder="Enter study title"
              />
            </div>

            <div>
              <label htmlFor="phase" className="block text-sm font-medium text-gray-700">
                Study Phase
              </label>
              <select
                id="phase"
                value={studyDetails.phase}
                onChange={(e) => setStudyDetails({ ...studyDetails, phase: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-talosix-blue focus:ring-talosix-blue sm:text-sm"
              >
                <option value="">Select phase</option>
                <option value="Phase 1">Phase 1</option>
                <option value="Phase 2">Phase 2</option>
                <option value="Phase 3">Phase 3</option>
                <option value="Phase 4">Phase 4</option>
              </select>
            </div>

            <div>
              <label htmlFor="indication" className="block text-sm font-medium text-gray-700">
                Indication
              </label>
              <input
                type="text"
                id="indication"
                value={studyDetails.indication}
                onChange={(e) => setStudyDetails({ ...studyDetails, indication: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-talosix-blue focus:ring-talosix-blue sm:text-sm"
                placeholder="Enter study indication"
              />
            </div>

            <div>
              <label htmlFor="population" className="block text-sm font-medium text-gray-700">
                Study Population
              </label>
              <input
                type="text"
                id="population"
                value={studyDetails.population}
                onChange={(e) => setStudyDetails({ ...studyDetails, population: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-talosix-blue focus:ring-talosix-blue sm:text-sm"
                placeholder="Describe study population"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
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

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={!file || isAnalyzing}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                !file || isAnalyzing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Brain className="animate-pulse h-4 w-4 mr-2" />
                  Analyzing...
                </>
              ) : (
                'Analyze Protocol'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}