import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Brain,
  ArrowRight,
  BookOpen,
  Microscope,
  Users,
  Calendar,
  Target,
  Clock,
  Download,
  Save,
  ClipboardList,
  Activity,
  Pill,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Settings,
  RefreshCw
} from 'lucide-react';

interface ProtocolSection {
  title: string;
  content: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  confidence: number;
}

interface ProtocolReviewProps {
  file: File;
  studyDetails: {
    title: string;
    phase: string;
    indication: string;
    population: string;
    primaryEndpoint: string;
    secondaryEndpoints: string[];
    visitSchedule: {
      visit: string;
      timepoint: string;
      procedures: string[];
    }[];
    estimatedDuration: string;
    inclusionCriteria: string[];
    exclusionCriteria: string[];
    objectives: {
      primary: string[];
      secondary: string[];
      exploratory?: string[];
    };
  };
  refinedProtocol: {
    sections: Record<string, ProtocolSection>;
    version: string;
    lastUpdated: string;
    reviewStatus: 'in_progress' | 'completed';
  };
  onContinue: () => void;
  onSave: () => void;
  onExport: (format: 'pdf' | 'word' | 'html') => void;
  onRegenerateSection: (sectionKey: string) => void;
}

export default function ProtocolReview({ 
  file, 
  studyDetails, 
  refinedProtocol,
  onContinue, 
  onSave,
  onExport,
  onRegenerateSection
}: ProtocolReviewProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedExportFormat, setSelectedExportFormat] = useState<'pdf' | 'word' | 'html'>('pdf');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getStatusColor = (status: ProtocolSection['status']) => {
    switch (status) {
      case 'complete':
        return 'text-green-600';
      case 'analyzing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: ProtocolSection['status']) => {
    switch (status) {
      case 'complete':
        return CheckCircle2;
      case 'analyzing':
        return RefreshCw;
      case 'error':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Protocol Review & Finalization</h1>
          <p className="mt-1 text-sm text-gray-500">
            Version {refinedProtocol.version} • Last updated {refinedProtocol.lastUpdated}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onSave}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Protocol
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  {(['pdf', 'word', 'html'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        onExport(format);
                        setShowExportOptions(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Export as {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Protocol Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">Protocol Overview</h3>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Last analyzed {new Date().toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Study Information</h4>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Protocol Title</dt>
                <dd className="text-sm text-gray-900">{studyDetails.title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Phase</dt>
                <dd className="text-sm text-gray-900">Phase {studyDetails.phase}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Therapeutic Area</dt>
                <dd className="text-sm text-gray-900">{studyDetails.indication}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Duration</dt>
                <dd className="text-sm text-gray-900">{studyDetails.estimatedDuration}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Study Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <span className="ml-2 text-sm text-gray-500">Visit Schedule</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {studyDetails.visitSchedule.length}
                </p>
                <p className="text-xs text-gray-500">planned visits</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-indigo-600" />
                  <span className="ml-2 text-sm text-gray-500">Endpoints</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {studyDetails.objectives.primary.length + studyDetails.objectives.secondary.length}
                </p>
                <p className="text-xs text-gray-500">total objectives</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Protocol Sections */}
      <div className="space-y-4">
        {Object.entries(refinedProtocol.sections).map(([key, section]) => {
          const StatusIcon = getStatusIcon(section.status);
          const isExpanded = expandedSections[key] ?? false;

          return (
            <div key={key} className="bg-white shadow rounded-lg">
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`h-5 w-5 ${getStatusColor(section.status)}`} />
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                  {section.status === 'complete' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {section.confidence}% Confidence
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="prose max-w-none">
                    {section.content}
                  </div>
                  {section.status === 'complete' && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => onRegenerateSection(key)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-1.5" />
                        Regenerate Section
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onContinue}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Continue to Form Builder
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}