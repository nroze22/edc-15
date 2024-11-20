import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, Settings } from 'lucide-react';
import type { CRFOptimization } from '../../services/crfService';

interface OptimizationPanelProps {
  optimizations: CRFOptimization[];
  onApply: (optimization: CRFOptimization) => void;
}

export default function OptimizationPanel({
  optimizations,
  onApply
}: OptimizationPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Suggested Optimizations</h3>
          <p className="mt-1 text-sm text-gray-500">
            AI-generated suggestions to improve your forms
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {optimizations.length} suggestions
        </span>
      </div>

      <div className="space-y-4">
        {optimizations.map((optimization) => (
          <div
            key={optimization.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-talosix-blue transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <Settings className={`h-5 w-5 mr-2 ${
                    optimization.type === 'layout' ? 'text-blue-500' :
                    optimization.type === 'validation' ? 'text-green-500' :
                    optimization.type === 'coding' ? 'text-purple-500' :
                    'text-orange-500'
                  }`} />
                  <h4 className="text-sm font-medium text-gray-900">
                    {optimization.description}
                  </h4>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    optimization.impact === 'high'
                      ? 'bg-red-100 text-red-800'
                      : optimization.impact === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {optimization.impact} impact
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-red-600">
                    <AlertTriangle className="inline-block h-4 w-4 mr-1" />
                    {optimization.currentIssue}
                  </div>
                  <div className="mt-1 text-sm text-green-600">
                    <CheckCircle2 className="inline-block h-4 w-4 mr-1" />
                    {optimization.suggestedChange}
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  optimization.effort === 'high'
                    ? 'bg-red-100 text-red-800'
                    : optimization.effort === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {optimization.effort} effort
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-xs font-medium text-gray-700 mb-2">Benefits</h5>
              <ul className="space-y-1">
                {optimization.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-xs text-gray-500">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => onApply(optimization)}
                disabled={!optimization.autoApplicable}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-talosix-blue hover:bg-talosix-purple disabled:opacity-50"
              >
                {optimization.autoApplicable ? 'Apply Change' : 'Manual Change Required'}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}