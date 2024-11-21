import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  Search,
  Bell,
} from 'lucide-react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useStore } from '../store';

export default function Dashboard() {
  const navigate = useNavigate();
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
      description: 'Currently running clinical trials'
    },
    {
      name: 'Total Participants',
      value: '2,847',
      change: '+18%',
      changeType: 'increase',
      icon: Users,
      description: 'Across all active studies'
    },
    {
      name: 'Data Quality',
      value: '98.5%',
      change: '+2.1%',
      changeType: 'increase',
      icon: CheckCircle2,
      description: 'Overall data completion rate'
    },
    {
      name: 'Open Queries',
      value: '24',
      change: '-5',
      changeType: 'decrease',
      icon: AlertCircle,
      description: 'Requiring attention'
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
      status: 'active',
      phase: 'Phase III'
    },
    {
      id: 'ONCO-274',
      name: 'Phase III Oncology Trial',
      progress: 42,
      sites: 8,
      participants: 180,
      status: 'active',
      phase: 'Phase III'
    },
    {
      id: 'DIAB-112',
      name: 'Diabetes Prevention Study',
      progress: 89,
      sites: 15,
      participants: 720,
      status: 'active',
      phase: 'Phase IV'
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
    <div className="p-6 max-w-[1920px] mx-auto dashboard-overview">
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

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your clinical research activities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search studies..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Study
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 study-metrics">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.changeType === 'increase' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Studies */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Active Studies</h2>
                <p className="text-sm text-gray-500">Current clinical trials in progress</p>
              </div>
              <button className="btn-text">
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {activeStudies.map((study) => (
                <div
                  key={study.id}
                  onClick={() => navigate(`/app/study/${study.id}`)}
                  className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {study.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">{study.phase}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{study.participants}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FileSpreadsheet className="h-4 w-4 mr-1" />
                          <span>{study.sites} sites</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">{study.progress}%</span>
                        <BarChart3 className="ml-2 h-4 w-4 text-gray-400" />
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${study.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-500">Latest updates across studies</p>
              </div>
              <button className="btn-text">
                View all
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
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
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="mt-1 text-xs text-gray-500">
                      <span className="font-medium">{activity.study}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.user}</span>
                    </div>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <Clock className="mr-1 h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Guide */}
      {showWelcomeGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Skip
                </button>
                <button
                  onClick={() => {
                    handleCloseWelcome();
                    setHasSeenTour(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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