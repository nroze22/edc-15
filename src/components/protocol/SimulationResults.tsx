import React from 'react';
import { BarChart2, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { SimulationResult } from '../../services/simulationService';

interface SimulationResultsProps {
  results: SimulationResult;
  onDownloadData: () => void;
  onApplyRecommendation: (id: string) => void;
}

export default function SimulationResults({
  results,
  onDownloadData,
  onApplyRecommendation
}: SimulationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Simulation Results</h3>
            <p className="mt-1 text-sm text-gray-500">
              Analysis of form performance and data quality
            </p>
          </div>
          <button
            onClick={onDownloadData}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Download Test Data
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Completion Rate</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-semibold text-gray-900">
                {results.summary.dataQualityScore}%
              </div>
              <div className="text-sm text-gray-500">
                overall score
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Data Issues</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-semibold text-gray-900">
                {results.dataQualityMetrics.validationFailures}
              </div>
              <div className="text-sm text-gray-500">
                validation failures
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Missing Data</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-semibold text-gray-900">
                {results.dataQualityMetrics.missingDataRate}%
              </div>
              <div className="text-sm text-gray-500">
                average rate
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Completion Time</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-semibold text-gray-900">
                {results.summary.averageCompletionTime}m
              </div>
              <div className="text-sm text-gray-500">
                average per form
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Data Quality Analysis</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Quality Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Missing Data Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {results.dataQualityMetrics.missingDataRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${results.dataQualityMetrics.missingDataRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Out of Range Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {results.dataQualityMetrics.outOfRangeRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${results.dataQualityMetrics.outOfRangeRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Field Analysis */}
          {results.fieldAnalysis.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Field Analysis</h4>
              <div className="space-y-4">
                {results.fieldAnalysis.map((field) => (
                  <div key={field.fieldId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{field.name}</span>
                      <span className="text-sm text-gray-500">ID: {field.fieldId}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Completion Rate</div>
                        <div className="text-lg font-medium text-gray-900">
                          {field.completionRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Error Rate</div>
                        <div className="text-lg font-medium text-gray-900">
                          {field.errorRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Avg Time</div>
                        <div className="text-lg font-medium text-gray-900">
                          {field.averageTimeToComplete}s
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}