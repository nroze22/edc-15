import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, ArrowLeft, ArrowRight } from 'lucide-react';

interface DocumentUploaderProps {
  onUpload: (files: File[]) => void;
  onBack: () => void;
}

export default function DocumentUploader({ onUpload, onBack }: DocumentUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onUpload(uploadedFiles);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Upload Patient Documents
        </h3>

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
                  ? 'Drop the files here'
                  : 'Drag and drop files here, or click to select'}
              </p>
              <p className="mt-1">
                Support for PDF, DOC, DOCX, and TXT files
              </p>
            </div>
          </div>
        </div>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium text-gray-900">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-900">{file.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploadedFiles.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Process Documents
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}