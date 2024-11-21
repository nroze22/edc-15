import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, MoreVertical, Map, Users, FileText, Activity } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
  principalInvestigator: string;
  enrollmentTarget: number;
  currentEnrollment: number;
  lastActivity: string;
}

export default function Sites() {
  const [sites, setSites] = useState<Site[]>([
    {
      id: '001',
      name: 'Memorial Research Center',
      location: 'Boston, MA',
      status: 'active',
      principalInvestigator: 'Dr. Sarah Chen',
      enrollmentTarget: 50,
      currentEnrollment: 32,
      lastActivity: '2024-02-15'
    },
    {
      id: '002',
      name: 'Northwest Clinical Institute',
      location: 'Seattle, WA',
      status: 'active',
      principalInvestigator: 'Dr. Michael Park',
      enrollmentTarget: 40,
      currentEnrollment: 18,
      lastActivity: '2024-02-14'
    },
    // Add more sample sites as needed
  ]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sites Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all participating research sites
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add New Site
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Sites', value: '12', icon: Building2, color: 'text-blue-600' },
          { label: 'Active Sites', value: '8', icon: Activity, color: 'text-green-600' },
          { label: 'Total Enrollment', value: '245', icon: Users, color: 'text-purple-600' },
          { label: 'Documents Pending', value: '3', icon: FileText, color: 'text-amber-600' },
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
            placeholder="Search sites..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Sites Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Site
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Principal Investigator
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sites.map((site) => (
              <tr key={site.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{site.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Map className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-500">{site.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    {
                      'bg-green-100 text-green-800': site.status === 'active',
                      'bg-yellow-100 text-yellow-800': site.status === 'pending',
                      'bg-gray-100 text-gray-800': site.status === 'inactive',
                    }
                  )}>
                    {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{site.principalInvestigator}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900">{site.currentEnrollment}/{site.enrollmentTarget}</div>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{ width: `${(site.currentEnrollment / site.enrollmentTarget) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(site.lastActivity).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
