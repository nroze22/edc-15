import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { 
  Layout, 
  Plus, 
  Save,
  Eye,
  Code,
  Settings2,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  AlertCircle,
  Calendar,
  FileText,
  List,
  Table,
  CheckSquare,
  Type,
  Hash,
  Clock,
  ThermometerSun,
  Activity,
  Scale,
  Stethoscope,
  ArrowLeft,
  ArrowRight,
  Brain,
  GripVertical
} from 'lucide-react';
import { useProtocolStore } from '../../store/useProtocolStore';
import { useCRFStore } from '../../store/useCRFStore';
import FormField from './FormField';
import FieldProperties from './FieldProperties';
import ValidationRules from './ValidationRules';
import CodingStandards from './CodingStandards';
import FormPreview from './FormPreview';

interface FormBuilderProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function FormBuilder({ onComplete, onBack }: FormBuilderProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'code'>('edit');
  const [activeTab, setActiveTab] = useState<'properties' | 'validation' | 'coding'>('properties');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const { selectedCRF, detailedCRF, updateCRF, isLoading, error } = useCRFStore();

  const handleDragStart = (event: any) => {
    setDraggedFieldId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // Update field order
      const oldIndex = detailedCRF!.fields.findIndex(f => f.id === active.id);
      const newIndex = detailedCRF!.fields.findIndex(f => f.id === over.id);
      const newFields = [...detailedCRF!.fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      updateCRF({ ...detailedCRF!, fields: newFields });
    }
    setDraggedFieldId(null);
  };

  const handleFieldSelect = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setActiveTab('properties');
  };

  const handleFieldUpdate = (fieldId: string, updates: any) => {
    const newFields = detailedCRF!.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    updateCRF({ ...detailedCRF!, fields: newFields });
  };

  const handleFieldDelete = (fieldId: string) => {
    const newFields = detailedCRF!.fields.filter(field => field.id !== fieldId);
    updateCRF({ ...detailedCRF!, fields: newFields });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleFieldDuplicate = (fieldId: string) => {
    const field = detailedCRF!.fields.find(f => f.id === fieldId);
    if (field) {
      const newField = {
        ...field,
        id: `${field.id}_copy_${Date.now()}`,
        name: `${field.name} (Copy)`
      };
      updateCRF({
        ...detailedCRF!,
        fields: [...detailedCRF!.fields, newField]
      });
    }
  };

  if (!selectedCRF || !detailedCRF) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No CRF Selected</h3>
        <p className="text-base text-gray-600 mb-6">
          Please select a CRF template to begin form building.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Templates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{detailedCRF.name}</h3>
            <p className="mt-1 text-base text-gray-600">{detailedCRF.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 border-r border-gray-200 pr-4">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-talosix-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Layout className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-talosix-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'code'
                    ? 'bg-talosix-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Code className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={onComplete}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save Form
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Field Palette */}
        <div className="col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Form Elements</h4>
          <div className="space-y-2">
            {FIELD_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  const newField = {
                    id: `field_${Date.now()}`,
                    type: type.id,
                    name: type.name,
                    required: false,
                    description: '',
                    validation: []
                  };
                  updateCRF({
                    ...detailedCRF,
                    fields: [...detailedCRF.fields, newField]
                  });
                }}
                className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-talosix-blue hover:bg-blue-50 transition-colors"
              >
                <type.icon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700">{type.name}</span>
                <Plus className="h-4 w-4 text-gray-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Form Canvas */}
        <div className="col-span-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          {viewMode === 'edit' ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <div className="p-6 space-y-4">
                <SortableContext
                  items={detailedCRF.fields.map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {detailedCRF.fields.map((field) => (
                    <FormField
                      key={field.id}
                      field={field}
                      isSelected={selectedFieldId === field.id}
                      onSelect={() => handleFieldSelect(field.id)}
                      onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
                      onDelete={() => handleFieldDelete(field.id)}
                      onDuplicate={() => handleFieldDuplicate(field.id)}
                    />
                  ))}
                </SortableContext>
              </div>
              <DragOverlay>
                {draggedFieldId ? (
                  <div className="opacity-50">
                    <FormField
                      field={detailedCRF.fields.find(f => f.id === draggedFieldId)!}
                      isSelected={false}
                      onSelect={() => {}}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                      onDuplicate={() => {}}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : viewMode === 'preview' ? (
            <FormPreview form={detailedCRF} />
          ) : (
            <pre className="p-6 bg-gray-900 text-gray-100 rounded-lg overflow-auto">
              {JSON.stringify(detailedCRF, null, 2)}
            </pre>
          )}
        </div>

        {/* Properties Panel */}
        <div className="col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('properties')}
                className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 ${
                  activeTab === 'properties'
                    ? 'border-talosix-blue text-talosix-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Properties
              </button>
              <button
                onClick={() => setActiveTab('validation')}
                className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 ${
                  activeTab === 'validation'
                    ? 'border-talosix-blue text-talosix-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Validation
              </button>
              <button
                onClick={() => setActiveTab('coding')}
                className={`flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 ${
                  activeTab === 'coding'
                    ? 'border-talosix-blue text-talosix-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Coding
              </button>
            </nav>
          </div>

          <div className="p-6">
            {selectedFieldId ? (
              <>
                {activeTab === 'properties' && (
                  <FieldProperties
                    field={detailedCRF.fields.find(f => f.id === selectedFieldId)!}
                    onUpdate={(updates) => handleFieldUpdate(selectedFieldId, updates)}
                  />
                )}
                {activeTab === 'validation' && (
                  <ValidationRules
                    field={detailedCRF.fields.find(f => f.id === selectedFieldId)!}
                    onUpdate={(updates) => handleFieldUpdate(selectedFieldId, updates)}
                  />
                )}
                {activeTab === 'coding' && (
                  <CodingStandards
                    field={detailedCRF.fields.find(f => f.id === selectedFieldId)!}
                    onUpdate={(updates) => handleFieldUpdate(selectedFieldId, updates)}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Settings2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">
                  Select a field to configure its properties
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </button>
        <button
          onClick={onComplete}
          className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90"
        >
          Continue
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

const FIELD_TYPES = [
  { id: 'text', name: 'Text Input', icon: Type },
  { id: 'number', name: 'Number Input', icon: Hash },
  { id: 'date', name: 'Date Input', icon: Calendar },
  { id: 'time', name: 'Time Input', icon: Clock },
  { id: 'select', name: 'Dropdown', icon: List },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare },
  { id: 'radio', name: 'Radio Group', icon: List },
  { id: 'textarea', name: 'Text Area', icon: FileText },
  { id: 'matrix', name: 'Matrix', icon: Table },
  { id: 'vitals', name: 'Vital Signs', icon: Activity },
  { id: 'measurements', name: 'Measurements', icon: Scale },
  { id: 'clinical', name: 'Clinical Assessment', icon: Stethoscope }
];