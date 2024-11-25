import React from 'react';
import { FormField, useCRFStore } from '../../store/crfStore';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface FieldEditorProps {
  formId: string;
  sectionId: string;
  fieldId: string;
}

const fieldTypes = [
  'text',
  'number',
  'date',
  'select',
  'radio',
  'checkbox',
  'textarea',
] as const;

const FieldEditor: React.FC<FieldEditorProps> = ({
  formId,
  sectionId,
  fieldId,
}) => {
  const { currentForm, updateField } = useCRFStore();

  const section = currentForm?.sections.find((s) => s.id === sectionId);
  const field = section?.fields.find((f) => f.id === fieldId);

  if (!field) return null;

  const handleUpdateField = (updates: Partial<FormField>) => {
    updateField(formId, sectionId, fieldId, { ...field, ...updates });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Field Label</Label>
          <Input
            id="label"
            value={field.label}
            onChange={(e) => handleUpdateField({ label: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Field Type</Label>
          <Select
            value={field.type}
            onValueChange={(value) => handleUpdateField({ type: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select field type" />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="required"
            checked={field.required}
            onCheckedChange={(checked) => handleUpdateField({ required: checked })}
          />
          <Label htmlFor="required">Required Field</Label>
        </div>

        {(field.type === 'select' || field.type === 'radio') && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])];
                      newOptions[index] = e.target.value;
                      handleUpdateField({ options: newOptions });
                    }}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newOptions = field.options?.filter(
                        (_, i) => i !== index
                      );
                      handleUpdateField({ options: newOptions });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newOptions = [...(field.options || []), ''];
                  handleUpdateField({ options: newOptions });
                }}
              >
                Add Option
              </Button>
            </div>
          </div>
        )}

        {field.type === 'number' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="min">Minimum Value</Label>
              <Input
                id="min"
                type="number"
                value={field.validation?.includes('min') ? field.min : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const validation = field.validation || [];
                  if (value && !validation.includes('min')) {
                    validation.push('min');
                  } else if (!value && validation.includes('min')) {
                    validation.splice(validation.indexOf('min'), 1);
                  }
                  handleUpdateField({
                    min: value ? Number(value) : undefined,
                    validation,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Maximum Value</Label>
              <Input
                id="max"
                type="number"
                value={field.validation?.includes('max') ? field.max : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const validation = field.validation || [];
                  if (value && !validation.includes('max')) {
                    validation.push('max');
                  } else if (!value && validation.includes('max')) {
                    validation.splice(validation.indexOf('max'), 1);
                  }
                  handleUpdateField({
                    max: value ? Number(value) : undefined,
                    validation,
                  });
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FieldEditor;
