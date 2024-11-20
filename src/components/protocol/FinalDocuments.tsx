import React from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import ProtocolEditor from './ProtocolEditor';
import StudyScheduleGrid from './StudyScheduleGrid';
import type { FinalDocuments as FinalDocsType } from '../../services/ai';

interface FinalDocumentsProps {
  documents: FinalDocsType;
  onEdit: (content: string) => void;
}

export default function FinalDocuments({ documents, onEdit }: FinalDocumentsProps) {
  const handleDownload = (type: 'protocol' | 'schedule') => {
    const content = type === 'protocol' 
      ? documents.protocol
      : JSON.stringify(documents.schedule, null, 2);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'protocol' ? 'protocol.html' : 'schedule.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Protocol Document */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-talosix-blue mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Final Protocol</h3>
          </div>
          <button
            onClick={() => handleDownload('protocol')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </button>
        </div>
        <ProtocolEditor
          content={documents.protocol}
          onChange={onEdit}
        />
      </div>

      {/* Study Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-talosix-blue mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Study Schedule</h3>
          </div>
          <button
            onClick={() => handleDownload('schedule')}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download
          </button>
        </div>
        <StudyScheduleGrid schedule={documents.schedule} />
      </div>
    </div>
  );
}