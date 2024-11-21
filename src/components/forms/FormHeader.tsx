import React from 'react';
import { 
  Save, 
  Upload, 
  Lock, 
  Unlock, 
  CheckCircle2,
  History,
  Printer,
  Download,
  FileText,
  Eye,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { formatPercentage, formatRelativeTime, formatFieldName } from '@/utils/formatters';

interface FormHeaderProps {
  form: {
    id: string;
    name: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'verified' | 'locked';
    completionPercentage: number;
    lastModified?: Date;
    modifiedBy?: string;
    version?: string;
    visitName?: string;
    subjectId?: string;
    siteId?: string;
    hasQueries?: boolean;
    queryCount?: number;
  };
  onSave: () => void;
  onImport: () => void;
  onLock?: () => void;
  onUnlock?: () => void;
  onVerify?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
  onViewSource?: () => void;
  onShowHistory?: () => void;
  onShowQueries?: () => void;
  isLocked?: boolean;
  isVerified?: boolean;
  canVerify?: boolean;
}

export default function FormHeader({
  form,
  onSave,
  onImport,
  onLock,
  onUnlock,
  onVerify,
  onPrint,
  onExport,
  onViewSource,
  onShowHistory,
  onShowQueries,
  isLocked,
  isVerified,
  canVerify
}: FormHeaderProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'verified':
        return 'bg-purple-100 text-purple-800';
      case 'locked':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">{form.name}</h1>
              {form.version && (
                <span className="text-sm text-gray-500">v{form.version}</span>
              )}
            </div>
            <div className="mt-1 flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                {formatFieldName(form.status)}
              </span>
              <div className="text-sm text-gray-500">
                {formatPercentage(form.completionPercentage)} Complete
              </div>
              {form.hasQueries && form.queryCount && form.queryCount > 0 && (
                <button
                  onClick={onShowQueries}
                  className="inline-flex items-center space-x-1 text-sm text-amber-600 hover:text-amber-700"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{form.queryCount} {form.queryCount === 1 ? 'Query' : 'Queries'}</span>
                </button>
              )}
              {form.lastModified && (
                <div className="text-sm text-gray-500">
                  Modified {formatRelativeTime(form.lastModified)}
                  {form.modifiedBy && ` by ${form.modifiedBy}`}
                </div>
              )}
            </div>
            {(form.subjectId || form.visitName || form.siteId) && (
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                {form.subjectId && (
                  <span>Subject: {form.subjectId}</span>
                )}
                {form.visitName && (
                  <span>Visit: {form.visitName}</span>
                )}
                {form.siteId && (
                  <span>Site: {form.siteId}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Primary Actions */}
            <button
              onClick={onSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLocked}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>

            <button
              onClick={onImport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLocked}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>

            {/* Status Actions */}
            {isLocked ? (
              onUnlock && (
                <button
                  onClick={onUnlock}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Unlock className="h-4 w-4" />
                </button>
              )
            ) : (
              onLock && (
                <button
                  onClick={onLock}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Lock className="h-4 w-4" />
                </button>
              )
            )}

            {canVerify && onVerify && (
              <button
                onClick={onVerify}
                className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${
                  isVerified
                    ? 'border-purple-300 text-purple-700 bg-purple-50'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
            )}

            {/* Secondary Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                More
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    {onPrint && (
                      <button
                        onClick={() => {
                          onPrint();
                          setShowDropdown(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Printer className="h-4 w-4 mr-3" />
                        Print Form
                      </button>
                    )}
                    {onExport && (
                      <button
                        onClick={() => {
                          onExport();
                          setShowDropdown(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Download className="h-4 w-4 mr-3" />
                        Export Data
                      </button>
                    )}
                    {onViewSource && (
                      <button
                        onClick={() => {
                          onViewSource();
                          setShowDropdown(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FileText className="h-4 w-4 mr-3" />
                        View Source
                      </button>
                    )}
                    {onShowHistory && (
                      <button
                        onClick={() => {
                          onShowHistory();
                          setShowDropdown(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <History className="h-4 w-4 mr-3" />
                        View History
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Progress Bar */}
        <div className="mt-4">
          <div className="relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${form.completionPercentage}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  isVerified
                    ? 'bg-purple-500'
                    : form.hasQueries
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
