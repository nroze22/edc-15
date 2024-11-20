import React, { useState } from 'react';
import { 
  BarChart2, 
  AlertCircle, 
  Clock, 
  FileText,
  Users,
  TrendingUp,
  Filter,
  Download,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Sliders,
  Eye,
  Edit2,
  Upload
} from 'lucide-react';
import QueryManagement from '../components/study/QueryManagement';
import StudyMetrics from '../components/study/StudyMetrics';
import DataQuality from '../components/study/DataQuality';
import Timeline from '../components/study/Timeline';
import PatientScreening from '../components/study/screening/PatientScreening';

export default function StudyManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedSite, setSelectedSite] = useState('all');

  const stats = [
    {
      name: 'Enrollment Rate',
      value: '94%',
      change: '+4.75%',
      trend: 'up',
      target: '90%',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      name: 'Data Completion',
      value: '87%',
      change: '+2.3%',
      trend: 'up',
      target: '95%',
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      name: 'Open Queries',
      value: '23',
      change: '-5',
      trend: 'down',
      target: '< 30',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      name: 'Protocol Deviations',
      value: '8',
      change: '+2',
      trend: 'up',
      target: '< 10',
      icon: FileText,
      color: 'text-red-600',
      bg: 'bg-red-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive overview of study progress, data quality, and operational metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Sites</option>
              <option value="site1">Site 001 - New York</option>
              <option value="site2">Site 002 - Los Angeles</option>
              <option value="site3">Site 003 - Chicago</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 rounded-lg border border-gray-200 overflow-hidden"
            >
              <dt>
                <div className={`absolute rounded-md p-3 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
                <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-2 sm:px-6">
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">Target: {stat.target}</span>
                  </div>
                </div>
              </dd>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart2 },
              { id: 'queries', name: 'Query Management', icon: MessageSquare },
              { id: 'quality', name: 'Data Quality', icon: CheckCircle2 },
              { id: 'timeline', name: 'Study Timeline', icon: Calendar },
              { id: 'screening', name: 'Patient Screening', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <StudyMetrics />}
          {activeTab === 'queries' && <QueryManagement />}
          {activeTab === 'quality' && <DataQuality />}
          {activeTab === 'timeline' && <Timeline />}
          {activeTab === 'screening' && <PatientScreening />}
        </div>
      </div>
    </div>
  );
}