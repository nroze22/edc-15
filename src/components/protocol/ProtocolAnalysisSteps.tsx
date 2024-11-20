import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface ProtocolAnalysisStepsProps {
  steps: Step[];
  currentStep: number;
}

export default function ProtocolAnalysisSteps({ steps, currentStep }: ProtocolAnalysisStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            <div className={`group pl-4 py-2 flex flex-col border-l-4 ${
              step.id < currentStep ? 'border-talosix-blue' :
              step.id === currentStep ? 'border-talosix-purple' :
              'border-gray-200'
            } hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`}>
              <span className={`text-xs font-semibold tracking-wide uppercase ${
                step.id < currentStep ? 'text-talosix-blue' :
                step.id === currentStep ? 'text-talosix-purple' :
                'text-gray-500'
              }`}>
                {step.id < currentStep ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Step {step.id}
                  </span>
                ) : (
                  `Step ${step.id}`
                )}
              </span>
              <span className="text-sm font-medium">
                {step.name}
              </span>
              <span className="text-xs text-gray-500">
                {step.description}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}