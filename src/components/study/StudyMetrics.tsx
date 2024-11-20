import React from 'react';
import { BarChart2, TrendingUp, Users, Calendar } from 'lucide-react';

export default function StudyMetrics() {
  return (
    <div className="space-y-6">
      {/* Enrollment Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-500" />
            Enrollment Progress
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Target: 500 participants</span>
            <span className="text-sm font-medium text-green-600">On Track</span>
          </div>
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-indigo-600">
                248 enrolled (49.6%)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600">
                252 remaining
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: "49.6%" }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
            ></div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4 border-t border-gray-200 pt-4">
          {[
            { label: 'Screening', value: '32', trend: '+5' },
            { label: 'Active', value: '248', trend: '+12' },
            { label: 'Completed', value: '156', trend: '+8' },
            { label: 'Withdrawn', value: '14', trend: '+1' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
              <div className="text-sm text-green-600">{stat.trend} this week</div>
            </div>
          ))}
        </div>
      </div>

      {/* Site Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
            Site Performance
          </h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-900">View Details</button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Site 001 - New York', enrollment: 85, queries: 12, completion: 92 },
            { name: 'Site 002 - Los Angeles', enrollment: 76, queries: 8, completion: 88 },
            { name: 'Site 003 - Chicago', enrollment: 92, queries: 5, completion: 95 }
          ].map((site) => (
            <div key={site.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{site.name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  site.completion >= 90 ? 'bg-green-100 text-green-800' :
                  site.completion >= 80 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {site.completion}% Complete
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <div className="text-sm text-gray-500">Enrollment</div>
                  <div className="text-lg font-medium text-gray-900">{site.enrollment}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Open Queries</div>
                  <div className="text-lg font-medium text-gray-900">{site.queries}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Data Quality</div>
                  <div className="text-lg font-medium text-gray-900">{site.completion}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
            Recent Activity
          </h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-900">View All</button>
        </div>
        <div className="flow-root">
          <ul className="-mb-8">
            {[
              { event: 'New participant enrolled', site: 'Site 001', time: '2 hours ago' },
              { event: 'Query resolved', site: 'Site 002', time: '4 hours ago' },
              { event: 'Protocol deviation reported', site: 'Site 003', time: '1 day ago' }
            ].map((activity, activityIdx) => (
              <li key={activityIdx}>
                <div className="relative pb-8">
                  {activityIdx !== 2 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                        <TrendingUp className="h-4 w-4 text-indigo-600" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {activity.event} <span className="font-medium text-gray-900">({activity.site})</span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}