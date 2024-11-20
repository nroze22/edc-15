import React, { useState } from 'react';
import { 
  MessageSquare, 
  Filter, 
  Search, 
  AlertCircle,
  Clock,
  CheckCircle2,
  User,
  Calendar
} from 'lucide-react';

export default function QueryManagement() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const queries = [
    {
      id: 'Q123',
      subject: 'Missing lab value',
      participant: 'P-001',
      site: 'Site 001',
      status: 'open',
      priority: 'high',
      assignee: 'Dr. Sarah Chen',
      created: '2024-02-28',
      dueDate: '2024-03-07',
      responses: 2
    },
    {
      id: 'Q124',
      subject: 'Incomplete adverse event form',
      participant: 'P-002',
      site: 'Site 002',
      status: 'pending',
      priority: 'medium',
      assignee: 'Dr. Michael Lee',
      created: '2024-02-27',
      dueDate: '2024-03-06',
      responses: 1
    },
    {
      id: 'Q125',
      subject: 'Protocol deviation clarification',
      participant: 'P-003',
      site: 'Site 001',
      status: 'resolved',
      priority: 'low',
      assignee: 'Dr. Emily Brown',
      created: '2024-02-26',
      dueDate: '2024-03-05',
      responses: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Query Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Queries', value: '156', trend: '+12', icon: MessageSquare },
          { label: 'Open Queries', value: '23', trend: '-5', icon: AlertCircle },
          { label: 'Avg. Resolution Time', value: '2.3 days', trend: '-0.5', icon: Clock },
          { label: 'Resolution Rate', value: '94%', trend: '+2.1%', icon: CheckCircle2 }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="mt-1 text-sm text-green-600">{stat.trend} this week</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center space-x-4">
          <div className="max-w-xs w-full relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search queries..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Query List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {queries.map((query) => (
            <li key={query.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600">{query.id}</p>
                        <span className="ml-2 text-sm text-gray-500">in {query.participant}</span>
                      </div>
                      <p className="text-sm text-gray-900">{query.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(query.priority)}`}>
                      {query.priority}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {query.assignee}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      Due {query.dueDate}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <MessageSquare className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {query.responses} responses
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}