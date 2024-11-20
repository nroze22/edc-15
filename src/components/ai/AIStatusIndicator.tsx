import React from 'react';
import { Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAIStore } from '../../store/useAIStore';

interface AIStatusIndicatorProps {
  onConfigure: () => void;
}

export default function AIStatusIndicator({ onConfigure }: AIStatusIndicatorProps) {
  const isConfigured = useAIStore(state => state.isConfigured);

  return (
    <button
      onClick={onConfigure}
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
        isConfigured
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {isConfigured ? (
        <>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          AI Ready
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 mr-2" />
          Configure AI
        </>
      )}
      <Settings className="h-4 w-4 ml-2" />
    </button>
  );
}