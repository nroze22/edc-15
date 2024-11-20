import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Eye, FileText } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  matchScore: number;
  status: 'pending' | 'approved' | 'rejected';
  criteriaMatches: Array<{
    criterionId: string;
    matched: boolean;
    confidence: number;
    reason: string;
  }>;
  extractedData: Record<string, any>;
  concerns: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  documents: Array<{
    id: string;
    name: string;
    content: string;
    entities: Array<{
      text: string;
      category: string;
      confidence: number;
      position: {
        start: number;
        end: number;
      };
    }>;
  }>;
}

interface PatientDetailsProps {
  patient: Patient;
  onAction: (patientId: string, action: 'approve' | 'reject') => void;
}

export default function PatientDetails({ patient, onAction }: PatientDetailsProps) {
  const [selectedEntity, setSelectedEntity] = useState<{
    text: string;
    document: string;
    position: { start: number; end: number };
  } | null>(null);

  const handleEntityClick = (entity: any, document: any) => {
    setSelectedEntity({
      text: entity.text,
      document: document.content,
      position: entity.position
    });
  };

  const renderSourcePreview = () => {
    if (!selectedEntity) return null;

    const { text, document, position } = selectedEntity;
    const before = document.slice(Math.max(0, position.start - 100), position.start);
    const after = document.slice(position.end, Math.min(document.length, position.end + 100));

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          {before}
          <span className="bg-yellow-200 font-medium">{text}</span>
          {after}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              Match Score: {Math.round(patient.matchScore * 100)}%
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onAction(patient.id, 'reject')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              Reject
            </button>
            <button
              onClick={() => onAction(patient.id, 'approve')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Approve
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-200">
        {/* Left Panel: Extracted Data */}
        <div className="p-4 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Extracted Data</h4>
            {Object.entries(patient.extractedData).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  {category}
                </h5>
                <div className="space-y-2">
                  {Object.entries(items).map(([key, value]: [string, any]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <span className="text-sm text-gray-900">{key}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {value.value} {value.unit}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEntityClick(value.entity, value.document)}
                        className="text-xs text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Criteria Matches</h4>
            <div className="space-y-3">
              {patient.criteriaMatches.map((match) => (
                <div
                  key={match.criterionId}
                  className={`p-3 rounded-lg border ${
                    match.matched
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {match.matched ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {match.criterionId}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(match.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{match.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {patient.concerns.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Concerns</h4>
              <div className="space-y-3">
                {patient.concerns.map((concern, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      concern.severity === 'high'
                        ? 'bg-red-50 border border-red-200'
                        : concern.severity === 'medium'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <AlertTriangle className={`h-4 w-4 ${
                        concern.severity === 'high'
                          ? 'text-red-500'
                          : concern.severity === 'medium'
                          ? 'text-yellow-500'
                          : 'text-gray-500'
                      }`} />
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {concern.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {concern.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Source Documents */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Source Documents</h4>
          <div className="space-y-4">
            {patient.documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {doc.name}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  {selectedEntity ? (
                    renderSourcePreview()
                  ) : (
                    <p className="text-sm text-gray-500">
                      Select an extracted value to view its source context
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}