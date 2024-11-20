import React from 'react';
import { Plus, Save, FileText, Settings } from 'lucide-react';

export default function FormBuilder() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Form Builder</h2>
            <p className="mt-1 text-sm text-gray-500">
              Design and customize your study's electronic Case Report Forms (eCRFs)
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary">
              <Settings className="h-4 w-4 mr-2" />
              Form Settings
            </button>
            <button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </button>
          </div>
        </div>

        {/* Form Templates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Template Card */}
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Demographics</h3>
                  <p className="text-sm text-gray-500">Basic patient information</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-500">
                <Save className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">15 fields</span>
                <span className="mx-2">•</span>
                <span>Last edited 2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Forms */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Forms</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <li key={item}>
                  <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <p className="ml-2 text-sm font-medium text-indigo-600 truncate">
                            Adverse Event Form
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            25 fields
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Used in 3 studies
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>Modified 6 days ago</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}