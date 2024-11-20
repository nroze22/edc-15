import React, { useState } from 'react';
import { X, AlertTriangle, Check, FileText, Download, Upload } from 'lucide-react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import type { DocumentChange, ChangeAnalysis } from '../../services/documentService';
import { documentService } from '../../services/documentService';

interface DocumentReviewModalProps {
  originalContent: string;
  onClose: () => void;
  onApplyChanges: (content: string, acceptedChanges: DocumentChange[]) => void;
}

export default function DocumentReviewModal({
  originalContent,
  onClose,
  onApplyChanges
}: DocumentReviewModalProps) {
  const [newContent, setNewContent] = useState<string>('');
  const [changes, setChanges] = useState<DocumentChange[]>([]);
  const [analysis, setAnalysis] = useState<ChangeAnalysis | null>(null);
  const [selectedChanges, setSelectedChanges] = useState<Set<number>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { content, changes } = await documentService.importFromWord(file);
      setNewContent(content);
      setChanges(changes);
      
      setIsAnalyzing(true);
      const analysis = await documentService.analyzeChanges(originalContent, content, changes);
      setAnalysis(analysis);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error processing document:', error);
    }
  };

  const handleExport = async () => {
    try {
      const buffer = await documentService.exportToWord(originalContent, {});
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'crf-document.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting document:', error);
    }
  };

  const handleApplyChanges = () => {
    const acceptedChanges = Array.from(selectedChanges).map(index => changes[index]);
    onApplyChanges(newContent, acceptedChanges);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-talosix-blue mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Document Review</h3>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export to Word
            </button>
            <label className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              <Upload className="h-4 w-4 mr-1.5" />
              Upload Changes
              <input
                type="file"
                className="hidden"
                accept=".docx"
                onChange={handleFileUpload}
              />
            </label>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Changes and Analysis Panel */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {isAnalyzing ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-talosix-blue mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Analyzing changes...</p>
              </div>
            ) : analysis ? (
              <div className="flex-1 overflow-y-auto p-4">
                {/* Summary */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Change Summary</h4>
                  <p className="text-sm text-gray-500">{analysis.summary}</p>
                </div>

                {/* Potential Issues */}
                {analysis.potentialIssues.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Potential Issues</h4>
                    <div className="space-y-3">
                      {analysis.potentialIssues.map((issue, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            issue.severity === 'high' ? 'bg-red-50 border border-red-200' :
                            issue.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                            'bg-green-50 border border-green-200'
                          }`}
                        >
                          <div className="flex items-start">
                            <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                              issue.severity === 'high' ? 'text-red-500' :
                              issue.severity === 'medium' ? 'text-yellow-500' :
                              'text-green-500'
                            }`} />
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-900">{issue.description}</p>
                              <p className="mt-1 text-sm text-gray-500">{issue.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Changes List */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Detailed Changes</h4>
                  <div className="space-y-3">
                    {changes.map((change, index) => (
                      <div
                        key={index}
                        className="flex items-start p-3 rounded-lg border border-gray-200 hover:border-talosix-blue transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedChanges.has(index)}
                          onChange={() => {
                            const newSelected = new Set(selectedChanges);
                            if (newSelected.has(index)) {
                              newSelected.delete(index);
                            } else {
                              newSelected.add(index);
                            }
                            setSelectedChanges(newSelected);
                          }}
                          className="h-4 w-4 mt-1 text-talosix-blue border-gray-300 rounded focus:ring-talosix-blue"
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              change.type === 'addition' ? 'bg-green-100 text-green-800' :
                              change.type === 'deletion' ? 'bg-red-100 text-red-800' :
                              change.type === 'modification' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {change.type}
                            </span>
                            {change.author && (
                              <span className="ml-2 text-xs text-gray-500">
                                by {change.author}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-900">{change.content}</p>
                          {change.comment && (
                            <p className="mt-1 text-sm text-gray-500 italic">
                              "{change.comment}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">
                  Upload a modified document to see changes and analysis
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleApplyChanges}
                disabled={selectedChanges.size === 0}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4 mr-1.5" />
                Apply Selected Changes
              </button>
            </div>
          </div>

          {/* Diff Viewer */}
          <div className="flex-1 overflow-y-auto">
            <ReactDiffViewer
              oldValue={originalContent}
              newValue={newContent || originalContent}
              splitView={true}
              useDarkTheme={false}
              leftTitle="Original Document"
              rightTitle="Modified Document"
            />
          </div>
        </div>
      </div>
    </div>
  );
}