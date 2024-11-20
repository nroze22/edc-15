import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Trash2, Settings2 } from 'lucide-react';

interface FormFieldProps {
  field: any;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function FormField({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate
}: FormFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder || 'Enter text...'}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
            disabled
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder="0"
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
            disabled
          />
        );
      case 'select':
        return (
          <select
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors"
            disabled
          >
            <option>Select an option...</option>
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-2 border-gray-200 text-talosix-blue focus:ring-talosix-blue"
              disabled
            />
            <span className="ml-2 text-gray-500">Checkbox option</span>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3'].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  className="h-5 w-5 border-2 border-gray-200 text-talosix-blue focus:ring-talosix-blue"
                  disabled
                />
                <span className="ml-2 text-gray-500">{option}</span>
              </div>
            ))}
          </div>
        );
      case 'textarea':
        return (
          <textarea
            placeholder="Enter text..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-talosix-blue focus:border-talosix-blue transition-colors resize-none"
            disabled
          />
        );
      default:
        return (
          <div className="text-gray-500 italic">
            Preview not available for this field type
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border-2 p-4 transition-all duration-200 ${
        isSelected
          ? 'border-talosix-blue bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move p-1 rounded hover:bg-gray-100"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">{field.name}</h4>
            {field.required && (
              <span className="ml-1 text-xs text-red-500">*required</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Settings2 className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mt-2">
        {field.description && (
          <p className="text-sm text-gray-500 mb-2">{field.description}</p>
        )}
        {renderFieldPreview()}
      </div>

      {field.validation && field.validation.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {field.validation.map((rule: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              {rule}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}