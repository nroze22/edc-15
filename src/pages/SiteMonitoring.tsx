import React, { useState } from 'react';
import { LineChart, Plus, Search, Filter, MoreVertical, Calendar, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface MonitoringVisit {
  id: string;
  type: 'site_initiation' | 'interim_monitoring' | 'close_out';
  status: 'scheduled' | 'completed' | 'cancelled';
  date: string;
  monitor: string;
  findings: number;
  criticalFindings: number;
  actionItems: number;
  completedActions: number;
}

export default function SiteMonitoring() {
  const [visits, setVisits] = useState<MonitoringVisit[]>([
    {
      id: '001',
      type: 'site_initiation',
      status: 'completed',
      date: '2024-01-15',
      monitor: 'Dr. Emily Brown',
      findings: 5,
      criticalFindings: 0,
      actionItems: 8,
      completedActions: 8
    },
    {
      id: '002',
      type: 'interim_monitoring',
      status: 'scheduled',
      date: '2024-03-01',
      monitor: 'Dr. Emily Brown',
      findings: 0,
      criticalFindings: 0,
      actionItems: 0,
      completedActions: 0
    },
  ]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Site Monitoring</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage site monitoring visits and findings
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Visit
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Visits', value: '6', icon: LineChart, color: 'text-blue-600' },
          { label: 'Open Findings', value: '3', icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'Critical Findings', value: '0', icon: XCircle, color: 'text-red-600' },
          { label: 'Completed Actions', value: '12', icon: CheckCircle2, color: 'text-green-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={clsx('h-8 w-8', stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search monitoring visits..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Monitoring Visits */}
      <div className="space-y-4">
        {visits.map((visit) => (
          <div key={visit.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {visit.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    <span className={clsx(
                      'ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      {
                        'bg-green-100 text-green-800': visit.status === 'completed',
                        'bg-blue-100 text-blue-800': visit.status === 'scheduled',
                        'bg-gray-100 text-gray-800': visit.status === 'cancelled',
                      }
                    )}>
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Visit Date</p>
                      <p className="mt-1 flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                        {new Date(visit.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monitor</p>
                      <p className="mt-1 text-sm text-gray-900">{visit.monitor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Findings</p>
                      <div className="mt-1 flex items-center space-x-4">
                        <span className="text-sm text-gray-900">{visit.findings} Total</span>
                        {visit.criticalFindings > 0 && (
                          <span className="text-sm text-red-600 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {visit.criticalFindings} Critical
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Action Items</p>
                      <div className="mt-1">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{visit.completedActions}/{visit.actionItems} Completed</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={clsx(
                              'rounded-full h-2',
                              {
                                'bg-green-500': visit.completedActions === visit.actionItems,
                                'bg-blue-500': visit.completedActions < visit.actionItems,
                              }
                            )}
                            style={{ width: `${(visit.completedActions / visit.actionItems) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {visit.status === 'completed' && (
                    <div className="mt-4 flex items-center space-x-4">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Report
                      </button>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View Action Items
                      </button>
                    </div>
                  )}
                </div>

                <button className="ml-4 text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
