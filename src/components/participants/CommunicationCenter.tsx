import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Bell, 
  Calendar,
  Clock,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Send,
  Phone,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  ArrowRight,
  BarChart2
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  category: string;
  lastUsed: string;
  status: 'active' | 'draft';
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'mixed';
  status: 'active' | 'scheduled' | 'completed' | 'draft';
  trigger: 'manual' | 'scheduled' | 'event';
  audience: string;
  progress: number;
  startDate: string;
  endDate?: string;
  metrics: {
    sent: number;
    delivered: number;
    opened?: number;
    clicked?: number;
    responded?: number;
  };
}

export default function CommunicationCenter() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  const templates: Template[] = [
    {
      id: '1',
      name: 'Visit Reminder',
      type: 'email',
      subject: 'Upcoming Study Visit Reminder',
      content: 'Dear {{participant.name}}, This is a reminder about your upcoming visit scheduled for {{visit.date}}...',
      category: 'Reminders',
      lastUsed: '2 days ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Form Completion',
      type: 'sms',
      content: 'Hi {{participant.firstName}}, please complete your daily symptom diary for {{study.name}}. Click here: {{form.link}}',
      category: 'Forms',
      lastUsed: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to {{study.name}}',
      content: 'Welcome {{participant.name}}, Thank you for participating in our study...',
      category: 'Onboarding',
      lastUsed: '5 days ago',
      status: 'active'
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Weekly Check-in Campaign',
      type: 'mixed',
      status: 'active',
      trigger: 'scheduled',
      audience: 'All Active Participants',
      progress: 65,
      startDate: '2024-02-01',
      endDate: '2024-05-01',
      metrics: {
        sent: 450,
        delivered: 442,
        opened: 380,
        clicked: 310,
        responded: 285
      }
    },
    {
      id: '2',
      name: 'Visit Reminder Sequence',
      type: 'email',
      status: 'scheduled',
      trigger: 'event',
      audience: 'Upcoming Visits (7 days)',
      progress: 0,
      startDate: '2024-03-15',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        responded: 0
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`${
              activeTab === 'campaigns'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`${
              activeTab === 'templates'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Mail className="h-5 w-5 mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                name: 'Active Campaigns', 
                value: '3', 
                change: '+1 this week',
                icon: MessageSquare,
                color: 'text-blue-600',
                bg: 'bg-blue-100'
              },
              { 
                name: 'Messages Sent', 
                value: '1,234', 
                change: '+123 today',
                icon: Send,
                color: 'text-green-600',
                bg: 'bg-green-100'
              },
              { 
                name: 'Response Rate', 
                value: '87%', 
                change: '+2.3%',
                icon: BarChart2,
                color: 'text-purple-600',
                bg: 'bg-purple-100'
              },
              { 
                name: 'Pending Actions', 
                value: '12', 
                change: '-3 today',
                icon: Clock,
                color: 'text-yellow-600',
                bg: 'bg-yellow-100'
              }
            ].map((stat) => (
              <div
                key={stat.name}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
              >
                <dt>
                  <div className={`absolute rounded-md p-3 ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                </dt>
                <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    {stat.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>

          {/* Campaign List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Active Campaigns</h3>
                <button
                  onClick={() => setShowNewCampaign(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </button>
              </div>

              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{campaign.name}</h4>
                        <div className="mt-1 flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                              campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              campaign.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'}`}
                          >
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {campaign.type === 'email' ? 'Email Only' :
                             campaign.type === 'sms' ? 'SMS Only' : 'Email + SMS'}
                          </span>
                          <span className="text-sm text-gray-500">{campaign.audience}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-500">
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-indigo-600">
                              Progress: {campaign.progress}%
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block">
                              {campaign.startDate} {campaign.endDate ? `- ${campaign.endDate}` : ''}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${campaign.progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {campaign.metrics && (
                      <div className="mt-4 grid grid-cols-5 gap-4">
                        {Object.entries(campaign.metrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-2xl font-semibold text-gray-900">{value}</div>
                            <div className="text-xs text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Message Templates</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your email and SMS templates for various communication scenarios
                </p>
              </div>
              <button
                onClick={() => setShowNewTemplate(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <select className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                          ${template.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                        >
                          {template.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{template.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-500">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {template.type === 'email' && template.subject && (
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Subject:</span> {template.subject}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 line-clamp-2">{template.content}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Last used {template.lastUsed}</span>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                      Use Template
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Communication Settings</h3>
            
            <div className="space-y-6">
              {/* Email Settings */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Email Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sender Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Study Team"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reply-to Email</label>
                    <input
                      type="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="study@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* SMS Settings */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">SMS Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SMS Provider</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option>Twilio</option>
                      <option>MessageBird</option>
                      <option>Vonage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sender ID</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="STUDY"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Rules */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Default Notification Rules</h4>
                <div className="space-y-4">
                  {[
                    { name: 'Visit Reminders', description: 'Send reminder 24 hours before scheduled visit' },
                    { name: 'Form Completion', description: 'Send reminder if form is not completed within 48 hours' },
                    { name: 'Query Response', description: 'Notify when new query requires attention' }
                  ].map((rule) => (
                    <div key={rule.name} className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">{rule.name}</h5>
                        <p className="text-sm text-gray-500">{rule.description}</p>
                      </div>
                      <div className="flex items-center">
                        <button className="mr-2 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600">
                          <span className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-500">
                          <Settings className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}