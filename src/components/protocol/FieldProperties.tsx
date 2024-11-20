import React from 'react';
import { Settings2 } from 'lucide-react';

interface FieldPropertiesProps {
  field: any;
  onUpdate: (updates: any) => void;
}

export default function FieldProperties({ field, onUpdate }: FieldPropertiesProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Field Name
        </label>
        <input
          type="text"
          value={field.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Description
        </label>
        <textarea
          value={field.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors resize-none"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          checked={field.required}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-talosix-blue focus:ring-talosix-blue"
        />
        <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
          Required Field
        </label>
      </div>

      {field.type === 'select' && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {field.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...field.options];
                    newOptions[index] = e.target.value;
                    onUpdate({ options: newOptions });
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
                />
                <button
                  onClick={() => {
                    const newOptions = field.options.filter((_: any, i: number) => i !== index);
                    onUpdate({ options: newOptions });
                  }}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...(field.options || []), ''];
                onUpdate({ options: newOptions });
              }}
              className="text-sm text-talosix-blue hover:text-talosix-purple"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}

      {(field.type === 'number' || field.type === 'date') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Minimum Value
            </label>
            <input
              type={field.type}
              value={field.min || ''}
              onChange={(e) => onUpdate({ min: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Maximum Value
            </label>
            <input
              type={field.type}
              value={field.max || ''}
              onChange={(e) => onUpdate({ max: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
            />
          </div>
        </>
      )}

      {field.type === 'number' && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Units
          </label>
          <div className="space-y-2">
            {field.units?.map((unit: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => {
                    const newUnits = [...field.units];
                    newUnits[index] = e.target.value;
                    onUpdate({ units: newUnits });
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
                />
                <button
                  onClick={() => {
                    const newUnits = field.units.filter((_: any, i: number) => i !== index);
                    onUpdate({ units: newUnits });
                  }}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newUnits = [...(field.units || []), ''];
                onUpdate({ units: newUnits });
              }}
              className="text-sm text-talosix-blue hover:text-talosix-purple"
            >
              + Add Unit
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Help Text
        </label>
        <textarea
          value={field.helpText || ''}
          onChange={(e) => onUpdate({ helpText: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors resize-none"
          placeholder="Enter help text for this field..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Placeholder Text
        </label>
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
          placeholder="Enter placeholder text..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Default Value
        </label>
        <input
          type="text"
          value={field.defaultValue || ''}
          onChange={(e) => onUpdate({ defaultValue: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
          placeholder="Enter default value..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          CSS Classes
        </label>
        <input
          type="text"
          value={field.cssClasses || ''}
          onChange={(e) => onUpdate({ cssClasses: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
          placeholder="Enter CSS classes..."
        />
      </div>
    </div>
  );
}