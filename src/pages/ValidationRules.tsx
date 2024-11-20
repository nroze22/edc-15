import React from 'react';
import { Plus, Settings2, AlertTriangle, Check } from 'lucide-react';

export default function ValidationRules() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Validation Rules</h2>
            <p className="mt-1 text-sm text-gray-500">
              Configure and manage data validation rules for your study forms
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary">
              <Settings2 className="h-4 w-4 mr-2" />
              Rule Settings
            </button>
            <button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Rule
            </button>
          </div>
        </div>

        {/* Rule Categories */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Category Card */}
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Range Checks</h3>
                <p className="text-sm text-gray-500">Validate numeric data ranges</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">12 active rules</span>
                <span className="mx-2">•</span>
                <span>3 forms</span>
              </div>
            </div>
          </div>

          {/* Category Card */}
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Cross-Field Validation</h3>
                <p className="text-sm text-gray-500">Compare related fields</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">8 active rules</span>
                <span className="mx-2">•</span>
                <span>5 forms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Rules */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Rules</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rule Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Age Range Check
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Range Check</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Demographics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2 days ago
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}