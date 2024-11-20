import React, { useState } from 'react';
import { X, Download, Check, ArrowRight } from 'lucide-react';

interface ConsentFormPreviewProps {
  template: any;
  onClose: () => void;
}

export default function ConsentFormPreview({ template, onClose }: ConsentFormPreviewProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [acknowledgments, setAcknowledgments] = useState<Record<string, boolean>>({});

  const sections = [
    {
      title: 'Study Information',
      content: `
        <h2>Purpose of the Study</h2>
        <p>This research study aims to evaluate the safety and effectiveness of [Treatment] for [Condition]...</p>
        
        <h2>Study Duration</h2>
        <p>Your participation will last approximately [Duration], during which you will need to...</p>
        
        <h2>Study Procedures</h2>
        <p>As a participant, you will be required to:</p>
        <ul>
          <li>Attend scheduled study visits</li>
          <li>Complete questionnaires</li>
          <li>Undergo medical examinations</li>
          <li>Take the study medication as directed</li>
        </ul>
      `
    },
    {
      title: 'Risks & Benefits',
      content: `
        <h2>Potential Risks</h2>
        <p>The known and potential risks of participating in this study include:</p>
        <ul>
          <li>Common side effects of the medication</li>
          <li>Discomfort during procedures</li>
          <li>Time commitment for study visits</li>
        </ul>
        
        <h2>Potential Benefits</h2>
        <p>Benefits of participating may include:</p>
        <ul>
          <li>Access to new treatment options</li>
          <li>Regular medical monitoring</li>
          <li>Contributing to medical research</li>
        </ul>
      `
    },
    {
      title: 'Privacy & Rights',
      content: `
        <h2>Data Protection</h2>
        <p>Your privacy and the confidentiality of your data will be protected by:</p>
        <ul>
          <li>Secure data storage systems</li>
          <li>Limited access to identifiable information</li>
          <li>Data encryption</li>
        </ul>
        
        <h2>Your Rights</h2>
        <p>As a study participant, you have the right to:</p>
        <ul>
          <li>Withdraw from the study at any time</li>
          <li>Access your study data</li>
          <li>Ask questions about the study</li>
        </ul>
      `
    },
    {
      title: 'Electronic Signature',
      content: `
        <h2>Consent Declaration</h2>
        <p>By signing this electronic consent form, I confirm that:</p>
        <ul>
          <li>I have read and understood the study information</li>
          <li>I have had the opportunity to ask questions</li>
          <li>I understand my participation is voluntary</li>
          <li>I agree to participate in the study</li>
        </ul>
        
        <h2>Electronic Signature Acknowledgment</h2>
        <p>I understand that my electronic signature is legally binding and equivalent to my handwritten signature.</p>
      `
    }
  ];

  const handleAcknowledgment = (section: number) => {
    setAcknowledgments(prev => ({
      ...prev,
      [section]: true
    }));
  };

  const canProceed = currentSection < sections.length - 1 && acknowledgments[currentSection];
  const canSign = currentSection === sections.length - 1 && acknowledgments[currentSection];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Study Consent Form</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please review each section carefully
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {/* Handle download */}}
              className="text-gray-400 hover:text-gray-500"
            >
              <Download className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index <= currentSection ? 'text-talosix-blue' : 'text-gray-400'
                }`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${index === currentSection ? 'bg-talosix-blue text-white' :
                    index < currentSection ? 'bg-green-100 text-green-500' :
                    'bg-gray-100 text-gray-500'}
                `}>
                  {index < currentSection ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{section.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: sections[currentSection].content }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acknowledge"
                checked={acknowledgments[currentSection] || false}
                onChange={() => handleAcknowledgment(currentSection)}
                className="h-4 w-4 text-talosix-blue border-gray-300 rounded focus:ring-talosix-blue"
              />
              <label htmlFor="acknowledge" className="ml-2 text-sm text-gray-700">
                I have read and understand this section
              </label>
            </div>
            <div className="flex space-x-3">
              {currentSection > 0 && (
                <button
                  onClick={() => setCurrentSection(prev => prev - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Back
                </button>
              )}
              {canProceed && (
                <button
                  onClick={() => setCurrentSection(prev => prev + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple"
                >
                  Next Section
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
              {canSign && (
                <button
                  onClick={() => {/* Handle signature */}}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Sign & Complete
                  <Check className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}