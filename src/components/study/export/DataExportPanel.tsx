import React, { useState } from 'react';
import { 
  Download,
  FileSpreadsheet,
  FileText,
  Settings,
  Table,
  CheckCircle2,
  AlertTriangle,
  Database,
  Filter,
  Eye,
  Save
} from 'lucide-react';
import DataMappingConfig from './DataMappingConfig';
import ExportPreview from './ExportPreview';
import ValidationResults from './ValidationResults';
import { useExportStore } from '../../../store/useExportStore';

type ExportFormat = 'sdtm' | 'adam' | 'excel' | 'csv';
type ExportStep = 'config' | 'preview' | 'validate' | 'export';

export default function DataExportPanel() {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('sdtm');
  const [currentStep, setCurrentStep] = useState<ExportStep>('config');
  const [showMappingConfig, setShowMappingConfig] = useState(false);
  
  const { 
    mappingConfig,
    validationResults,
    isValidating,
    isExporting,
    updateMapping,
    validateData,
    exportData
  } = useExportStore();

  const exportFormats = [
    { 
      id: 'sdtm',
      name: 'SDTM',
      description: 'Study Data Tabulation Model (CDISC)',
      icon: Database,
      domains: ['DM', 'AE', 'CM', 'LB', 'VS', 'EX']
    },
    { 
      id: 'adam',
      name: 'ADaM',
      description: 'Analysis Data Model (CDISC)',
      icon: Table,
      datasets: ['ADSL', 'ADAE', 'ADLB', 'ADVS']
    },
    { 
      id: 'excel',
      name: 'Excel Workbook',
      description: 'Multiple sheets with raw and derived data',
      icon: FileSpreadsheet
    },
    { 
      id: 'csv',
      name: 'CSV Archive',
      description: 'Separate CSV files for each domain',
      icon: FileText
    }
  ];

  const handleExport = async () => {
    if (currentStep === 'config') {
      const isValid = await validateData(selectedFormat);
      if (isValid) {
        setCurrentStep('preview');
      }
    } else if (currentStep === 'preview') {
      setCurrentStep('validate');
    } else if (currentStep === 'validate') {
      await exportData(selectedFormat);
      setCurrentStep('export');
    }
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Export Study Data</h3>
          <button
            onClick={() => setShowMappingConfig(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 mr-1.5" />
            Configure Mapping
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {exportFormats.map((format) => (
            <div
              key={format.id}
              onClick={() => setSelectedFormat(format.id as ExportFormat)}
              className={`relative rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                selectedFormat === format.id
                  ? 'border-talosix-blue bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <format.icon className={`h-6 w-6 ${
                  selectedFormat === format.id ? 'text-talosix-blue' : 'text-gray-400'
                }`} />
                {selectedFormat === format.id && (
                  <CheckCircle2 className="h-5 w-5 text-talosix-blue" />
                )}
              </div>
              <h4 className="text-sm font-medium text-gray-900">{format.name}</h4>
              <p className="mt-1 text-xs text-gray-500">{format.description}</p>
              {'domains' in format && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    {format.domains.join(', ')}
                  </span>
                </div>
              )}
              {'datasets' in format && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    {format.datasets.join(', ')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      {currentStep === 'config' && mappingConfig && (
        <DataMappingConfig
          format={selectedFormat}
          config={mappingConfig}
          onUpdate={updateMapping}
        />
      )}

      {currentStep === 'preview' && (
        <ExportPreview format={selectedFormat} />
      )}

      {currentStep === 'validate' && validationResults && (
        <ValidationResults results={validationResults} />
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        {currentStep !== 'config' && (
          <button
            onClick={() => setCurrentStep(prev => {
              if (prev === 'preview') return 'config';
              if (prev === 'validate') return 'preview';
              return prev;
            })}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
        )}
        <button
          onClick={handleExport}
          disabled={isValidating || isExporting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90 disabled:opacity-50"
        >
          {isValidating ? (
            <>Validating...</>
          ) : isExporting ? (
            <>Exporting...</>
          ) : currentStep === 'config' ? (
            <>
              <Eye className="h-4 w-4 mr-1.5" />
              Preview Export
            </>
          ) : currentStep === 'preview' ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Validate Data
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1.5" />
              Download Export
            </>
          )}
        </button>
      </div>

      {/* Mapping Configuration Modal */}
      {showMappingConfig && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Configure Data Mapping
              </h3>
              {/* Add mapping configuration UI */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}