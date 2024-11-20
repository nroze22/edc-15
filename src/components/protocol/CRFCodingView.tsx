import React from 'react';
import { Code, Database, ArrowRight, Table } from 'lucide-react';

interface CRFCodingViewProps {
  template: {
    name: string;
    fields: string[];
    codingStandard: string;
    domain: string;
  };
}

export default function CRFCodingView({ template }: CRFCodingViewProps) {
  const codingExamples = {
    CDASH: {
      DM: {
        SUBJID: 'Subject Identifier',
        BRTHDTC: 'Date/Time of Birth',
        SEX: 'Sex',
        RACE: 'Race'
      },
      VS: {
        VSDTC: 'Date/Time of Vital Signs',
        VSTEST: 'Vital Signs Test Name',
        VSORRES: 'Result or Finding in Original Units',
        VSSTAT: 'Completion Status'
      },
      AE: {
        AEDTC: 'Date/Time of Adverse Event',
        AETERM: 'Reported Term for the Adverse Event',
        AESEV: 'Severity/Intensity',
        AEOUT: 'Outcome of Adverse Event'
      }
    }
  };

  const domainMappings = codingExamples[template.codingStandard as keyof typeof codingExamples]?.[template.domain as keyof typeof codingExamples['CDASH']] || {};

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">CDISC Coding Standards</h3>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {template.codingStandard}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {template.domain}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Standard Overview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Domain Overview</h4>
          </div>
          <div className="prose prose-sm max-w-none text-gray-500">
            <p>This form implements the {template.codingStandard} standard for {template.domain} domain, ensuring compatibility with CDISC submission requirements.</p>
          </div>
        </div>

        {/* Variable Mapping */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Variable Mapping</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Field
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variable
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(domainMappings).map(([variable, description]) => (
                    <tr key={variable}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {template.fields[0]} {/* Map to actual field */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {variable}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Text
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Controlled Terminology */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Controlled Terminology</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Code Lists</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowRight className="h-4 w-4 mr-1.5" />
                    CDISC Terminology
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowRight className="h-4 w-4 mr-1.5" />
                    MedDRA (for Adverse Events)
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowRight className="h-4 w-4 mr-1.5" />
                    SNOMED CT
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Formats</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowRight className="h-4 w-4 mr-1.5" />
                    ISO 8601 Dates
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowRight className="h-4 w-4 mr-1.5" />
                    Standard Units
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowRight className="h-4 w-4 mr-1.5" />
                    Numeric Precision
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}