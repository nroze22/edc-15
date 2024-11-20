import React from 'react';
import { Eye, Download } from 'lucide-react';

interface FormPreviewProps {
  form: any;
}

export default function FormPreview({ form }: FormPreviewProps) {
  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
          />
        );
      case 'number':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="0"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
            />
            {field.units && field.units.length > 0 && (
              <select className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors">
                {field.units.map((unit: string) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            )}
          </div>
        );
      case 'select':
        return (
          <select className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors">
            <option value="">Select an option...</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-2 border-gray-200 text-talosix-blue focus:ring-talosix-blue"
                />
                <label className="ml-2 text-sm text-gray-700">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  name={field.id}
                  className="h-5 w-5 border-2 border-gray-200 text-talosix-blue focus:ring-talosix-blue"
                />
                <label className="ml-2 text-sm text-gray-700">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'textarea':
        return (
          <textarea
            rows={4}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors resize-none"
          />
        );
      default:
        return (
          <div className="text-sm text-gray-500 italic">
            Preview not available for this field type
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{form.name}</h2>
              <p className="mt-1 text-base text-gray-600">{form.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Eye className="h-4 w-4 mr-1.5" />
                Preview
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple">
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {form.fields.map((field: any) => (
              <div key={field.id} className="space-y-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-900">
                    {field.name}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                  {field.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {field.description}
                    </p>
                  )}
                </label>
                <div className="mt-1">
                  {renderField(field)}
                </div>
                {field.helpText && (
                  <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}