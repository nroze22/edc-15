import React, { useState } from 'react';
import { GraduationCap, Plus, Search, Filter, MoreVertical, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TrainingModule {
  id: string;
  name: string;
  type: string;
  status: 'completed' | 'in_progress' | 'pending' | 'overdue';
  assignedTo: string[];
  dueDate: string;
  completionRate: number;
  duration: string;
}

export default function SiteTraining() {
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: '001',
      name: 'Protocol Training',
      type: 'Required',
      status: 'completed',
      assignedTo: ['Dr. Sarah Chen', 'John Smith', 'Maria Garcia'],
      dueDate: '2024-02-28',
      completionRate: 100,
      duration: '2 hours'
    },
    {
      id: '002',
      name: 'EDC System Training',
      type: 'Required',
      status: 'in_progress',
      assignedTo: ['Dr. Sarah Chen', 'John Smith', 'Maria Garcia', 'Robert Johnson'],
      dueDate: '2024-03-15',
      completionRate: 65,
      duration: '1.5 hours'
    },
  ]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Site Training</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track site staff training modules
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Assign Training
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Modules', value: '12', icon: GraduationCap, color: 'text-blue-600' },
          { label: 'Completed', value: '8', icon: CheckCircle2, color: 'text-green-600' },
          { label: 'In Progress', value: '3', icon: Clock, color: 'text-amber-600' },
          { label: 'Overdue', value: '1', icon: AlertCircle, color: 'text-red-600' },
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
            placeholder="Search training modules..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Training Modules */}
      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                    <span className="ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {module.type}
                    </span>
                    <span className={clsx(
                      'ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      {
                        'bg-green-100 text-green-800': module.status === 'completed',
                        'bg-yellow-100 text-yellow-800': module.status === 'in_progress',
                        'bg-gray-100 text-gray-800': module.status === 'pending',
                        'bg-red-100 text-red-800': module.status === 'overdue',
                      }
                    )}>
                      {module.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {module.assignedTo.map((person, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {person}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="mt-1 flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                        {new Date(module.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="mt-1 flex items-center text-sm text-gray-900">
                        <Clock className="h-4 w-4 text-gray-400 mr-1.5" />
                        {module.duration}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Completion Rate</span>
                      <span>{module.completionRate}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={clsx(
                          'rounded-full h-2',
                          {
                            'bg-green-500': module.completionRate === 100,
                            'bg-blue-500': module.completionRate < 100 && module.completionRate >= 0,
                          }
                        )}
                        style={{ width: `${module.completionRate}%` }}
                      />
                    </div>
                  </div>
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
