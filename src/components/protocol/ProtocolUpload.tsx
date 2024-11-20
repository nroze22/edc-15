import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertTriangle, Brain } from 'lucide-react';
import { StudyDetails } from '../../store/useProtocolStore';

interface ProtocolUploadProps {
  onFileUpload: (file: File, content: string) => void;
  onDetailsSubmit: (details: StudyDetails) => void;
  isAnalyzing: boolean;
}

export default function ProtocolUpload({ onFileUpload, onDetailsSubmit, isAnalyzing }: ProtocolUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studyDetails, setStudyDetails] = useState<StudyDetails>({
    title: '',
    phase: '',
    indication: '',
    population: '',
    primaryEndpoint: '',
    secondaryEndpoints: '',
    visitSchedule: '',
    estimatedDuration: ''
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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
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
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-200">
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
                : file 
                ? 'border-green-300 bg-green-50/50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-talosix-blue"></div>
                <p className="mt-4 text-base text-gray-600">Processing document...</p>
              </div>
            ) : file ? (
              <>
                <FileText className="h-16 w-16 text-green-500 mb-4" />
                <div className="text-center">
                  <p className="text-lg font-medium text-green-600">{file.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-16 w-16 text-gray-400 mb-4" />
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Drop your protocol file here
                  </p>
                  <p className="text-base text-gray-500">
                    or{' '}
                    <span className="text-talosix-blue hover:text-talosix-purple font-medium">
                      browse files
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
                <input {...getInputProps()} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-200">
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">Study Details</h3>
            <p className="mt-2 text-base text-gray-600">
              Provide key information about your clinical study
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">
                  Study Title
                </label>
                <input
                  type="text"
                  value={studyDetails.title}
                  onChange={(e) => setStudyDetails({
                    ...studyDetails,
                    title: e.target.value
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-base"
                  placeholder="Enter the full study title"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">
                  Phase
                </label>
                <select
                  value={studyDetails.phase}
                  onChange={(e) => setStudyDetails({
                    ...studyDetails,
                    phase: e.target.value
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-base"
                >
                  <option value="">Select phase...</option>
                  <option value="1">Phase I</option>
                  <option value="2">Phase II</option>
                  <option value="3">Phase III</option>
                  <option value="4">Phase IV</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">
                  Therapeutic Area
                </label>
                <input
                  type="text"
                  value={studyDetails.indication}
                  onChange={(e) => setStudyDetails({
                    ...studyDetails,
                    indication: e.target.value
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-base"
                  placeholder="e.g., Oncology, Cardiology"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">
                  Study Population
                </label>
                <input
                  type="text"
                  value={studyDetails.population}
                  onChange={(e) => setStudyDetails({
                    ...studyDetails,
                    population: e.target.value
                  })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-base"
                  placeholder="Describe target population"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">
                  Primary Endpoint
                </label>
                <textarea
                  value={studyDetails.primaryEndpoint}
                  onChange={(e) => setStudyDetails({
                    ...studyDetails,
                    primaryEndpoint: e.target.value
                  })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-base resize-none"
                  placeholder="Describe the primary endpoint"
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-900 mb-2">
                  Secondary Endpoints
                </label>
                <textarea
                  value={studyDetails.secondaryEndpoints}
                  onChange={(e) => setStudyDetails({
                    ...studyDetails,
                    secondaryEndpoints: e.target.value
                  })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 shadow-sm focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-base resize-none"
                  placeholder="List secondary endpoints"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
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
              type="submit"
              disabled={!file || isAnalyzing || isProcessing}
              className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
                !file || isAnalyzing || isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Analyzing Protocol...
                </div>
              ) : (
                <>
                  <Brain className="h-6 w-6 mr-3" />
                  Analyze Protocol
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}