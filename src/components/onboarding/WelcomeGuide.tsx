import React from 'react';
import { X, Users, FileText, ClipboardList, UserPlus, PlayCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeGuideProps {
  onClose: () => void;
}

export default function WelcomeGuide({ onClose }: WelcomeGuideProps) {
  const navigate = useNavigate();
  
  const steps = [
    {
      title: 'Study Setup',
      description: 'Configure your study team, sites, and roles',
      icon: Users,
      path: '/app/study-setup'
    },
    {
      title: 'Protocol Analysis',
      description: 'Upload and analyze your study protocol with AI',
      icon: FileText,
      path: '/app/protocol-analysis'
    },
    {
      title: 'eCRF Design',
      description: 'Create and test your electronic Case Report Forms',
      icon: ClipboardList,
      path: '/app/protocol-analysis'
    },
    {
      title: 'Participant Management',
      description: 'Add and manage study participants',
      icon: UserPlus,
      path: '/app/participants'
    },
    {
      title: 'Run Your Study',
      description: 'Monitor progress and manage data collection',
      icon: PlayCircle,
      path: '/app/study-management'
    }
  ];

  const handleStepClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" />

        <div className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all max-w-2xl w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-talosix-blue to-talosix-purple p-8">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://framerusercontent.com/images/021L73kQYq9ZIfe4FnXRxtsHM.svg" 
                alt="Talosix" 
                className="h-16 w-16"
              />
            </div>
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold">Welcome to Talosix</h2>
              <p className="mt-2 text-lg text-blue-100">
                Let's get your clinical trial set up in minutes
              </p>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => handleStepClick(step.path)}
                  className="flex items-start space-x-4 p-4 rounded-lg border-2 border-transparent hover:border-talosix-blue hover:bg-blue-50 cursor-pointer transition-all duration-200"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-talosix-blue to-talosix-purple">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-talosix-blue mt-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 flex justify-end border-t border-gray-200">
            <button
              onClick={onClose}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}