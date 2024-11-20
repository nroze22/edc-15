import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ValidationRulesProps {
  field: any;
  onUpdate: (updates: any) => void;
}

export default function ValidationRules({ field, onUpdate }: ValidationRulesProps) {
  const addValidation = () => {
    const newValidations = [...(field.validation || []), {
      type: 'required',
      message: '',
      rule: ''
    }];
    onUpdate({ validation: newValidations });
  };

  const removeValidation = (index: number) => {
    const newValidations = field.validation.filter((_: any, i: number) => i !== index);
    onUpdate({ validation: newValidations });
  };

  const updateValidation = (index: number, updates: any) => {
    const newValidations = [...field.validation];
    newValidations[index] = { ...newValidations[index], ...updates };
    onUpdate({ validation: newValidations });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Validation Rules</h4>
        <button
          onClick={addValidation}
          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Rule
        </button>
      </div>

      <div className="space-y-4">
        {field.validation?.map((validation: any, index: number) => (
          <div
            key={index}
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <select
                value={validation.type}
                onChange={(e) => updateValidation(index, { type: e.target.value })}
                className="px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-sm"
              >
                <option value="required">Required</option>
                <option value="pattern">Pattern Match</option>
                <option value="range">Range</option>
                <option value="length">Length</option>
                <option value="custom">Custom</option>
              </select>
              <button
                onClick={() => removeValidation(index)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {validation.type === 'pattern' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pattern
                </label>
                <input
                  type="text"
                  value={validation.rule}
                  onChange={(e) => updateValidation(index, { rule: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-sm"
                  placeholder="Enter regex pattern..."
                />
              </div>
            )}

            {validation.type === 'range' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min
                  </label>
                  <input
                    type="number"
                    value={validation.min}
                    onChange={(e) => updateValidation(index, { min: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max
                  </label>
                  <input
                    type="number"
                    value={validation.max}
                    onChange={(e) => updateValidation(index, { max: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-sm"
                  />
                </div>
              </div>
            )}

            {validation.type === 'length' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Length
                  </label>
                  <input
                    type="number"
                    value={validation.minLength}
                    onChange={(e) => updateValidation(index, { minLength: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={validation.maxLength}
                    onChange={(e) => updateValidation(index, { maxLength: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-sm"
                  />
                </div>
              </div>
            )}

            {validation.type === 'custom' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Rule
                </label>
                <textarea
                  value={validation.rule}
                  onChange={(e) => updateValidation(index, { rule: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-sm resize-none"
                  placeholder="Enter custom validation rule..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Error Message
              </label>
              <input
                type="text"
                value={validation.message}
                onChange={(e) => updateValidation(index, { message: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors text-sm"
                placeholder="Enter error message..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}