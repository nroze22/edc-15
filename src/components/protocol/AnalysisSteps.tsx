import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';

interface AnalysisStepsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function AnalysisSteps({ currentStep, onStepClick }: AnalysisStepsProps) {
  const [tooltipStep, setTooltipStep] = useState<number | null>(null);

  const steps = [
    { 
      number: 1, 
      name: 'Protocol', 
      tooltip: 'Upload protocol and enter study details'
    },
    { 
      number: 2, 
      name: 'Analysis', 
      tooltip: 'Review AI suggestions and schedule'
    },
    { 
      number: 3, 
      name: 'eCRF', 
      tooltip: 'Design and configure electronic Case Report Forms'
    },
    { 
      number: 4, 
      name: 'Testing', 
      tooltip: 'Validate forms and optimize data collection'
    },
    { 
      number: 5, 
      name: 'Database', 
      tooltip: 'Configure study database and export settings'
    },
    { 
      number: 6, 
      name: 'Launch', 
      tooltip: 'Review and publish study to production'
    }
  ];

  return (
    <div className="relative">
      <nav aria-label="Progress" className="max-w-xl mx-auto">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative">
              <div 
                className="group flex flex-col items-center"
                onMouseEnter={() => setTooltipStep(step.number)}
                onMouseLeave={() => setTooltipStep(null)}
              >
                <div className={`
                  h-8 w-8 rounded-full flex items-center justify-center
                  ${currentStep > step.number
                    ? 'bg-talosix-blue'
                    : currentStep === step.number
                    ? 'border-2 border-talosix-blue bg-white'
                    : 'border-2 border-gray-300 bg-white'}
                `}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span className={`text-sm ${
                      currentStep === step.number ? 'text-talosix-blue' : 'text-gray-500'
                    }`}>
                      {step.number}
                    </span>
                  )}
                </div>
                
                <span className="mt-2 text-xs font-medium text-gray-900">
                  {step.name}
                </span>

                {/* Tooltip */}
                {tooltipStep === step.number && (
                  <div className="absolute bottom-full mb-2 transform -translate-x-1/2 left-1/2">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {step.tooltip}
                    </div>
                    <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </div>
                )}

                {/* Connector Line */}
                {stepIdx !== steps.length - 1 && (
                  <div className={`absolute top-4 left-8 -ml-px h-0.5 w-full ${
                    currentStep > step.number ? 'bg-talosix-blue' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}