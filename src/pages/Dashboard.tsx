import React, { useState, useEffect } from 'react';
import {
  Users,
  FileSpreadsheet,
  ClipboardCheck,
  AlertCircle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
} from 'lucide-react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useStore } from '../store';

export default function Dashboard() {
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const { hasSeenTour, setHasSeenTour } = useStore();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcomeGuide(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcomeGuide(false);
  };

  const stats = [
    {
      name: 'Active Studies',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: FileSpreadsheet,
    },
    {
      name: 'Total Participants',
      value: '2,847',
      change: '+18%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Data Quality',
      value: '98.5%',
      change: '+2.1%',
      changeType: 'increase',
      icon: CheckCircle2,
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'form_submission',
      study: 'CARD-001',
      description: 'Visit 2 CRF completed',
      user: 'Sarah Chen',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'query',
      study: 'ONCO-274',
      description: 'New query on adverse event form',
      user: 'Dr. James Wilson',
      time: '15 minutes ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'enrollment',
      study: 'DIAB-112',
      description: 'New participant enrolled',
      user: 'Maria Garcia',
      time: '1 hour ago',
      status: 'success'
    }
  ];

  const activeStudies = [
    {
      id: 'CARD-001',
      name: 'Cardiovascular Outcomes Study',
      progress: 68,
      sites: 12,
      participants: 450,
      status: 'active'
    },
    {
      id: 'ONCO-274',
      name: 'Phase III Oncology Trial',
      progress: 42,
      sites: 8,
      participants: 180,
      status: 'active'
    },
    {
      id: 'DIAB-112',
      name: 'Diabetes Prevention Study',
      progress: 89,
      sites: 15,
      participants: 720,
      status: 'active'
    }
  ];

  const steps = [
    {
      target: '.dashboard-overview',
      content: 'Welcome to TalosIX EDC! This is your command center for all clinical research activities.',
      placement: 'center',
    },
    {
      target: '.study-metrics',
      content: 'Track your key study metrics and progress in real-time.',
      placement: 'bottom',
    },
    {
      target: '.ai-assistant',
      content: 'Need help? Our AI assistant is here to guide you through any process.',
      placement: 'left',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setHasSeenTour(true);
    }
  };

  return (
    <div className="space-y-6 dashboard-overview">
      <Joyride
        steps={steps}
        run={!hasSeenTour}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#0EA5E9',
            zIndex: 1000,
          },
        }}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of your clinical research activities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-primary flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Review
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 study-metrics">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="mt-1 flex items-baseline">
                  <div className="flex items-center text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div className={`ml-2 flex items-baseline text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </div>
                </dd>
              </div>
              <div className={`p-3 rounded-lg ${
                stat.changeType === 'increase' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <Icon className={`h-6 w-6 ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Studies */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Active Studies</h2>
            <button className="btn-text">
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {activeStudies.map((study) => (
              <div key={study.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-400" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {study.name}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{study.sites} sites</span>
                    <span>•</span>
                    <span>{study.participants} participants</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{study.progress}%</span>
                    <BarChart3 className="ml-2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <button className="btn-text">
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-green-50' :
                  activity.status === 'warning' ? 'bg-yellow-50' :
                  'bg-red-50'
                }`}>
                  {activity.status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                  {activity.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                  {activity.status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">
                    <span>{activity.study}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.user}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center text-sm text-gray-500">
                  <Clock className="mr-1.5 h-4 w-4" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Guide */}
      {showWelcomeGuide && (
        <div className="modal-backdrop">
          <div className="modal-content mx-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Welcome to TalosIX EDC
              </h2>
              <p className="text-gray-600 mb-6">
                Let's get you started with your clinical research journey. Would you like a quick tour
                of the platform?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCloseWelcome}
                  className="btn-secondary"
                >
                  Skip
                </button>
                <button
                  onClick={() => {
                    handleCloseWelcome();
                    setHasSeenTour(false);
                  }}
                  className="btn-primary"
                >
                  Start Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}