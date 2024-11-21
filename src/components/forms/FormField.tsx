import React, { useState } from 'react';
import { AlertCircle, Calendar, Camera, Upload, History, Lock } from 'lucide-react';
import { format } from 'date-fns';

interface FormFieldProps {
  field: {
    id: string;
    label: string;
    type: string;
    value: any;
    status: string;
    lastModified?: Date;
    modifiedBy?: string;
    sourceDocument?: string;
    queries?: Array<{
      id: string;
      text: string;
      status: 'open' | 'resolved';
      createdAt: Date;
      createdBy: string;
    }>;
  };
  onChange: (value: any) => void;
  onAttachSource?: (file: File) => void;
  onAddQuery?: (text: string) => void;
  onResolveQuery?: (queryId: string) => void;
  readOnly?: boolean;
  showHistory?: boolean;
}

export default function FormField({ 
  field, 
  onChange, 
  onAttachSource, 
  onAddQuery, 
  onResolveQuery,
  readOnly,
  showHistory 
}: FormFieldProps) {
  const [showSourceUpload, setShowSourceUpload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [queryText, setQueryText] = useState('');

  const handleSourceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAttachSource) {
      onAttachSource(file);
      setShowSourceUpload(false);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            readOnly={readOnly}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={field.value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            readOnly={readOnly}
          />
        );
      
      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              value={field.value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              readOnly={readOnly}
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        );
      
      case 'select':
        return (
          <select
            value={field.value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={readOnly}
          >
            <option value="">Select...</option>
            {/* Add options based on field context */}
          </select>
        );
      
      case 'file':
        return (
          <div className="space-y-2">
            {field.value ? (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">{field.value}</span>
                <button
                  onClick={() => onChange(null)}
                  className="text-red-500 hover:text-red-600"
                  disabled={readOnly}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" onChange={(e) => onChange(e.target.files?.[0])} disabled={readOnly} />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 border-green-200';
      case 'partial':
        return 'bg-yellow-50 border-yellow-200';
      case 'empty':
        return 'bg-gray-50 border-gray-200';
      case 'verified':
        return 'bg-purple-50 border-purple-200';
      case 'query':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor(field.status)}`}>
      <div className="flex items-start justify-between mb-2">
        <label className="block text-sm font-medium text-gray-900">
          {field.label}
        </label>
        <div className="flex items-center space-x-2">
          {!readOnly && (
            <>
              <button
                onClick={() => setShowSourceUpload(!showSourceUpload)}
                className="p-1 text-gray-400 hover:text-gray-500"
                title="Attach source document"
              >
                <Camera className="h-4 w-4" />
              </button>
              {showHistory && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-1 text-gray-400 hover:text-gray-500"
                  title="View history"
                >
                  <History className="h-4 w-4" />
                </button>
              )}
            </>
          )}
          {readOnly && <Lock className="h-4 w-4 text-gray-400" />}
        </div>
      </div>

      {renderField()}

      {/* Source Document Upload */}
      {showSourceUpload && (
        <div className="mt-2">
          <input
            type="file"
            onChange={handleSourceUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      )}

      {/* Field History */}
      {showHistory && field.lastModified && (
        <div className="mt-2 text-sm text-gray-500">
          Last modified: {format(field.lastModified, 'PPpp')}
          {field.modifiedBy && ` by ${field.modifiedBy}`}
        </div>
      )}

      {/* Queries */}
      {field.queries && field.queries.length > 0 && (
        <div className="mt-2 space-y-2">
          {field.queries.map(query => (
            <div
              key={query.id}
              className={`flex items-start space-x-2 p-2 rounded-md ${
                query.status === 'open' ? 'bg-amber-50' : 'bg-green-50'
              }`}
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm">{query.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(query.createdAt, 'PPp')} by {query.createdBy}
                </p>
              </div>
              {query.status === 'open' && onResolveQuery && (
                <button
                  onClick={() => onResolveQuery(query.id)}
                  className="text-xs text-green-600 hover:text-green-700"
                >
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Query */}
      {!readOnly && onAddQuery && (
        <div className="mt-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Add a query..."
              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md"
            />
            <button
              onClick={() => {
                if (queryText.trim()) {
                  onAddQuery(queryText);
                  setQueryText('');
                }
              }}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
