import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { CRFForm, FormField, FormSection, useCRFStore } from '../../store/crfStore';

// Helper function to generate UUID using browser's crypto API
const generateId = () => {
  return crypto.randomUUID();
};

interface FormDesignerProps {
  onNext?: () => void;
}

const FormDesigner: React.FC<FormDesignerProps> = ({ onNext }) => {
  const { currentForm, addSection, updateSection, deleteSection, addField, updateField, deleteField } = useCRFStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Redirect if no form is selected
  if (!currentForm) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">No Form Selected</h2>
        <p className="text-gray-500 mb-6">Please select or generate a form to begin editing.</p>
      </div>
    );
  }

  const handleAddSection = () => {
    const newSection: FormSection = {
      id: generateId(),
      title: 'New Section',
      description: 'Enter section description',
      fields: []
    };
    addSection(currentForm.id, newSection);
    setActiveSection(newSection.id);
  };

  const handleAddField = (sectionId: string) => {
    const newField: FormField = {
      id: generateId(),
      type: 'text',
      label: 'New Field',
      required: false
    };
    addField(currentForm.id, sectionId, newField);
    setActiveField(newField.id);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Form Preview */}
      <div className="col-span-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{currentForm.title}</h2>
              <p className="text-gray-500">{currentForm.description}</p>
            </div>
            <Button variant="outline" onClick={onNext}>
              Next: Validation
            </Button>
          </div>
          
          {currentForm.sections.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-gray-500 mb-4">No sections added yet</p>
              <Button onClick={handleAddSection}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {currentForm.sections.map((section) => (
                <div
                  key={section.id}
                  className={`border rounded-lg p-4 ${
                    activeSection === section.id ? 'border-primary' : 'border-gray-200'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{section.title}</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(currentForm.id, section.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div
                        key={field.id}
                        className={`p-3 rounded ${
                          activeField === field.id
                            ? 'bg-primary/10'
                            : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveField(field.id);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <label className="font-medium">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteField(currentForm.id, section.id, field.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full border-2 border-dashed"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddField(section.id);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddSection}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Properties Panel */}
      <div className="col-span-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Properties</h3>
          {/* Add property editing UI here */}
        </Card>
      </div>
    </div>
  );
};

export default FormDesigner;
