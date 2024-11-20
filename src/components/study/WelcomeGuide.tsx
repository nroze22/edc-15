import React from 'react';
import { X, Users, FileText, ClipboardList, UserPlus, PlayCircle } from 'lucide-react';

interface WelcomeGuideProps {
  onClose: () => void;
}

export default function WelcomeGuide({ onClose }: WelcomeGuideProps) {
  const steps = [
    {
      title: 'Study Setup',
      description: 'Configure your study team, sites, and roles',
      icon: Users
    },
    {
      title: 'Protocol Analysis',
      description: 'Upload and analyze your study protocol with AI',
      icon: FileText
    },
    {
      title: 'eCRF Design',
      description: 'Create and test your electronic Case Report Forms',
      icon: ClipboardList
    },
    {
      title: 'Participant Management',
      description: 'Add and manage study participants',
      icon: UserPlus
    },
    {
      title: 'Run Your Study',
      description: 'Monitor progress and manage data collection',
      icon: PlayCircle
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all max-w-2xl w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-talosix-blue to-talosix-purple p-6">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold">Welcome to Talosix</h2>
              <p className="mt-2 text-lg text-blue-100">
                Let's get your clinical trial set up in minutes
              </p>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg border-2 border-transparent hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100">
                    <step.icon className="h-6 w-6 text-talosix-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
            <button
              onClick={onClose}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-talosix-blue hover:bg-talosix-purple"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}