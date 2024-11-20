import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { Document, Page } from 'react-pdf';
import type { ExtractionResult, ExtractedEntity } from '../../services/documentExtraction';
import { documentExtractionService } from '../../services/documentExtraction';

interface DocumentProcessorProps {
  onExtraction: (result: ExtractionResult) => void;
}

export default function DocumentProcessor({ onExtraction }: DocumentProcessorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [previewText, setPreviewText] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setIsProcessing(true);
    setError(null);

    try {
      if (file.type === 'application/pdf') {
        // For PDF preview
        setPreviewText('');
      } else {
        // For text files
        const text = await file.text();
        setPreviewText(text);
      }

      const result = await documentExtractionService.processDocument(file);
      onExtraction(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error processing document');
    } finally {
      setIsProcessing(false);
    }
  }, [onExtraction]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-talosix-blue bg-blue-50'
            : 'border-gray-300 hover:border-talosix-blue'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Upload className={`mx-auto h-12 w-12 ${
            isDragActive ? 'text-talosix-blue' : 'text-gray-400'
          }`} />
          <div className="text-sm text-gray-600">
            <p className="font-medium">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag and drop a file here, or click to select'}
            </p>
            <p className="mt-1">Support for PDF and TXT files</p>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-talosix-blue mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Processing document...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Document Preview */}
      {file && !isProcessing && !error && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-talosix-blue mr-2" />
                <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Document Preview</span>
              </div>
            </div>
          </div>

          <div className="p-4 max-h-[600px] overflow-y-auto">
            {file.type === 'application/pdf' ? (
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="mx-auto"
              >
                <Page
                  pageNumber={pageNumber}
                  width={600}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
                {numPages && numPages > 1 && (
                  <div className="mt-4 flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                      disabled={pageNumber <= 1}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {pageNumber} of {numPages}
                    </span>
                    <button
                      onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                      disabled={pageNumber >= numPages}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </Document>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {previewText}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}