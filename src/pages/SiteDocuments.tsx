import React, { useState } from 'react';
import { FileText, Upload, Search, Filter, MoreVertical, Download, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'approved' | 'pending' | 'rejected';
  uploadDate: string;
  reviewer: string;
  version: string;
  size: string;
}

export default function SiteDocuments() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '001',
      name: 'Site Qualification Form',
      type: 'Regulatory',
      status: 'approved',
      uploadDate: '2024-02-15',
      reviewer: 'Dr. James Wilson',
      version: '1.0',
      size: '2.4 MB'
    },
    {
      id: '002',
      name: 'Laboratory Certification',
      type: 'Certification',
      status: 'pending',
      uploadDate: '2024-02-14',
      reviewer: 'Pending Review',
      version: '2.1',
      size: '1.8 MB'
    },
  ]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Site Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track site-related documentation
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Documents', value: '24', icon: FileText, color: 'text-blue-600' },
          { label: 'Pending Review', value: '3', icon: Clock, color: 'text-amber-600' },
          { label: 'Approved', value: '18', icon: CheckCircle, color: 'text-green-600' },
          { label: 'Requires Update', value: '3', icon: XCircle, color: 'text-red-600' },
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
            placeholder="Search documents..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="btn-secondary flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upload Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviewer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                      <div className="text-sm text-gray-500">{doc.size}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doc.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    {
                      'bg-green-100 text-green-800': doc.status === 'approved',
                      'bg-yellow-100 text-yellow-800': doc.status === 'pending',
                      'bg-red-100 text-red-800': doc.status === 'rejected',
                    }
                  )}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {doc.reviewer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  v{doc.version}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button className="text-gray-400 hover:text-gray-500">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
