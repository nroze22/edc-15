import React, { useState } from 'react';
import { Play, Settings, AlertTriangle } from 'lucide-react';
import type { SimulationConfig as SimConfig } from '../../services/simulationService';

interface SimulationConfigProps {
  onStartSimulation: (config: SimConfig) => void;
  isLoading?: boolean;
}

export default function SimulationConfig({ onStartSimulation, isLoading }: SimulationConfigProps) {
  const [config, setConfig] = useState<SimConfig>({
    numberOfPatients: 100,
    studyDuration: 12,
    visitFrequency: 4,
    dropoutRate: 15,
    dataQualityIssues: {
      missingData: 5,
      outOfRange: 3,
      inconsistentFormat: 2
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSimulation(config);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Form Testing Configuration</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure test data generation and simulation parameters
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Study Parameters */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Study Parameters</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Patients
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={config.numberOfPatients}
                  onChange={(e) => setConfig({
                    ...config,
                    numberOfPatients: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Study Duration (months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.studyDuration}
                  onChange={(e) => setConfig({
                    ...config,
                    studyDuration: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Visit Frequency (weeks)
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={config.visitFrequency}
                  onChange={(e) => setConfig({
                    ...config,
                    visitFrequency: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dropout Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.dropoutRate}
                  onChange={(e) => setConfig({
                    ...config,
                    dropoutRate: parseInt(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Data Quality Parameters */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Data Quality Parameters</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
                <p className="text-sm text-yellow-700">
                  These parameters control the rate of simulated data quality issues to help test form validation and data cleaning processes.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Missing Data Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.dataQualityIssues.missingData}
                  onChange={(e) => setConfig({
                    ...config,
                    dataQualityIssues: {
                      ...config.dataQualityIssues,
                      missingData: parseInt(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Out of Range Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.dataQualityIssues.outOfRange}
                  onChange={(e) => setConfig({
                    ...config,
                    dataQualityIssues: {
                      ...config.dataQualityIssues,
                      outOfRange: parseInt(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Inconsistent Format Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.dataQualityIssues.inconsistentFormat}
                  onChange={(e) => setConfig({
                    ...config,
                    dataQualityIssues: {
                      ...config.dataQualityIssues,
                      inconsistentFormat: parseInt(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1.5" />
                  Start Simulation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}