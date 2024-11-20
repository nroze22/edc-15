import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  UserPlus, 
  Mail, 
  FileText, 
  BarChart2,
  Search,
  Filter,
  Download,
  MessageSquare,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import ParticipantList from '../components/participants/ParticipantList';
import ImportModal from '../components/participants/ImportModal';
import CommunicationCenter from '../components/participants/CommunicationCenter';
import ComplianceMetrics from '../components/participants/ComplianceMetrics';

export default function ParticipantManagement() {
  const [activeTab, setActiveTab] = useState('participants');
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const stats = [
    { 
      name: 'Total Participants', 
      value: '248', 
      change: '+12 this week',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100' 
    },
    { 
      name: 'Form Completion Rate', 
      value: '87%', 
      change: '+3% vs last month',
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    { 
      name: 'Pending Forms', 
      value: '34', 
      change: '-5 this week',
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    { 
      name: 'Data Queries', 
      value: '12', 
      change: '-3 today',
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white shadow rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('participants')}
              className={`${
                activeTab === 'participants'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Users className="h-5 w-5 mr-2" />
              Participants
            </button>
            <button
              onClick={() => setActiveTab('communication')}
              className={`${
                activeTab === 'communication'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Communication
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`${
                activeTab === 'compliance'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Compliance & Reports
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'participants' && (
            <div className="space-y-6">
              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-center space-x-4">
                  <div className="max-w-xs w-full relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search participants..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Participant
                  </button>
                </div>
              </div>

              {/* Participant List */}
              <ParticipantList 
                searchQuery={searchQuery}
                statusFilter={selectedStatus}
              />
            </div>
          )}

          {activeTab === 'communication' && (
            <CommunicationCenter />
          )}

          {activeTab === 'compliance' && (
            <ComplianceMetrics />
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal onClose={() => setShowImportModal(false)} />
      )}
    </div>
  );
}