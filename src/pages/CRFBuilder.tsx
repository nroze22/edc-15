import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Plus, Database, Wand2, ArrowRight, AlertTriangle, FormInput, Settings } from 'lucide-react';
import { useCRFStore } from '../store/crfStore';
import FormDesigner from '../components/crf/FormDesigner';
import FormValidation from '../components/crf/FormValidation';
import { crfAI } from '../services/crfAI';
import TemplateLibrary from '../components/crf/TemplateLibrary';
import FormFinalization from '../components/crf/FormFinalization';
import { aiService } from '../services/ai';
import { useSettingsStore } from '../stores/settingsStore';
import ApiKeyRequired from '../components/common/ApiKeyRequired';

enum CRFBuilderStep {
  SELECTION = 'selection',
  FORM_DESIGN = 'form_design',
  VALIDATION = 'validation',
  FINALIZATION = 'finalization',
}

const CRFBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CRFBuilderStep>(CRFBuilderStep.SELECTION);
  const [loading, setLoading] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentForm, addForm, setCurrentForm } = useCRFStore();
  const { hasValidApiKey } = useSettingsStore();

  // Check for protocol and study information
  const checkPrerequisites = () => {
    const protocol = localStorage.getItem('protocol');
    const studyInfo = localStorage.getItem('studyInfo');
    
    if (!protocol || !studyInfo) {
      return {
        isReady: false,
        message: !protocol 
          ? "Please upload your protocol first" 
          : "Please provide study information first"
      };
    }
    return { isReady: true, message: null };
  };

  if (!hasValidApiKey()) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">CRF Builder</h1>
        <ApiKeyRequired message="CRF Builder requires an OpenAI API key to generate and optimize your case report forms." />
      </div>
    );
  }

  const handleGenerateAIForms = async () => {
    if (!aiService.getApiKey()) {
      setError('Please set your OpenAI API key in Settings to use AI features');
      return;
    }

    const prereqCheck = checkPrerequisites();
    if (!prereqCheck.isReady) {
      setError(prereqCheck.message);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const protocol = JSON.parse(localStorage.getItem('protocol') || '{}');
      const studyInfo = JSON.parse(localStorage.getItem('studyInfo') || '{}');
      const forms = await crfAI.generateForms({ protocol, studyInfo });
      
      if (forms && forms.length > 0) {
        // Clear existing forms first
        forms.forEach(form => {
          const enrichedForm = {
            ...form,
            id: window.crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: '1.0.0',
            sections: form.sections.map(section => ({
              ...section,
              id: window.crypto.randomUUID(),
              fields: section.fields.map(field => ({
                ...field,
                id: window.crypto.randomUUID()
              }))
            }))
          };
          addForm(enrichedForm);
        });
        
        // Set the first form as current
        setCurrentForm(forms[0]);
        setCurrentStep(CRFBuilderStep.FORM_DESIGN);
      } else {
        setError('No forms were generated. Please check your protocol and try again.');
      }
    } catch (error) {
      setError('Failed to generate forms. Please try again later.');
      console.error('Error generating forms:', error);
    }
    setLoading(false);
  };

  const handleCreateFromTemplate = () => {
    setShowTemplateLibrary(true);
  };

  const handleTemplateSelect = (template: any) => {
    const newForm = {
      id: window.crypto.randomUUID(),
      title: template.name,
      description: template.description,
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    // If it's the demographics template, add the demographics form structure
    if (template.id === 'demographics') {
      newForm.sections = [{
        id: window.crypto.randomUUID(),
        title: 'Demographics',
        description: 'Participant demographic information',
        fields: [
          {
            id: window.crypto.randomUUID(),
            type: 'text',
            label: 'Participant ID',
            required: true,
            validation: ['min:1', 'regex:/^[A-Za-z0-9-]+$/']
          },
          {
            id: window.crypto.randomUUID(),
            type: 'date',
            label: 'Date of Birth',
            required: true
          },
          {
            id: window.crypto.randomUUID(),
            type: 'number',
            label: 'Age',
            required: true,
            validation: ['min:0', 'max:120']
          },
          {
            id: window.crypto.randomUUID(),
            type: 'select',
            label: 'Sex at Birth',
            required: true,
            options: ['male', 'female', 'other', 'prefer_not_to_say']
          },
          {
            id: window.crypto.randomUUID(),
            type: 'select',
            label: 'Gender',
            required: true,
            options: ['male', 'female', 'non_binary', 'other', 'prefer_not_to_say']
          },
          {
            id: window.crypto.randomUUID(),
            type: 'select',
            label: 'Ethnicity',
            required: true,
            options: ['hispanic_latino', 'not_hispanic_latino', 'unknown', 'prefer_not_to_say']
          },
          {
            id: window.crypto.randomUUID(),
            type: 'select',
            label: 'Race',
            required: true,
            options: ['american_indian', 'asian', 'black', 'pacific_islander', 'white', 'other', 'prefer_not_to_say']
          },
          {
            id: window.crypto.randomUUID(),
            type: 'text',
            label: 'Primary Language',
            required: true
          },
          {
            id: window.crypto.randomUUID(),
            type: 'number',
            label: 'Height (cm)',
            required: true,
            validation: ['min:0', 'max:300']
          },
          {
            id: window.crypto.randomUUID(),
            type: 'number',
            label: 'Weight (kg)',
            required: true,
            validation: ['min:0', 'max:500']
          }
        ]
      }];
    }

    addForm(newForm);
    setCurrentForm(newForm);
    setShowTemplateLibrary(false);
    setCurrentStep(CRFBuilderStep.FORM_DESIGN);
  };

  const handleCreateFromScratch = () => {
    const newForm = {
      id: window.crypto.randomUUID(),
      title: 'New CRF Form',
      description: 'Enter form description',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    addForm(newForm);
    setCurrentStep(CRFBuilderStep.FORM_DESIGN);
  };

  const handleFinalize = (signature: { username: string; password: string; reason: string }) => {
    // Here you would typically make an API call to validate credentials and store the signature
    const finalizedForm = {
      ...currentForm,
      status: 'finalized',
      signature: {
        ...signature,
        timestamp: new Date().toISOString(),
      },
    };
    setCurrentForm(finalizedForm);
    navigate('/app/study-setup');
  };

  const handleFinalizeCancel = () => {
    setCurrentStep(CRFBuilderStep.VALIDATION);
  };

  const SelectionStep = () => (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
      
      {showTemplateLibrary ? (
        <TemplateLibrary onSelectTemplate={handleTemplateSelect} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          <Card 
            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
            onClick={handleGenerateAIForms}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Wand2 className="w-12 h-12 text-primary" />
              <h3 className="text-lg font-semibold">AI-Generated Forms</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically generate forms based on your protocol analysis
              </p>
              <Button variant="default" className="mt-4" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Forms'}
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
            onClick={handleCreateFromTemplate}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Database className="w-12 h-12 text-primary" />
              <h3 className="text-lg font-semibold">Template Library</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose from our collection of pre-built form templates
              </p>
              <Button variant="default" className="mt-4">
                Browse Templates
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
            onClick={handleCreateFromScratch}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Plus className="w-12 h-12 text-primary" />
              <h3 className="text-lg font-semibold">Start from Scratch</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create custom forms tailored to your specific needs
              </p>
              <Button variant="default" className="mt-4">
                Create New
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case CRFBuilderStep.SELECTION:
        return <SelectionStep />;
      case CRFBuilderStep.FORM_DESIGN:
        return <FormDesigner onNext={() => setCurrentStep(CRFBuilderStep.VALIDATION)} />;
      case CRFBuilderStep.VALIDATION:
        return <FormValidation onNext={() => setCurrentStep(CRFBuilderStep.FINALIZATION)} />;
      case CRFBuilderStep.FINALIZATION:
        return <FormFinalization onFinalize={handleFinalize} onCancel={handleFinalizeCancel} />;
      default:
        return null;
    }
  };

  const steps = [
    { id: CRFBuilderStep.SELECTION, name: 'Selection' },
    { id: CRFBuilderStep.FORM_DESIGN, name: 'Form Design' },
    { id: CRFBuilderStep.VALIDATION, name: 'Validation' },
    { id: CRFBuilderStep.FINALIZATION, name: 'Finalization' },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">CRF Builder</h1>
          {currentStep !== CRFBuilderStep.SELECTION && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(CRFBuilderStep.SELECTION)}
            >
              Back to Selection
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4 mt-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center space-x-2 ${
                  currentStep === step.id
                    ? 'text-primary'
                    : index < steps.findIndex(s => s.id === currentStep)
                    ? 'text-gray-500'
                    : 'text-gray-300'
                }`}
              >
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                  ${currentStep === step.id ? 'border-primary text-primary' : 'border-current'}`}
                >
                  {index + 1}
                </span>
                <span className="font-medium">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className={`w-4 h-4 ${
                  index < steps.findIndex(s => s.id === currentStep)
                    ? 'text-gray-500'
                    : 'text-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default CRFBuilder;
