import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Brain,
  AlertTriangle,
  FileCheck,
  ClipboardList,
  ArrowRight,
  Settings,
  Check,
  Loader2
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { aiService } from '../../services/ai';
import GlobalSettings from '../settings/GlobalSettings';
import { useNavigate } from 'react-router-dom';

interface ProtocolData {
  originalContent: string;
  refinedContent: string;
  analysis: {
    studyDetails: {
      title: string;
      phase: string;
      indication: string;
      population: string;
      primaryEndpoint: string;
      secondaryEndpoints: string[];
      visitSchedule: any[];
      estimatedDuration: string;
    };
    keyFindings: {
      category: string;
      description: string;
    }[];
    suggestedForms: {
      name: string;
      description: string;
      fields: any[];
    }[];
  };
}

export default function ProtocolAnalysis() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<ProtocolData['analysis'] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileValidation, setFileValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: '' });
  
  const hasOpenAIKey = useSettingsStore(state => state.hasOpenAIKey);

  useEffect(() => {
    // Check if we have cached protocol data
    const cachedData = localStorage.getItem('protocolData');
    if (cachedData) {
      const data = JSON.parse(cachedData) as ProtocolData;
      setAnalysisResults(data.analysis);
    }
  }, []);

  if (!hasOpenAIKey) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-4">OpenAI API Key Required</h2>
          <p className="text-sm text-gray-500 mb-6">
            To use AI-powered protocol analysis, please configure your OpenAI API key in settings.
          </p>
          <div className="inline-block">
            <GlobalSettings />
          </div>
        </div>
      </div>
    );
  }

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      setFileValidation({
        isValid: false,
        message: 'Invalid file type. Please upload a PDF or Word document.'
      });
      return false;
    }
    
    if (file.size > maxSize) {
      setFileValidation({
        isValid: false,
        message: 'File size exceeds 10MB limit.'
      });
      return false;
    }
    
    setFileValidation({ isValid: true, message: '' });
    return true;
  };

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;
    
    setFile(file);
    setUploadProgress(0);
    
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    
    reader.onload = async () => {
      const content = reader.result as string;
      setFileContent(content);
      await analyzeProtocol(content);
    };
    
    reader.readAsText(file);
  };

  const analyzeProtocol = async (content: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const results = await aiService.analyzeProtocol(content);
      setAnalysisResults(results);
      
      // Store the protocol data in localStorage
      const protocolData: ProtocolData = {
        originalContent: content,
        refinedContent: results.refinedContent,
        analysis: results
      };
      localStorage.setItem('protocolData', JSON.stringify(protocolData));
    } catch (err) {
      setError('Failed to analyze protocol. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProceedToFormBuilder = () => {
    navigate('/form-builder');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Protocol Analysis</h1>
        <p className="text-base text-gray-600">
          Upload your study protocol to analyze and extract key information for form generation.
        </p>
      </div>

      {!analysisResults ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="mb-6">
              <div className="h-16 w-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Upload Protocol Document</h2>
              <p className="text-sm text-gray-500">
                Upload your protocol document (PDF or Word) to begin analysis.
                Maximum file size is 10MB.
              </p>
            </div>

            <div className="relative">
              <input
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Upload className="h-5 w-5 mr-2 text-gray-400" />
                Choose File
              </button>
            </div>

            {fileValidation.message && (
              <div className="mt-4 flex items-center justify-center text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {fileValidation.message}
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analysis Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-1">Study Details</h2>
                <p className="text-sm text-gray-500">Key information extracted from your protocol</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Check className="h-5 w-5" />
                <span>Analysis Complete</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Study Overview</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-gray-500">Title</dt>
                    <dd className="text-sm text-gray-900">{analysisResults.studyDetails.title}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Phase</dt>
                    <dd className="text-sm text-gray-900">{analysisResults.studyDetails.phase}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Indication</dt>
                    <dd className="text-sm text-gray-900">{analysisResults.studyDetails.indication}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Population</dt>
                    <dd className="text-sm text-gray-900">{analysisResults.studyDetails.population}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Endpoints</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-gray-500">Primary Endpoint</dt>
                    <dd className="text-sm text-gray-900">{analysisResults.studyDetails.primaryEndpoint}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Secondary Endpoints</dt>
                    <dd className="text-sm text-gray-900">
                      <ul className="list-disc pl-4 space-y-1">
                        {analysisResults.studyDetails.secondaryEndpoints.map((endpoint, index) => (
                          <li key={index}>{endpoint}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Key Findings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResults.keyFindings.map((finding, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">{finding.category}</h3>
                  <p className="text-sm text-gray-600">{finding.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setAnalysisResults(null)}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Upload New Protocol
            </button>
            <button
              onClick={handleProceedToFormBuilder}
              className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Form Builder
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <p className="text-gray-900 font-medium">Analyzing Protocol...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-red-50 text-red-800 rounded-lg p-4 flex items-start max-w-md shadow-lg">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium">Analysis Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}