import React, { useState } from 'react';
import { Download, Upload, History } from 'lucide-react';
import type { CRFForm } from '../../services/crfService';
import DocumentReviewModal from './DocumentReviewModal';
import { documentService } from '../../services/documentService';

interface CRFFormPreviewProps {
  form: CRFForm;
  onUpdate?: (form: CRFForm) => void;
}

export default function CRFFormPreview({ form, onUpdate }: CRFFormPreviewProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [documentHistory, setDocumentHistory] = useState<Array<{
    timestamp: string;
    author: string;
    changes: number;
  }>>([]);

  const handleExport = async () => {
    try {
      const buffer = await documentService.exportToWord(
        JSON.stringify(form, null, 2),
        form.annotations
      );
      
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.name.toLowerCase().replace(/\s+/g, '-')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting form:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export to Word
          </button>
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            Review Changes
          </button>
        </div>

        {documentHistory.length > 0 && (
          <button
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <History className="h-4 w-4 mr-1.5" />
            {documentHistory.length} revisions
          </button>
        )}
      </div>

      {/* Form Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Render your form preview here */}
      </div>

      {/* Document Review Modal */}
      {showReviewModal && (
        <DocumentReviewModal
          originalContent={JSON.stringify(form, null, 2)}
          onClose={() => setShowReviewModal(false)}
          onApplyChanges={(content, changes) => {
            // Handle applying changes to the form
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
}