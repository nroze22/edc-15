import React from 'react';
import { Search, Filter, BookOpen, Star, Clock, ArrowRight } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: number;
  lastUsed: string;
  fields: number;
  validations: number;
  matches: number;
}

interface TemplateLibraryProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateLibrary({ templates, onSelectTemplate }: TemplateLibraryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Template Library</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-1.5" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="relative rounded-lg border border-gray-200 bg-white p-4 hover:border-indigo-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {template.popularity}k uses
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    {template.lastUsed}
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {template.fields} fields
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {template.validations} validations
                  </span>
                  {template.matches > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {template.matches} protocol matches
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onSelectTemplate(template)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Use Template
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}