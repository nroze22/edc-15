import React, { useState } from 'react';
import { Settings, Save, Building2, Users, FileText, Mail, Phone, Globe, MapPin } from 'lucide-react';

interface SiteSetupForm {
  basicInfo: {
    siteName: string;
    siteNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
    website: string;
  };
  contacts: {
    principalInvestigator: string;
    studyCoordinator: string;
    regulatoryContact: string;
    pharmacist: string;
  };
  capabilities: {
    maxEnrollment: number;
    hasPharmacy: boolean;
    hasLab: boolean;
    hasImaging: boolean;
    certifications: string[];
  };
}

export default function SiteSetup() {
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState<SiteSetupForm>({
    basicInfo: {
      siteName: '',
      siteNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      phone: '',
      email: '',
      website: '',
    },
    contacts: {
      principalInvestigator: '',
      studyCoordinator: '',
      regulatoryContact: '',
      pharmacist: '',
    },
    capabilities: {
      maxEnrollment: 0,
      hasPharmacy: false,
      hasLab: false,
      hasImaging: false,
      certifications: [],
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', form);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Site Setup</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure site details, contacts, and capabilities
          </p>
        </div>
        <button
          onClick={handleSubmit}
          className="btn-primary flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'basic', name: 'Basic Information', icon: Building2 },
            { id: 'contacts', name: 'Site Contacts', icon: Users },
            { id: 'capabilities', name: 'Site Capabilities', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon className={clsx(
                'h-5 w-5 mr-2',
                activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              )} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input
                type="text"
                value={form.basicInfo.siteName}
                onChange={(e) => setForm({
                  ...form,
                  basicInfo: { ...form.basicInfo, siteName: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Number</label>
              <input
                type="text"
                value={form.basicInfo.siteNumber}
                onChange={(e) => setForm({
                  ...form,
                  basicInfo: { ...form.basicInfo, siteNumber: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={form.basicInfo.address}
                onChange={(e) => setForm({
                  ...form,
                  basicInfo: { ...form.basicInfo, address: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={form.basicInfo.city}
                onChange={(e) => setForm({
                  ...form,
                  basicInfo: { ...form.basicInfo, city: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State/Province</label>
              <input
                type="text"
                value={form.basicInfo.state}
                onChange={(e) => setForm({
                  ...form,
                  basicInfo: { ...form.basicInfo, state: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={form.basicInfo.country}
                onChange={(e) => setForm({
                  ...form,
                  basicInfo: { ...form.basicInfo, country: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                value={form.basicInfo.postalCode}
                onChange={(e) => setForm({
                  ...form,
                  basicInfo: { ...form.basicInfo, postalCode: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {Object.entries(form.contacts).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setForm({
                    ...form,
                    contacts: { ...form.contacts, [key]: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Enrollment Capacity</label>
              <input
                type="number"
                value={form.capabilities.maxEnrollment}
                onChange={(e) => setForm({
                  ...form,
                  capabilities: { ...form.capabilities, maxEnrollment: parseInt(e.target.value) }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'hasPharmacy', label: 'On-site Pharmacy' },
                { id: 'hasLab', label: 'Laboratory Facilities' },
                { id: 'hasImaging', label: 'Imaging Capabilities' },
              ].map((capability) => (
                <div key={capability.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.capabilities[capability.id as keyof typeof form.capabilities.hasPharmacy]}
                    onChange={(e) => setForm({
                      ...form,
                      capabilities: {
                        ...form.capabilities,
                        [capability.id]: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    {capability.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
