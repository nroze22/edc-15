import React from 'react';
import { X, Download, Save } from 'lucide-react';

interface CRFFormPreviewProps {
  templateId: string;
  onClose: () => void;
}

export default function CRFFormPreview({ templateId, onClose }: CRFFormPreviewProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Form Preview</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {/* Handle download */}}
              className="text-gray-400 hover:text-gray-500"
            >
              <Download className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Form Preview Content */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Demographics Form</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject ID
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                    placeholder="Enter subject ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Race/Ethnicity
                  </label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm">
                    <option value="">Select race/ethnicity</option>
                    <option value="white">White</option>
                    <option value="black">Black or African American</option>
                    <option value="asian">Asian</option>
                    <option value="hispanic">Hispanic or Latino</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Close
          </button>
          <button
            onClick={() => {/* Handle save */}}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}