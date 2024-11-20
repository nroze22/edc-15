import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { ArrowLeft, ArrowRight, Save, Download, Eye, FileText, Calendar } from 'lucide-react';
import StudyScheduleGrid from './StudyScheduleGrid';
import { useProtocolStore } from '../../store/useProtocolStore';

interface FinalReviewProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function FinalReview({ onComplete, onBack }: FinalReviewProps) {
  const [activeTab, setActiveTab] = useState<'protocol' | 'schedule'>('protocol');
  const { finalDocuments } = useProtocolStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: finalDocuments?.protocol || '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[500px] p-4',
      },
    },
  });

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      // Save the updated protocol content
      // This would typically update the store or make an API call
    }
  };

  const handleDownload = () => {
    if (editor) {
      const content = editor.getHTML();
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'protocol.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Final Protocol Review</h3>
            <p className="mt-1 text-sm text-gray-500">
              Review and edit the optimized protocol before proceeding to CRF design
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab(activeTab === 'protocol' ? 'schedule' : 'protocol')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {activeTab === 'protocol' ? (
                <>
                  <Calendar className="h-4 w-4 mr-1.5" />
                  View Schedule
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-1.5" />
                  View Protocol
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'protocol' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${
                  editor?.isActive('bold')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Bold
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${
                  editor?.isActive('italic')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Italic
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded ${
                  editor?.isActive('heading', { level: 2 })
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Heading
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${
                  editor?.isActive('bulletList')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Bullet List
              </button>
            </div>
          </div>
          <EditorContent editor={editor} />
        </div>
      ) : (
        <StudyScheduleGrid schedule={finalDocuments?.schedule} />
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </button>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Draft
          </button>
          <button
            onClick={onComplete}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90"
          >
            Continue to CRF Design
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}