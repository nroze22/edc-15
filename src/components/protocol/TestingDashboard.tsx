import React, { useState } from 'react';
import { 
  PlayCircle, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  BarChart2,
  Clock,
  RefreshCw
} from 'lucide-react';

interface TestResult {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  details: string;
  timestamp: string;
}

interface TestingDashboardProps {
  onRunTests: () => void;
  onGenerateData: () => void;
}

export default function TestingDashboard({ onRunTests, onGenerateData }: TestingDashboardProps) {
  const [testResults] = useState<TestResult[]>([
    {
      id: '1',
      type: 'success',
      message: 'All required fields properly validated',
      details: 'Validation rules working as expected',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      type: 'warning',
      message: 'Potential performance impact',
      details: 'Large number of conditional logic rules may affect form load time',
      timestamp: '2 minutes ago'
    },
    {
      id: '3',
      type: 'error',
      message: 'Cross-field validation error',
      details: 'Date range validation fails when end date is before start date',
      timestamp: '2 minutes ago'
    }
  ]);

  const stats = [
    { name: 'Test Cases', value: '24', trend: '+3' },
    { name: 'Pass Rate', value: '96%', trend: '+2.3%' },
    { name: 'Avg Response Time', value: '1.2s', trend: '-0.3s' },
    { name: 'Data Quality Score', value: '98%', trend: '+1.5%' }
  ];

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Form Testing</h3>
            <p className="mt-1 text-sm text-gray-500">
              Validate form behavior and data quality
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onGenerateData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Generate Test Data
            </button>
            <button
              onClick={onRunTests}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlayCircle className="h-4 w-4 mr-1.5" />
              Run Tests
            </button>
          </div>
        </div>

        {/* Test Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {stat.value}
                </div>
                <div className="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 md:mt-2 lg:mt-0">
                  {stat.trend}
                </div>
              </dd>
            </div>
          ))}
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {testResults.map((result) => (
            <div
              key={result.id}
              className={`rounded-lg border p-4 ${
                result.type === 'success' ? 'border-green-200 bg-green-50' :
                result.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {result.type === 'success' && (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  )}
                  {result.type === 'warning' && (
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  )}
                  {result.type === 'error' && (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${
                    result.type === 'success' ? 'text-green-800' :
                    result.type === 'warning' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {result.message}
                  </h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>{result.details}</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {result.timestamp}
                  </div>
                </div>
                {(result.type === 'warning' || result.type === 'error') && (
                  <button className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    Fix Issue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
            Performance Metrics
          </h3>
        </div>
        {/* Add performance charts/metrics here */}
      </div>
    </div>
  );
}