import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Clock,
  CheckCircle2,
  Search,
  Filter,
  FileText,
  Eye
} from 'lucide-react';
import { formatDuration } from '@/utils/formatters';

interface FormToolbarProps {
  totalFields: number;
  completedFields: number;
  openQueries: number;
  timeSpent?: number;
  currentPage: number;
  totalPages: number;
  hasAttachments?: boolean;
  attachmentCount?: number;
  isReadOnly?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onSearch?: () => void;
  onFilter?: () => void;
  onShowQueries?: () => void;
  onShowAttachments?: () => void;
  onShowSourceDocs?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  isVerified?: boolean;
}

export default function FormToolbar({
  totalFields,
  completedFields,
  openQueries,
  timeSpent,
  currentPage,
  totalPages,
  hasAttachments,
  attachmentCount = 0,
  isReadOnly,
  onPrevious,
  onNext,
  onSearch,
  onFilter,
  onShowQueries,
  onShowAttachments,
  onShowSourceDocs,
  hasPrevious,
  hasNext,
  isVerified
}: FormToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className={`p-1 rounded-md ${
                hasPrevious
                  ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className={`p-1 rounded-md ${
                hasNext
                  ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {isReadOnly && (
            <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Read Only
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle2 className={`h-4 w-4 ${
              completedFields === totalFields ? 'text-green-500' : 'text-gray-400'
            }`} />
            <span className="text-gray-600">
              {completedFields}/{totalFields} Fields
            </span>
          </div>

          {openQueries > 0 && (
            <button
              onClick={onShowQueries}
              className="flex items-center space-x-2 text-sm text-amber-600 hover:text-amber-700"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{openQueries} {openQueries === 1 ? 'Query' : 'Queries'}</span>
            </button>
          )}

          {hasAttachments && attachmentCount > 0 && (
            <button
              onClick={onShowAttachments}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <FileText className="h-4 w-4" />
              <span>{attachmentCount} {attachmentCount === 1 ? 'Attachment' : 'Attachments'}</span>
            </button>
          )}

          {timeSpent !== undefined && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(timeSpent)}</span>
            </div>
          )}

          {isVerified && (
            <div className="flex items-center space-x-2 text-sm text-purple-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onShowSourceDocs}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            title="View Source Documents"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={onSearch}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            title="Search Fields"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={onFilter}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            title="Filter Fields"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
