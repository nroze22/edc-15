import React from 'react';
import { FileText, Shield, Database, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CRFAnnotationsProps {
  template: {
    name: string;
    fields: string[];
    annotations: {
      regulatory: string[];
      dataManagement: string[];
      quality: string[];
    };
  };
}

export default function CRFAnnotations({ template }: CRFAnnotationsProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Form Annotations</h3>
      </div>

      <div className="space-y-6">
        {/* Regulatory Compliance */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-blue-500 mr-2" />
            <h4 className="text-sm font-medium text-blue-900">Regulatory Compliance</h4>
          </div>
          <div className="space-y-3">
            {template.annotations.regulatory.map((item, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-blue-900">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-purple-500 mr-2" />
            <h4 className="text-sm font-medium text-purple-900">Data Management</h4>
          </div>
          <div className="space-y-3">
            {template.annotations.dataManagement.map((item, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-purple-900">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Control */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="text-sm font-medium text-green-900">Quality Control</h4>
          </div>
          <div className="space-y-3">
            {template.annotations.quality.map((item, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm text-green-900">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Field-specific Annotations */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Field Annotations</h4>
          </div>
          <div className="space-y-4">
            {template.fields.map((field) => (
              <div key={field} className="border border-gray-200 rounded-lg p-4 bg-white">
                <h5 className="text-sm font-medium text-gray-900 mb-2">{field}</h5>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 w-24">Validation:</span>
                    <span className="text-xs text-gray-900">Required field with format validation</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 w-24">Coding:</span>
                    <span className="text-xs text-gray-900">CDASH standard terminology</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 w-24">Source:</span>
                    <span className="text-xs text-gray-900">Direct entry with audit trail</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}