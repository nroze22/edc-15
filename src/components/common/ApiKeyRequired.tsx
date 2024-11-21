import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Settings } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

interface ApiKeyRequiredProps {
  message?: string;
}

export default function ApiKeyRequired({ message = 'This feature requires an OpenAI API key' }: ApiKeyRequiredProps) {
  const navigate = useNavigate();
  const { openAIApiKey } = useSettingsStore();

  if (openAIApiKey) return null;

  return (
    <div className="rounded-lg bg-amber-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">{message}</h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              To use this feature, you need to configure your OpenAI API key in the settings.
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                type="button"
                onClick={() => navigate('/app/settings')}
                className="rounded-md bg-amber-50 px-2 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-amber-50"
              >
                <Settings className="h-4 w-4 inline-block mr-1" />
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
