import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface ImportModalProps {
  onClose: () => void;
}

export default function ImportModal({ onClose }: ImportModalProps) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<any>(null);

  const requiredFields = [
    'participantId',
    'firstName',
    'lastName',
    'email',
    'dateOfBirth',
    'gender',
    'site'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      // Simulate header detection
      setTimeout(() => {
        setMappings({
          participantId: 'Subject ID',
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email Address',
          dateOfBirth: 'DOB',
          gender: 'Gender',
          site: 'Site ID'
        });
        setStep(2);
      }, 1000);
    }
  };

  const handleValidate = () => {
    // Simulate validation
    setTimeout(() => {
      setValidationResults({
        total: 100,
        valid: 98,
        warnings: [
          'Row 45: Missing optional field "phone"',
          'Row 67: Date format might need review'
        ],
        errors: [
          'Row 23: Invalid email format',
          'Row 89: Missing required field "site"'
        ]
      });
      setStep(3);
    }, 1500);
  };

  const handleImport = () => {
    // Simulate import
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Import Participants</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bulk import participants from CSV or Excel files
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            {[
              { num: 1, text: 'Upload File' },
              { num: 2, text: 'Map Fields' },
              { num: 3, text: 'Validate' },
              { num: 4, text: 'Import' }
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= s.num ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step >= s.num ? 'text-indigo-600 font-medium' : 'text-gray-500'
                  }`}>
                    {s.text}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step > s.num ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="text-center">
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-300" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <span className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileUpload}
                            accept=".csv,.xlsx,.xls"
                          />
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">CSV, Excel up to 10MB</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Map Your Fields
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Match your file columns to the required participant fields
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {requiredFields.map((field) => (
                  <div key={field} className="flex items-center space-x-4">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="w-2/3">
                      <select
                        value={mappings[field] || ''}
                        onChange={(e) => setMappings({ ...mappings, [field]: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Select column...</option>
                        <option value="Subject ID">Subject ID</option>
                        <option value="First Name">First Name</option>
                        <option value="Last Name">Last Name</option>
                        <option value="Email Address">Email Address</option>
                        <option value="DOB">DOB</option>
                        <option value="Gender">Gender</option>
                        <option value="Site ID">Site ID</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && validationResults && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Validation Results
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {validationResults.valid} of {validationResults.total} records are valid
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle2 className="h-8 w-8 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round((validationResults.valid / validationResults.total) * 100)}%
                        </div>
                        <div className="text-sm text-gray-500">Success Rate</div>
                      </div>
                    </div>
                  </div>

                  {validationResults.warnings.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-yellow-800">Warnings</h4>
                      <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                        {validationResults.warnings.map((warning: string, i: number) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationResults.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-red-800">Errors</h4>
                      <ul className="mt-2 text-sm text-red-700 space-y-1">
                        {validationResults.errors.map((error: string, i: number) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={step === 2 ? handleValidate : step === 3 ? handleImport : () => setStep(step + 1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {step === 3 ? 'Start Import' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}