import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Search, Filter, FileText, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { useCRFStore } from '../../store/crfStore';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  previewUrl?: string;
  lastUpdated: string;
}

const defaultTemplates: Template[] = [
  {
    id: 'demographics',
    name: 'Demographics',
    description: 'Standard demographics form with basic patient information',
    category: 'Common Forms',
    tags: ['demographics', 'patient info', 'basic'],
    lastUpdated: '2024-01-15',
  },
  {
    id: 'medical-history',
    name: 'Medical History',
    description: 'Comprehensive medical history collection form',
    category: 'Common Forms',
    tags: ['medical', 'history', 'conditions'],
    lastUpdated: '2024-01-15',
  },
  {
    id: 'vital-signs',
    name: 'Vital Signs',
    description: 'Standard vital signs collection form',
    category: 'Clinical Forms',
    tags: ['vitals', 'measurements', 'clinical'],
    lastUpdated: '2024-01-15',
  },
  {
    id: 'adverse-events',
    name: 'Adverse Events',
    description: 'Detailed adverse event reporting form',
    category: 'Safety Forms',
    tags: ['safety', 'adverse events', 'reporting'],
    lastUpdated: '2024-01-15',
  },
  {
    id: 'concomitant-medications',
    name: 'Concomitant Medications',
    description: 'Medication tracking and history form',
    category: 'Clinical Forms',
    tags: ['medications', 'tracking', 'clinical'],
    lastUpdated: '2024-01-15',
  },
];

const TemplateLibrary: React.FC<{ onSelectTemplate: (template: Template) => void }> = ({
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [templates] = useState<Template[]>(defaultTemplates);

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Template Library</h2>
        <Button variant="outline" onClick={() => onSelectTemplate(templates[0])}>
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Template
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            className="form-select"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{template.category}</span>
                  <span>Updated: {template.lastUpdated}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
