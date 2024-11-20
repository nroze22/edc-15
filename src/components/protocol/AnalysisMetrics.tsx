import React from 'react';
import { BarChart2, Brain, CheckCircle2 } from 'lucide-react';

interface AnalysisMetricsProps {
  metrics: {
    complexity: number;
    completeness: number;
    efficiency: number;
  };
}

export default function AnalysisMetrics({ metrics }: AnalysisMetricsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Analysis Metrics</h3>
      
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Protocol Complexity', value: metrics.complexity, icon: Brain },
          { label: 'Completeness Score', value: metrics.completeness, icon: CheckCircle2 },
          { label: 'Efficiency Rating', value: metrics.efficiency, icon: BarChart2 }
        ].map((metric) => (
          <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <metric.icon className="h-5 w-5 text-talosix-blue mr-2" />
              <span className="text-sm font-medium text-gray-900">{metric.label}</span>
            </div>
            <div className="mt-1">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-talosix-blue rounded-full"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {metric.value}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}