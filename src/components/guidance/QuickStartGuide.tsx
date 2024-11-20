import React from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGuidanceStore } from '../../store/useGuidanceStore';

interface QuickStartGuideProps {
  onClose: () => void;
}

export default function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  const { completedTours, startTour } = useGuidanceStore();
  const navigate = useNavigate();

  const steps = [
    {
      id: 'study-setup',
      title: 'Set Up Your Study',
      description: 'Configure your study team, sites, and roles',
      link: '/app/study-setup',
      tasks: [
        'Add study team members',
        'Configure study sites',
        'Set up role permissions'
      ]
    },
    {
      id: 'protocol-analysis',
      title: 'Analyze Protocol',
      description: 'Upload and analyze your study protocol',
      link: '/app/protocol-analysis',
      tasks: [
        'Upload protocol document',
        'Review AI analysis',
        'Generate study schedule'
      ]
    },
    {
      id: 'crf-design',
      title: 'Design eCRFs',
      description: 'Create and validate your study forms',
      link: '/app/crf-design',
      tasks: [
        'Select form templates',
        'Customize form fields',
        'Set up validation rules'
      ]
    },
    {
      id: 'participant-setup',
      title: 'Set Up Participants',
      description: 'Configure participant management',
      link: '/app/participants',
      tasks: [
        'Set up consent process',
        'Configure screening forms',
        'Prepare enrollment workflow'
      ]
    }
  ];

  const handleStepClick = (step: typeof steps[0]) => {
    navigate(step.link);
    startTour(step.id);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Getting Started Guide</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Follow these steps to set up your clinical trial
        </p>
      </div>

      <div className="p-4 space-y-4">
        {steps.map((step, index) => {
          const isComplete = completedTours.includes(step.id);
          
          return (
            <div
              key={step.id}
              className={`relative pl-8 ${
                index !== steps.length - 1 ? 'pb-4' : ''
              }`}
            >
              {index !== steps.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200" />
              )}
              
              <div className="flex items-start">
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center ${
                  isComplete ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <span className="text-sm font-medium text-gray-500">
                      {index + 1}
                    </span>
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {step.title}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {step.description}
                  </p>
                  
                  <div className="mt-2 space-y-1">
                    {step.tasks.map((task, taskIndex) => (
                      <div
                        key={taskIndex}
                        className="flex items-center text-xs text-gray-500"
                      >
                        <span className="w-1 h-1 rounded-full bg-gray-300 mr-2" />
                        {task}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleStepClick(step)}
                    className="mt-3 inline-flex items-center text-sm text-talosix-blue hover:text-talosix-purple"
                  >
                    {isComplete ? 'Review Guide' : 'Start Guide'}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}