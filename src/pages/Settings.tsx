import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Sliders, Hash, Save, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';

export default function Settings() {
  const {
    openAIApiKey,
    modelVersion,
    temperature,
    maxTokens,
    setOpenAIApiKey,
    setModelVersion,
    setTemperature,
    setMaxTokens,
    clearSettings,
    hasValidApiKey,
  } = useSettingsStore();

  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center">
            <SettingsIcon className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Configure your application settings and API keys
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            {/* OpenAI API Key */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Key className="h-4 w-4 mr-2" />
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={openAIApiKey || ''}
                  onChange={(e) => setOpenAIApiKey(e.target.value)}
                  className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="sk-..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {hasValidApiKey() ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : openAIApiKey ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? 'Hide' : 'Show'} API Key
              </button>
              {openAIApiKey && !hasValidApiKey() && (
                <p className="mt-2 text-sm text-amber-600">
                  API key should start with 'sk-' and be at least 20 characters long
                </p>
              )}
              {hasValidApiKey() && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  API key is valid
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Required for AI-powered features. Get your API key from{' '}
                <a
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  OpenAI Dashboard
                </a>
              </p>
            </div>

            {/* Model Settings */}
            <div className="space-y-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Sliders className="h-4 w-4 mr-2" />
                Model Settings
              </label>
              
              {/* Model Version */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Version
                </label>
                <select
                  value={modelVersion}
                  onChange={(e) => setModelVersion(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Focused (0)</span>
                  <span>Balanced (0.5)</span>
                  <span>Creative (1)</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Hash className="h-4 w-4 mr-2" />
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  min="1"
                  max="4000"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum number of tokens to generate (1-4000)
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex justify-between items-center">
            <button
              type="button"
              onClick={clearSettings}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
