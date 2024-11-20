import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface Criterion {
  id: string;
  category: string;
  type: 'inclusion' | 'exclusion';
  description: string;
  variables: Array<{
    name: string;
    operator: string;
    value: string | number;
    unit?: string;
  }>;
}

interface EligibilityCriteriaProps {
  initialCriteria?: Criterion[];
  onSubmit: (criteria: Criterion[]) => void;
}

export default function EligibilityCriteria({ initialCriteria = [], onSubmit }: EligibilityCriteriaProps) {
  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);

  const categories = [
    'Demographics',
    'Medical History',
    'Laboratory Values',
    'Medications',
    'Procedures',
    'Other'
  ];

  const operators = [
    { value: '=', label: 'equals' },
    { value: '!=', label: 'not equals' },
    { value: '>', label: 'greater than' },
    { value: '<', label: 'less than' },
    { value: '>=', label: 'greater than or equal' },
    { value: '<=', label: 'less than or equal' },
    { value: 'between', label: 'between' },
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' }
  ];

  const addCriterion = () => {
    setCriteria([...criteria, {
      id: Date.now().toString(),
      category: categories[0],
      type: 'inclusion',
      description: '',
      variables: [{
        name: '',
        operator: '=',
        value: ''
      }]
    }]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const addVariable = (criterionId: string) => {
    setCriteria(criteria.map(c => {
      if (c.id === criterionId) {
        return {
          ...c,
          variables: [...c.variables, {
            name: '',
            operator: '=',
            value: ''
          }]
        };
      }
      return c;
    }));
  };

  const removeVariable = (criterionId: string, index: number) => {
    setCriteria(criteria.map(c => {
      if (c.id === criterionId) {
        return {
          ...c,
          variables: c.variables.filter((_, i) => i !== index)
        };
      }
      return c;
    }));
  };

  const updateVariable = (criterionId: string, index: number, updates: Partial<typeof criteria[0]['variables'][0]>) => {
    setCriteria(criteria.map(c => {
      if (c.id === criterionId) {
        return {
          ...c,
          variables: c.variables.map((v, i) => 
            i === index ? { ...v, ...updates } : v
          )
        };
      }
      return c;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(criteria);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Define Eligibility Criteria
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-talosix-blue transition-colors"
            >
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={criterion.category}
                    onChange={(e) => updateCriterion(criterion.id, { category: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={criterion.type}
                    onChange={(e) => updateCriterion(criterion.id, { 
                      type: e.target.value as 'inclusion' | 'exclusion' 
                    })}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                  >
                    <option value="inclusion">Inclusion</option>
                    <option value="exclusion">Exclusion</option>
                  </select>
                </div>
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeCriterion(criterion.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={criterion.description}
                  onChange={(e) => updateCriterion(criterion.id, { description: e.target.value })}
                  rows={2}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                  placeholder="Enter criterion description..."
                />
              </div>

              <div className="space-y-4">
                {criterion.variables.map((variable, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Variable
                      </label>
                      <input
                        type="text"
                        value={variable.name}
                        onChange={(e) => updateVariable(criterion.id, index, { name: e.target.value })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                        placeholder="e.g., age, weight"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operator
                      </label>
                      <select
                        value={variable.operator}
                        onChange={(e) => updateVariable(criterion.id, index, { operator: e.target.value })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                      >
                        {operators.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={variable.value}
                        onChange={(e) => updateVariable(criterion.id, index, { value: e.target.value })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                        placeholder="Enter value..."
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeVariable(criterion.id, index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addVariable(criterion.id)}
                className="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Variable
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={addCriterion}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Criterion
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}