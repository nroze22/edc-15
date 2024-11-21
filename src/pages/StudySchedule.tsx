import React, { useState } from 'react';
import { 
  Calendar, Plus, Filter, Download, ChevronLeft, ChevronRight, 
  Clock, Users, CheckCircle2, AlertCircle, Brain, TrendingUp,
  AlertTriangle, BarChart3, Calendar as CalendarIcon
} from 'lucide-react';

export default function StudySchedule() {
  const [selectedView, setSelectedView] = useState<'matrix' | 'calendar'>('matrix');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="space-y-8">
          {/* Header with better spacing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Study Schedule</h2>
                <p className="mt-2 text-base text-gray-600">
                  Comprehensive timeline of visits, procedures, and assessments
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export Schedule
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Visit
                </button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedView('matrix')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedView === 'matrix'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Matrix View
                </button>
                <button
                  onClick={() => setSelectedView('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedView === 'calendar'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Calendar View
                </button>
              </div>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {selectedView === 'matrix' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Visit Schedule Matrix</h3>
                      <div className="flex items-center space-x-4">
                        <select className="form-select text-sm">
                          <option>All Phases</option>
                          <option>Screening</option>
                          <option>Treatment</option>
                          <option>Follow-up</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                              Visit/Procedure
                            </th>
                            {['Screening', 'Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12'].map((visit) => (
                              <th key={visit} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex flex-col">
                                  <span>{visit}</span>
                                  <span className="text-gray-400 font-normal mt-1">±3 days</span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[
                            'Informed Consent',
                            'Physical Examination',
                            'Vital Signs',
                            'ECG',
                            'Blood Sample',
                            'Quality of Life',
                            'Adverse Events'
                          ].map((procedure, index) => (
                            <tr key={procedure} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {procedure}
                              </td>
                              {Array(6).fill(null).map((_, i) => (
                                <td key={i} className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {Math.random() > 0.3 ? (
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span className="text-xs text-gray-500">Required</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                                        <span className="text-xs text-gray-500">Optional</span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedView === 'calendar' && (
                <div className="space-y-6">
                  {/* Calendar Navigation */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-lg hover:bg-gray-100">
                          <ChevronLeft className="h-5 w-5 text-gray-500" />
                        </button>
                        <h3 className="text-lg font-medium text-gray-900">November 2024</h3>
                        <button className="p-2 rounded-lg hover:bg-gray-100">
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select className="form-select text-sm">
                          <option>All Sites</option>
                          <option>Site A</option>
                          <option>Site B</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="bg-gray-50 py-2 px-3">
                          <span className="text-sm font-medium text-gray-900">{day}</span>
                        </div>
                      ))}
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-white min-h-[140px] p-3 relative hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm text-gray-500">{i + 1}</span>
                          {i === 5 && (
                            <div className="absolute top-8 left-2 right-2">
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-xs cursor-pointer hover:bg-blue-100 transition-colors">
                                <div className="font-medium text-blue-800">Screening Visit</div>
                                <div className="flex items-center mt-1 text-blue-600">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>2 participants</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {i === 12 && (
                            <div className="absolute top-8 left-2 right-2">
                              <div className="bg-green-50 border border-green-100 rounded-lg p-2 text-xs cursor-pointer hover:bg-green-100 transition-colors">
                                <div className="font-medium text-green-800">Treatment Visit</div>
                                <div className="flex items-center mt-1 text-green-600">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>5 participants</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Visits Panel */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Visits</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: 'Treatment Visit - Week 4',
                          participants: 3,
                          date: 'Tomorrow',
                          type: 'treatment'
                        },
                        {
                          title: 'Follow-up Visit - Week 8',
                          participants: 2,
                          date: 'Next Week',
                          type: 'follow-up'
                        },
                        {
                          title: 'Screening Visit',
                          participants: 1,
                          date: 'In 2 weeks',
                          type: 'screening'
                        }
                      ].map((visit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${
                              visit.type === 'treatment' ? 'bg-green-100' :
                              visit.type === 'screening' ? 'bg-blue-100' :
                              'bg-purple-100'
                            }`}>
                              <Calendar className={`h-5 w-5 ${
                                visit.type === 'treatment' ? 'text-green-600' :
                                visit.type === 'screening' ? 'text-blue-600' :
                                'text-purple-600'
                              }`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{visit.title}</p>
                              <div className="flex items-center mt-1">
                                <Users className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-500">
                                  {visit.participants} participant{visit.participants !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              visit.type === 'treatment' ? 'bg-green-100 text-green-800' :
                              visit.type === 'screening' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {visit.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-6">
              {/* Schedule Analytics */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Brain className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">AI Insights</h3>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">Refresh</button>
                </div>

                <div className="space-y-6">
                  {/* Visit Distribution */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Visit Distribution</h4>
                      <span className="text-sm text-green-600">Optimal</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Visit spacing aligns well with protocol endpoints
                    </p>
                  </div>

                  {/* Participant Load */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Participant Load</h4>
                      <span className="text-sm text-yellow-600">Review Suggested</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Consider redistributing Week 4 visits to balance load
                    </p>
                  </div>

                  {/* Schedule Efficiency */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Schedule Efficiency</h4>
                      <span className="text-sm text-blue-600">Good</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Procedure grouping optimizes visit duration
                    </p>
                  </div>
                </div>

                {/* Key Recommendations */}
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Key Recommendations</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-green-50 rounded-lg mt-0.5">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Combine blood draws</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Week 4 and 8 samples can be collected together
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-yellow-50 rounded-lg mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">High participant load</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Consider splitting Week 4 visits across multiple days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-1.5 bg-blue-50 rounded-lg mt-0.5">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Visit window optimization</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Extend Week 8 window to ±5 days for flexibility
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-semibold text-gray-900">24</div>
                      <div className="text-xs text-gray-600 mt-1">Total Visits</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-semibold text-gray-900">8</div>
                      <div className="text-xs text-gray-600 mt-1">Procedures/Visit</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-semibold text-gray-900">±3</div>
                      <div className="text-xs text-gray-600 mt-1">Avg Window</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-semibold text-gray-900">85%</div>
                      <div className="text-xs text-gray-600 mt-1">Optimization</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}