import React, { useState } from 'react';
import { Settings, X, Key, Save, Check } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { aiService } from '../../services/ai';

export default function GlobalSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { hasApiKey, setApiKey: saveApiKey, clearApiKey } = useSettingsStore();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      aiService.reinitialize();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsOpen(false);
      }, 1500);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-gray-500 relative"
        title="Settings"
      >
        <Settings className="h-5 w-5" />
        {!hasApiKey && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OpenAI API Key
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-talosix-blue sm:text-sm"
                  />
                  {hasApiKey && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your API key is stored securely in your browser's local storage.
                </p>
              </div>

              {hasApiKey && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      clearApiKey();
                      setApiKey('');
                      aiService.reinitialize();
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove API Key
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              {saveSuccess ? (
                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700">
                  <Check className="h-4 w-4 mr-1.5" />
                  Settings Saved
                </span>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Settings
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}