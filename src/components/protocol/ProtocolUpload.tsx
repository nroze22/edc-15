import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertTriangle, Brain, Calendar, Users, Stethoscope, Building2, FlaskConical } from 'lucide-react';
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
    population: '',
    sponsor: '',
    estimatedDuration: '',
    targetEnrollment: '',
    numberOfSites: '',
    primaryEndpoint: '',
    secondaryEndpoints: '',
    inclusionCriteria: '',
    exclusionCriteria: '',
    studyType: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudyDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">Protocol Analysis</h3>
              <p className="mt-2 text-base text-gray-600">
                Upload your protocol and provide key study details for comprehensive analysis
              </p>
            </div>
          </div>

          {/* File Upload Section */}
          <div
            {...getRootProps()}
            className={`mt-4 flex flex-col items-center justify-center px-8 py-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400" />
                ) : (
                  <Upload className="h-12 w-12" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium text-gray-700">
                  {file ? file.name : 'Drop your protocol file here, or click to browse'}
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX, and TXT (max 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* Study Details Form */}
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Study Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-500" />
                  Basic Study Information
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Study Title</label>
                  <input
                    type="text"
                    name="title"
                    value={studyDetails.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter study title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Study Phase</label>
                  <select
                    name="phase"
                    value={studyDetails.phase}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select phase</option>
                    <option value="Phase I">Phase I</option>
                    <option value="Phase II">Phase II</option>
                    <option value="Phase III">Phase III</option>
                    <option value="Phase IV">Phase IV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Study Type</label>
                  <select
                    name="studyType"
                    value={studyDetails.studyType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="Interventional">Interventional</option>
                    <option value="Observational">Observational</option>
                    <option value="Expanded Access">Expanded Access</option>
                  </select>
                </div>
              </div>

              {/* Study Population */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  Study Population
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Indication</label>
                  <input
                    type="text"
                    name="indication"
                    value={studyDetails.indication}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Primary indication"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Population</label>
                  <input
                    type="text"
                    name="population"
                    value={studyDetails.population}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Adults 18-65 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Enrollment</label>
                  <input
                    type="text"
                    name="targetEnrollment"
                    value={studyDetails.targetEnrollment}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Number of participants"
                  />
                </div>
              </div>
            </div>

            {/* Study Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <FlaskConical className="h-5 w-5 mr-2 text-gray-500" />
                  Study Design
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Endpoint</label>
                  <textarea
                    name="primaryEndpoint"
                    value={studyDetails.primaryEndpoint}
                    onChange={handleInputChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Primary endpoint description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Secondary Endpoints</label>
                  <textarea
                    name="secondaryEndpoints"
                    value={studyDetails.secondaryEndpoints}
                    onChange={handleInputChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Key secondary endpoints"
                  />
                </div>
              </div>

              {/* Study Operations */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-gray-500" />
                  Study Operations
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sponsor</label>
                  <input
                    type="text"
                    name="sponsor"
                    value={studyDetails.sponsor}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Sponsoring organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estimated Duration</label>
                  <input
                    type="text"
                    name="estimatedDuration"
                    value={studyDetails.estimatedDuration}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., 24 months"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Sites</label>
                  <input
                    type="text"
                    name="numberOfSites"
                    value={studyDetails.numberOfSites}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Expected number of sites"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!file || isAnalyzing}
              className={`flex items-center px-6 py-3 rounded-lg text-white ${
                !file || isAnalyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Begin Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}