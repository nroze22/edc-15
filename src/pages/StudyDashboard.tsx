import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Users, Calendar, FileText, AlertCircle, Brain, TrendingUp,
  BarChart2, Clock, Target, Activity, CheckCircle2, AlertTriangle,
  ChevronRight, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';

export default function StudyDashboard() {
  const { studyId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [studyData, setStudyData] = useState({
    id: studyId,
    name: 'Loading...',
    status: 'active',
    participants: 0,
    startDate: '',
    protocolVersion: ''
  });

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll simulate loading study data
    const mockStudyData = {
      'CARD-001': {
        name: 'Cardiovascular Outcomes Study',
        status: 'active',
        participants: 248,
        startDate: 'Jan 2024',
        protocolVersion: 'v2.1'
      },
      'ONCO-274': {
        name: 'Phase III Oncology Trial',
        status: 'active',
        participants: 180,
        startDate: 'Mar 2024',
        protocolVersion: 'v1.2'
      },
      'DIAB-112': {
        name: 'Diabetes Prevention Study',
        status: 'active',
        participants: 720,
        startDate: 'Dec 2023',
        protocolVersion: 'v3.0'
      }
    };

    // Simulate API call
    setTimeout(() => {
      setStudyData({
        id: studyId,
        ...mockStudyData[studyId] || {
          name: 'Study Not Found',
          status: 'unknown',
          participants: 0,
          startDate: 'N/A',
          protocolVersion: 'N/A'
        }
      });
    }, 500);
  }, [studyId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Study Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{studyData.name}</h1>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {studyData.status}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {studyData.participants} participants
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Started {studyData.startDate}
                </span>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Protocol {studyData.protocolVersion}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                Export Data
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                Study Settings
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
          {['Overview', 'Participants', 'Schedule', 'Documents', 'Analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab.toLowerCase()
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Key Metrics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Enrollment Rate</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">94%</p>
                      <span className="ml-2 flex items-center text-sm font-medium text-green-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        8.1%
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">248/264 target participants</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Data Quality</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">87%</p>
                      <span className="ml-2 flex items-center text-sm font-medium text-yellow-600">
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        2.3%
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '87%' }} />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">324 queries pending</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Protocol Adherence</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">92%</p>
                      <span className="ml-2 flex items-center text-sm font-medium text-green-600">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        1.2%
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">18 deviations this month</p>
                </div>
              </div>
            </div>

            {/* Timeline and Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Study Timeline</h2>
                <Link to="/schedule" className="text-sm text-blue-600 hover:text-blue-700">
                  View Schedule
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>
                <div className="space-y-6">
                  {[
                    {
                      date: 'Today',
                      title: 'Week 12 Visits',
                      description: '32 participants scheduled',
                      status: 'upcoming'
                    },
                    {
                      date: '2 days ago',
                      title: 'Protocol Amendment 2.1 Approved',
                      description: 'Changes to inclusion criteria',
                      status: 'completed'
                    },
                    {
                      date: 'Last week',
                      title: 'Data Monitoring Committee Review',
                      description: 'No safety concerns identified',
                      status: 'completed'
                    }
                  ].map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`relative flex items-center justify-center w-16 h-16 flex-shrink-0 ${
                        event.status === 'upcoming' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        <div className={`absolute w-4 h-4 rounded-full ${
                          event.status === 'upcoming' ? 'bg-blue-600' : 'bg-green-600'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500">{event.date}</p>
                        <p className="text-base font-medium text-gray-900 mt-1">{event.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Insights and Actions */}
          <div className="space-y-8">
            {/* AI Insights Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-medium text-gray-900">AI Insights</h2>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700">
                  Refresh
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-green-50 rounded-lg mt-0.5">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Enrollment Trend Analysis
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Current enrollment rate suggests study will reach target 2 weeks ahead of schedule
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-yellow-50 rounded-lg mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Data Quality Alert
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Site 103 shows increased query rate in lab data. Consider additional training.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-blue-50 rounded-lg mt-0.5">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Resource Optimization
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Scheduling algorithm suggests redistributing Week 8 visits to optimize staff workload
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  {
                    type: 'query',
                    message: 'New query raised for participant 1043',
                    time: '10 minutes ago'
                  },
                  {
                    type: 'visit',
                    message: 'Week 8 visit completed for participant 1024',
                    time: '1 hour ago'
                  },
                  {
                    type: 'data',
                    message: 'Lab data imported for 12 participants',
                    time: '2 hours ago'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg ${
                        activity.type === 'query' ? 'bg-yellow-50' :
                        activity.type === 'visit' ? 'bg-green-50' : 'bg-blue-50'
                      }`}>
                        {activity.type === 'query' ? (
                          <AlertCircle className={`h-4 w-4 text-yellow-600`} />
                        ) : activity.type === 'visit' ? (
                          <CheckCircle2 className={`h-4 w-4 text-green-600`} />
                        ) : (
                          <FileText className={`h-4 w-4 text-blue-600`} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
