import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { crfAI } from '../../services/crfAI';
import { useCRFStore } from '../../store/crfStore';

interface ValidationProps {
  onNext?: () => void;
}

const FormValidation: React.FC<ValidationProps> = ({ onNext }) => {
  const { currentForm, updateForm } = useCRFStore();
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [testData, setTestData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runValidation = async () => {
    if (!currentForm) return;
    
    setLoading(true);
    try {
      const results = await crfAI.validateForm(currentForm);
      setValidationResults(results);
    } catch (error) {
      console.error('Validation error:', error);
    }
    setLoading(false);
  };

  const generateTestData = async () => {
    if (!currentForm) return;
    
    setLoading(true);
    try {
      const data = await crfAI.generateTestData(currentForm);
      setTestData(data);
    } catch (error) {
      console.error('Test data generation error:', error);
    }
    setLoading(false);
  };

  const downloadTestData = () => {
    const csvContent = convertToCSV(testData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'test_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]));
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Form Validation</h2>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={runValidation}
            disabled={loading}
          >
            Run Validation
          </Button>
          <Button
            variant="outline"
            onClick={generateTestData}
            disabled={loading}
          >
            Generate Test Data
          </Button>
          {testData.length > 0 && (
            <Button
              variant="outline"
              onClick={downloadTestData}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Test Data
            </Button>
          )}
        </div>
      </div>

      {/* Validation Results */}
      <div className="grid grid-cols-1 gap-4">
        {validationResults.map((result, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {result.type === 'error' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : result.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="flex-grow">
                <h4 className="font-medium">
                  {result.field ? `${result.field}: ` : ''}
                  {result.message}
                </h4>
                {result.suggestion && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateForm(result.suggestion)}
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Test Data Preview */}
      {testData.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Test Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {Object.keys(testData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testData.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value: any, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FormValidation;
