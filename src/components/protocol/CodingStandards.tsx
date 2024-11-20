import React from 'react';
import { Database, Shield } from 'lucide-react';

interface CodingStandardsProps {
  field: any;
  onUpdate: (updates: any) => void;
}

export default function CodingStandards({ field, onUpdate }: CodingStandardsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Coding Standard
        </label>
        <select
          value={field.codingStandard || ''}
          onChange={(e) => onUpdate({ codingStandard: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
        >
          <option value="">Select standard...</option>
          <option value="CDASH">CDASH</option>
          <option value="SDTM">SDTM</option>
          <option value="ADaM">ADaM</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Domain
        </label>
        <select
          value={field.domain || ''}
          onChange={(e) => onUpdate({ domain: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
        >
          <option value="">Select domain...</option>
          <option value="DM">Demographics (DM)</option>
          <option value="VS">Vital Signs (VS)</option>
          <option value="LB">Laboratory Test Results (LB)</option>
          <option value="AE">Adverse Events (AE)</option>
          <option value="CM">Concomitant Medications (CM)</option>
          <option value="EX">Exposure (EX)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Variable
        </label>
        <select
          value={field.variable || ''}
          onChange={(e) => onUpdate({ variable: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
        >
          <option value="">Select variable...</option>
          {field.domain === 'DM' && (
            <>
              <option value="SUBJID">Subject Identifier (SUBJID)</option>
              <option value="RFSTDTC">Subject Reference Start Date (RFSTDTC)</option>
              <option value="RFENDTC">Subject Reference End Date (RFENDTC)</option>
              <option value="SITEID">Study Site Identifier (SITEID)</option>
            </>
          )}
          {field.domain === 'VS' && (
            <>
              <option value="VSTESTCD">Vital Signs Test Short Name (VSTESTCD)</option>
              <option value="VSORRES">Result or Finding in Original Units (VSORRES)</option>
              <option value="VSORRESU">Original Units (VSORRESU)</option>
              <option value="VSDTC">Date/Time of Measurements (VSDTC)</option>
            </>
          )}
          {/* Add more domain-specific variables as needed */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Controlled Terminology
        </label>
        <select
          value={field.terminology || ''}
          onChange={(e) => onUpdate({ terminology: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
        >
          <option value="">Select terminology...</option>
          <option value="CDISC/SDTM">CDISC/SDTM Terminology</option>
          <option value="MedDRA">MedDRA</option>
          <option value="SNOMED">SNOMED CT</option>
          <option value="LOINC">LOINC</option>
          <option value="WHO-DD">WHO Drug Dictionary</option>
        </select>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Database className="h-5 w-5 text-blue-500 mr-2" />
          <h4 className="text-sm font-medium text-blue-900">Coding Information</h4>
        </div>
        <div className="space-y-2 text-sm text-blue-700">
          <p>
            <strong>Standard:</strong> {field.codingStandard || 'Not specified'}
          </p>
          <p>
            <strong>Domain:</strong> {field.domain || 'Not specified'}
          </p>
          <p>
            <strong>Variable:</strong> {field.variable || 'Not specified'}
          </p>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-purple-500 mr-2" />
          <h4 className="text-sm font-medium text-purple-900">Compliance</h4>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="gdpr"
              checked={field.compliance?.gdpr || false}
              onChange={(e) => onUpdate({
                compliance: { ...field.compliance, gdpr: e.target.checked }
              })}
              className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="gdpr" className="ml-2 text-sm text-purple-700">
              GDPR Compliant
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hipaa"
              checked={field.compliance?.hipaa || false}
              onChange={(e) => onUpdate({
                compliance: { ...field.compliance, hipaa: e.target.checked }
              })}
              className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="hipaa" className="ml-2 text-sm text-purple-700">
              HIPAA Compliant
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="part11"
              checked={field.compliance?.part11 || false}
              onChange={(e) => onUpdate({
                compliance: { ...field.compliance, part11: e.target.checked }
              })}
              className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="part11" className="ml-2 text-sm text-purple-700">
              21 CFR Part 11 Compliant
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}