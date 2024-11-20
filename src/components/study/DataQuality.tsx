import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  BarChart2,
  FileText,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

export default function DataQuality() {
  const metrics = [
    {
      name: 'Data Completion',
      value: '94.2%',
      trend: '+2.1%',
      status: 'success'
    },
    {
      name: 'Query Rate',
      value: '3.8%',
      trend: '-0.5%',
      status: 'success'
    },
    {
      name: 'Missing Data',
      value: '2.3%',
      trend: '-0.8%',
      status: 'warning'
    },
    {
      name: 'SDV Required',
      value: '15.6%',
      trend: '+5.2%',
      status: 'error'
    }
  ];

  const formMetrics = [
    {
      name: 'Demographics',
      completion: 98,
      queries: 2,
      missing: 0,
      status: 'success'
    },
    {
      name: 'Vital Signs',
      completion: 92,
      queries: 5,
      missing: 3,
      status: 'warning'
    },
    {
      name: 'Adverse Events',
      completion: 88,
      queries: 12,
      missing: 4,
      status: 'error'
    },
    {
      name: 'Lab Results',
      completion: 95,
      queries: 3,
      missing: 2,
      status: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-500">{metric.name}</h4>
              {metric.status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {metric.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
              {metric.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            </div>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              <p className={`ml-2 text-sm font-medium ${
                metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Form Quality Analysis */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Form Quality Analysis</h3>
              <p className="mt-1 text-sm text-gray-500">
                Detailed quality metrics by form type
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {formMetrics.map((form) => (
              <div key={form.name} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">{form.name}</h4>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    form.status === 'success' ? 'bg-green-100 text-green-800' :
                    form.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {form.completion}% Complete
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Completion</span>
                      <span className="text-sm font-medium text-gray-900">{form.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${form.completion}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Open Queries</span>
                      <span className="text-sm font-medium text-gray-900">{form.queries}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(form.queries / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Missing Data</span>
                      <span className="text-sm font-medium text-gray-900">{form.missing}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${form.missing}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
              Quality Trends
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              30-day quality metrics trend analysis
            </p>
          </div>
        </div>
        {/* Add trend charts here */}
      </div>
    </div>
  );
}