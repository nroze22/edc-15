import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAISuggestionsStore, Suggestion } from '../stores/aiSuggestionsStore';

export default function AISuggestions() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    suggestions,
    selectedSuggestions,
    loading,
    error,
    toggleSuggestion,
    applySuggestions,
    fetchSuggestions,
    clearError
  } = useAISuggestionsStore();

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const categories = [
    { id: 'all', name: 'All Suggestions' },
    { id: 'protocol', name: 'Protocol Design' },
    { id: 'forms', name: 'Form Design' },
    { id: 'validation', name: 'Data Validation' },
    { id: 'workflow', name: 'Study Workflow' }
  ];

  const filteredSuggestions = suggestions.filter(suggestion => 
    (selectedCategory === 'all' || suggestion.category === selectedCategory) &&
    (suggestion.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
     suggestion.recommendation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'validation':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Suggestions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and apply AI-powered recommendations to optimize your study
            </p>
          </div>
          <button 
            onClick={() => applySuggestions(Array.from(selectedSuggestions))}
            disabled={selectedSuggestions.size === 0 || loading}
            className={`btn-primary flex items-center ${
              (selectedSuggestions.size === 0 || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Applying...' : 'Apply Selected'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={clearError}
                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suggestions..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border-2 rounded-lg p-4 transition-colors ${
                selectedSuggestions.has(suggestion.id)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    checked={selectedSuggestions.has(suggestion.id)}
                    onChange={() => toggleSuggestion(suggestion.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getTypeIcon(suggestion.type)}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {suggestion.message}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getImpactColor(suggestion.impact)
                    }`}>
                      {suggestion.impact} impact
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {suggestion.recommendation}
                  </p>
                  {suggestion.autoFixAvailable && (
                    <div className="mt-2">
                      <button className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-500">
                        Apply suggestion automatically
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
