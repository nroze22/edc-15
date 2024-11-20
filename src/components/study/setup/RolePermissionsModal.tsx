import React, { useState } from 'react';
import { X, Save, Shield, Check } from 'lucide-react';

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permissions: RolePermissions) => void;
  initialPermissions?: RolePermissions;
  roleName?: string;
}

interface RolePermissions {
  studySetup: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  participants: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  forms: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  queries: {
    view: boolean;
    resolve: boolean;
    create: boolean;
  };
}

const defaultPermissions: RolePermissions = {
  studySetup: { view: false, edit: false, delete: false },
  participants: { view: false, edit: false, delete: false },
  forms: { view: false, edit: false, delete: false },
  queries: { view: false, resolve: false, create: false }
};

export default function RolePermissionsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialPermissions = defaultPermissions,
  roleName = ''
}: RolePermissionsModalProps) {
  const [permissions, setPermissions] = useState<RolePermissions>(initialPermissions);

  if (!isOpen) return null;

  const handlePermissionChange = (
    category: keyof RolePermissions,
    action: string,
    value: boolean
  ) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [action]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(permissions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              {roleName ? `Edit ${roleName} Permissions` : 'Configure Role Permissions'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {Object.entries(permissions).map(([category, actions]) => (
              <div key={category} className="border-b border-gray-200 pb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="space-y-3">
                  {Object.entries(actions).map(([action, value]) => (
                    <div key={`${category}-${action}`} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${category}-${action}`}
                        checked={value}
                        onChange={(e) => handlePermissionChange(
                          category as keyof RolePermissions,
                          action,
                          e.target.checked
                        )}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`${category}-${action}`}
                        className="ml-2 block text-sm text-gray-900 capitalize"
                      >
                        {action.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}