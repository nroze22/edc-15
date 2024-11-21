import React, { useState } from 'react';
import { 
  FileText, 
  Building2, 
  Users, 
  Calendar,
  Flask,
  Target,
  Globe,
  Shield,
  BookOpen,
  Stethoscope
} from 'lucide-react';

interface StudyMetadata {
  studyTitle: string;
  protocolNumber: string;
  phase: string;
  sponsorName: string;
  sponsorContact: string;
  therapeuticArea: string;
  indication: string;
  studyType: string;
  startDate: string;
  endDate: string;
  targetEnrollment: number;
  numberOfSites: number;
  countries: string[];
  primaryObjective: string;
  secondaryObjectives: string[];
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  regulatoryStatus: {
    fda?: string;
    ema?: string;
    other?: Record<string, string>;
  };
}

export default function StudyInformation() {
  const [studyData, setStudyData] = useState<StudyMetadata>({
    studyTitle: '',
    protocolNumber: '',
    phase: '',
    sponsorName: '',
    sponsorContact: '',
    therapeuticArea: '',
    indication: '',
    studyType: '',
    startDate: '',
    endDate: '',
    targetEnrollment: 0,
    numberOfSites: 0,
    countries: [],
    primaryObjective: '',
    secondaryObjectives: [],
    inclusionCriteria: [],
    exclusionCriteria: [],
    regulatoryStatus: {}
  });

  const sections = [
    {
      title: 'Basic Information',
      icon: FileText,
      fields: [
        { key: 'studyTitle', label: 'Study Title', type: 'text' },
        { key: 'protocolNumber', label: 'Protocol Number', type: 'text' },
        { key: 'phase', label: 'Phase', type: 'select', options: ['I', 'II', 'III', 'IV', 'Other'] },
        { key: 'studyType', label: 'Study Type', type: 'select', options: ['Interventional', 'Observational', 'Expanded Access'] }
      ]
    },
    {
      title: 'Sponsor Information',
      icon: Building2,
      fields: [
        { key: 'sponsorName', label: 'Sponsor Name', type: 'text' },
        { key: 'sponsorContact', label: 'Sponsor Contact', type: 'text' }
      ]
    },
    {
      title: 'Medical Information',
      icon: Stethoscope,
      fields: [
        { key: 'therapeuticArea', label: 'Therapeutic Area', type: 'text' },
        { key: 'indication', label: 'Indication', type: 'text' }
      ]
    },
    {
      title: 'Study Timeline',
      icon: Calendar,
      fields: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' }
      ]
    },
    {
      title: 'Study Size',
      icon: Target,
      fields: [
        { key: 'targetEnrollment', label: 'Target Enrollment', type: 'number' },
        { key: 'numberOfSites', label: 'Number of Sites', type: 'number' }
      ]
    },
    {
      title: 'Geographic Distribution',
      icon: Globe,
      fields: [
        { key: 'countries', label: 'Countries', type: 'tags' }
      ]
    },
    {
      title: 'Study Objectives',
      icon: Target,
      fields: [
        { key: 'primaryObjective', label: 'Primary Objective', type: 'textarea' },
        { key: 'secondaryObjectives', label: 'Secondary Objectives', type: 'list' }
      ]
    },
    {
      title: 'Eligibility Criteria',
      icon: Shield,
      fields: [
        { key: 'inclusionCriteria', label: 'Inclusion Criteria', type: 'list' },
        { key: 'exclusionCriteria', label: 'Exclusion Criteria', type: 'list' }
      ]
    },
    {
      title: 'Regulatory Information',
      icon: BookOpen,
      fields: [
        { key: 'regulatoryStatus.fda', label: 'FDA Status', type: 'text' },
        { key: 'regulatoryStatus.ema', label: 'EMA Status', type: 'text' }
      ]
    }
  ];

  const handleInputChange = (key: string, value: any) => {
    setStudyData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Study Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Core metadata and essential information about the clinical trial
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="flex items-center">
                  <section.icon className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {section.title}
                  </h3>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <div key={field.key} className="col-span-1">
                      <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      {field.type === 'text' && (
                        <input
                          type="text"
                          name={field.key}
                          id={field.key}
                          value={studyData[field.key as keyof StudyMetadata] as string}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}
                      {field.type === 'select' && (
                        <select
                          id={field.key}
                          name={field.key}
                          value={studyData[field.key as keyof StudyMetadata] as string}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Select...</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          name={field.key}
                          id={field.key}
                          value={studyData[field.key as keyof StudyMetadata] as string}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          name={field.key}
                          id={field.key}
                          value={studyData[field.key as keyof StudyMetadata] as number}
                          onChange={(e) => handleInputChange(field.key, parseInt(e.target.value))}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          name={field.key}
                          id={field.key}
                          rows={3}
                          value={studyData[field.key as keyof StudyMetadata] as string}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}
                      {field.type === 'list' && (
                        <div className="mt-1 space-y-2">
                          {(studyData[field.key as keyof StudyMetadata] as string[]).map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const newList = [...(studyData[field.key as keyof StudyMetadata] as string[])];
                                  newList[index] = e.target.value;
                                  handleInputChange(field.key, newList);
                                }}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newList = [...(studyData[field.key as keyof StudyMetadata] as string[])];
                                  newList.splice(index, 1);
                                  handleInputChange(field.key, newList);
                                }}
                                className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <span className="sr-only">Remove</span>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newList = [...(studyData[field.key as keyof StudyMetadata] as string[]), ''];
                              handleInputChange(field.key, newList);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Add {field.label}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Study Information
          </button>
        </div>
      </div>
    </div>
  );
}
