import React, { useState } from 'react';
import { X, Key, Save } from 'lucide-react';
import { useAIStore } from '../../store/useAIStore';

interface APIKeyModalProps {
  onClose: () => void;
}

export default function APIKeyModal({ onClose }: APIKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const setStoreApiKey = useAIStore(state => state.setApiKey);

  const handleSave = () => {
    if (apiKey.trim()) {
      setStoreApiKey(apiKey.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Key className="h-5 w-5 text-talosix-blue mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Configure OpenAI API Key</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-500 mb-4">
            Enter your OpenAI API key to enable AI-powered protocol analysis features.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue"
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-talosix-blue hover:bg-talosix-purple"
          >
            <Save className="h-4 w-4 mr-2" />
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
}