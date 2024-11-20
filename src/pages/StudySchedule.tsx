import React from 'react';
import { Calendar, Plus, Filter, Download } from 'lucide-react';

export default function StudySchedule() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Study Schedule</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track study visits, procedures, and timelines
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export Schedule
            </button>
            <button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Visit
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select className="form-select">
              <option>All Sites</option>
              <option>Site A</option>
              <option>Site B</option>
            </select>
            <select className="form-select">
              <option>All Visit Types</option>
              <option>Screening</option>
              <option>Treatment</option>
              <option>Follow-up</option>
            </select>
            <input
              type="date"
              className="form-input"
              placeholder="Start Date"
            />
            <input
              type="date"
              className="form-input"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="bg-gray-50 py-2 px-3">
                <span className="text-sm font-medium text-gray-900">{day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="bg-white min-h-[120px] p-2 relative hover:bg-gray-50"
              >
                <span className="text-sm text-gray-500">{i + 1}</span>
                {i === 5 && (
                  <div className="absolute top-8 left-2 right-2">
                    <div className="bg-blue-100 text-blue-800 rounded p-2 text-xs">
                      <div className="font-medium">Screening Visit</div>
                      <div className="text-blue-600">2 participants</div>
                    </div>
                  </div>
                )}
                {i === 12 && (
                  <div className="absolute top-8 left-2 right-2">
                    <div className="bg-green-100 text-green-800 rounded p-2 text-xs">
                      <div className="font-medium">Treatment Visit</div>
                      <div className="text-green-600">5 participants</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Visits */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Visits</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <li key={item}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            Treatment Visit - Week 4
                          </p>
                          <p className="text-sm text-gray-500">
                            3 participants scheduled
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Tomorrow
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}