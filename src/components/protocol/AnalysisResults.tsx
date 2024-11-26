import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Calendar,
  BarChart3,
  ArrowRight,
  Filter,
  Brain,
  ClipboardList,
  Activity,
  Target,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'classnames';
import { AnalysisResult } from '../../types/protocol';

interface AnalysisResultsProps {
  results: AnalysisResult;
  onSuggestionSelection: (selectedSuggestions: string[], includeSchedule: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

export default function AnalysisResults({
  results,
  onSuggestionSelection,
  isLoading,
  error
}: AnalysisResultsProps) {
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [includeSchedule, setIncludeSchedule] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const sections = [
    {
      id: 'overview',
      title: 'Study Overview',
      icon: FileText,
      content: results.studyOverview
    },
    {
      id: 'criteria',
      title: 'Inclusion/Exclusion Criteria',
      icon: ClipboardList,
      content: {
        inclusion: results.inclusionCriteria,
        exclusion: results.exclusionCriteria
      }
    },
    {
      id: 'procedures',
      title: 'Study Procedures',
      icon: Activity,
      content: results.procedures
    },
    {
      id: 'schedule',
      title: 'Visit Schedule',
      icon: Calendar,
      content: results.schedule
    },
    {
      id: 'safety',
      title: 'Safety Parameters',
      icon: AlertTriangle,
      content: results.safetyParameters
    },
    {
      id: 'endpoints',
      title: 'Study Endpoints',
      icon: Target,
      content: results.endpoints
    },
    {
      id: 'statistics',
      title: 'Statistical Analysis',
      icon: Calculator,
      content: results.statistics
    }
  ];

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSuggestionToggle = (id: string) => {
    setSelectedSuggestions(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleApplySelected = () => {
    onSuggestionSelection(selectedSuggestions, includeSchedule);
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderSectionContent = (section: any) => {
    switch (section.id) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(section.content).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-gray-500 capitalize">{key}</h4>
                  <p className="mt-1 text-gray-900">{value as string}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'criteria':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Inclusion Criteria</h4>
              <ul className="space-y-2">
                {section.content.inclusion.map((criterion: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="mt-1 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Exclusion Criteria</h4>
              <ul className="space-y-2">
                {section.content.exclusion.map((criterion: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="mt-1 text-red-500">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'procedures':
        return (
          <div className="space-y-4">
            {section.content.map((procedure: any, index: number) => (
              <motion.div
                key={index}
                className="border rounded-lg overflow-hidden"
                initial={false}
              >
                <button
                  onClick={() => toggleItem(`procedure-${index}`)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-medium">{procedure.name}</span>
                  {expandedItems.includes(`procedure-${index}`) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedItems.includes(`procedure-${index}`) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50 space-y-3">
                        <p className="text-gray-700">{procedure.description}</p>
                        <div className="space-y-2">
                          <p><span className="font-medium">Timing:</span> {procedure.timing}</p>
                          <p><span className="font-medium">Frequency:</span> {procedure.frequency}</p>
                          {procedure.requirements.length > 0 && (
                            <div>
                              <p className="font-medium">Requirements:</p>
                              <ul className="list-disc pl-5">
                                {procedure.requirements.map((req: string, idx: number) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        );

      // Add more cases for other sections...

      default:
        return <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
          {JSON.stringify(section.content, null, 2)}
        </pre>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
        <span className="ml-3 text-lg font-medium">Analyzing protocol...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="ml-2 text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <Filter className="w-5 h-5 text-gray-500" />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-select rounded-md border-gray-300"
        >
          <option value="all">All Categories</option>
          {/* Add category options */}
        </select>
        <select
          value={filterImpact}
          onChange={(e) => setFilterImpact(e.target.value)}
          className="form-select rounded-md border-gray-300"
        >
          <option value="all">All Impact Levels</option>
          <option value="high">High Impact</option>
          <option value="medium">Medium Impact</option>
          <option value="low">Low Impact</option>
        </select>
      </div>

      {/* Analysis Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <section.icon className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{section.title}</span>
              </div>
              {activeSection === section.id ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <AnimatePresence>
              {activeSection === section.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t">
                    {renderSectionContent(section)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeSchedule}
            onChange={(e) => setIncludeSchedule(e.target.checked)}
            className="form-checkbox rounded text-blue-600"
          />
          <span>Include Schedule of Assessments</span>
        </label>
        <button
          onClick={handleApplySelected}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply Selected Changes
        </button>
      </div>
    </div>
  );
}