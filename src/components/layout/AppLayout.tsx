import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  FileText, 
  Users, 
  Settings, 
  ChevronDown,
  ChevronRight, 
  Bell, 
  Search,
  Menu,
  X,
  FileSpreadsheet,
  Microscope,
  ClipboardList,
  BookOpen,
  Stethoscope,
  ChevronLeft,
  Key,
  BarChart2,
  Building2,
  Shield,
  Workflow,
  Database,
  FileCheck2,
  AlertCircle,
  LineChart,
  BookOpenCheck,
  Boxes,
  Network,
  HelpCircle,
  LifeBuoy,
  Briefcase,
  UserCog,
  ScrollText,
  Laptop,
  BookKey,
  Brain,
  Calendar,
  Lightbulb,
  CheckCircle2,
  FormInput,
  Map,
  Download,
  UserCircle,
  UserPlus,
  MessageSquare,
  AlertTriangle,
  MessageCircle,
  Mail,
  Share2
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import clsx from 'classnames';

interface AppLayoutProps {
  children: React.ReactNode;
  onSignOut?: () => void;
}

export default function AppLayout({ children, onSignOut }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['study']);
  const location = useLocation();
  const { openAIApiKey } = useSettingsStore();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/app/dashboard', 
      icon: LayoutGrid 
    },
    {
      name: 'Study Setup',
      group: 'study',
      icon: FileText,
      children: [
        { name: 'Study Setup', href: '/app/study-setup', icon: Workflow },
        { name: 'Protocol Analysis', href: '/app/protocol-analysis', icon: FileText },
        { name: 'Form Builder', href: '/app/form-builder', icon: FormInput },
        { name: 'Study Schedule', href: '/app/study-schedule', icon: Calendar },
        { 
          name: 'AI Suggestions', 
          href: '/app/ai-suggestions', 
          icon: Lightbulb,
          requiresApiKey: true 
        },
        { name: 'Validation Rules', href: '/app/validation-rules', icon: CheckCircle2 },
      ]
    },
    {
      name: 'Data Collection',
      group: 'data',
      icon: Database,
      children: [
        { name: 'Data Entry', href: '/app/data-entry', icon: FileText },
        { name: 'Query Management', href: '/app/queries', icon: AlertCircle },
        { name: 'Data Export', href: '/app/export', icon: Download }
      ]
    },
    {
      name: 'Site Management',
      group: 'sites',
      icon: Building2,
      children: [
        { name: 'Sites Overview', href: '/app/sites', icon: Map },
        { name: 'Investigator Directory', href: '/app/investigators', icon: UserCog },
        { name: 'Site Staff', href: '/app/site-staff', icon: Users },
        { name: 'Site Documents', href: '/app/site-documents', icon: FileText },
        { name: 'Site Monitoring', href: '/app/monitoring', icon: LineChart }
      ]
    },
    {
      name: 'Subject Management',
      group: 'subjects',
      icon: UserCircle,
      children: [
        { name: 'Subject Registry', href: '/app/subjects', icon: ClipboardList },
        { name: 'Screening & Enrollment', href: '/app/enrollment', icon: UserPlus },
        { name: 'Visit Schedule', href: '/app/subject-schedule', icon: Calendar },
        { name: 'Subject Communications', href: '/app/subject-comms', icon: MessageSquare },
        { name: 'Adverse Events', href: '/app/adverse-events', icon: AlertTriangle }
      ]
    },
    {
      name: 'Communications',
      group: 'communications',
      icon: MessageCircle,
      children: [
        { name: 'Announcements', href: '/app/announcements', icon: Bell },
        { name: 'Site Messages', href: '/app/site-messages', icon: Mail },
        { name: 'Document Distribution', href: '/app/document-distribution', icon: Share2 }
      ]
    },
    {
      name: 'Monitoring',
      group: 'monitoring',
      icon: LineChart,
      children: [
        { name: 'Monitoring Plans', href: '/app/monitoring-plans', icon: BookOpenCheck },
        { name: 'Site Visits', href: '/app/site-visits', icon: Building2 },
        { name: 'Risk Management', href: '/app/risk-management', icon: AlertCircle },
        { name: 'Action Items', href: '/app/action-items', icon: ClipboardList },
      ]
    },
    {
      name: 'Data Management',
      group: 'datamanagement',
      icon: BarChart2,
      children: [
        { name: 'Data Exports', href: '/app/data-exports', icon: Database },
        { name: 'Query Management', href: '/app/query-management', icon: AlertCircle },
        { name: 'Data Cleaning', href: '/app/data-cleaning', icon: FileCheck2 },
        { name: 'Coding', href: '/app/coding', icon: BookKey },
        { name: 'Reports', href: '/app/reports', icon: BarChart2 },
      ]
    },
    {
      name: 'Study Inventory',
      group: 'inventory',
      icon: Boxes,
      children: [
        { name: 'Supply Management', href: '/app/supplies', icon: Boxes },
        { name: 'Drug Accountability', href: '/app/drug-accountability', icon: Briefcase },
        { name: 'Sample Tracking', href: '/app/sample-tracking', icon: Network },
      ]
    },
    { 
      name: 'Documentation', 
      href: '/app/docs', 
      icon: BookOpen 
    },
    { 
      name: 'Clinical Review', 
      href: '/app/clinical-review', 
      icon: Stethoscope 
    },
    {
      name: 'Administration',
      group: 'admin',
      icon: Settings,
      children: [
        { name: 'User Management', href: '/app/users', icon: UserCog },
        { name: 'Role & Permissions', href: '/app/roles', icon: Shield },
        { name: 'API Integration', href: '/app/api-keys', icon: Key },
        { name: 'System Settings', href: '/app/settings', icon: Settings },
        { name: 'Audit Trail', href: '/app/audit', icon: ScrollText },
        { name: 'Electronic Signatures', href: '/app/signatures', icon: FileCheck2 },
      ]
    },
    {
      name: 'Help & Support',
      group: 'help',
      icon: HelpCircle,
      children: [
        { name: 'Training', href: '/app/training', icon: Laptop },
        { name: 'Documentation', href: '/app/help-docs', icon: BookOpen },
        { name: 'Support', href: '/app/support', icon: LifeBuoy },
      ]
    }
  ];

  const bottomNavigation = [
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ];

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className={clsx(
        'fixed top-0 left-0 bottom-0 bg-[#0B1629] transition-all duration-200 ease-in-out z-30',
        'overflow-y-auto scrollbar-thin scrollbar-thumb-[#1E293B] scrollbar-track-[#0B1629]',
        isSidebarOpen ? 'w-64' : 'w-20'
      )}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 bg-[#0A1221]">
          <div className="flex items-center space-x-2">
            <img src="https://framerusercontent.com/images/021L73kQYq9ZIfe4FnXRxtsHM.svg" alt="Logo" className="h-8 w-8" />
            {isSidebarOpen && (
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#0EA5E9] to-[#2DD4BF]">
                Talosix EDC
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-1 text-gray-400 hover:bg-[#1E293B] transition-colors"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(`/app/${item.group || item.href}`);
            return (
              <div key={item.name} className="space-y-1">
                {!item.children ? (
                  <Link
                    to={item.href}
                    className={clsx(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'text-gray-300 hover:text-white hover:bg-[#1E293B]'
                    )}
                  >
                    <item.icon className={clsx(
                      'flex-shrink-0 transition-colors duration-150',
                      isSidebarOpen ? 'mr-3 h-5 w-5' : 'h-6 w-6'
                    )} />
                    {isSidebarOpen && item.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleGroup(item.group)}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                        isActive ? 'bg-[#1E293B] text-white' : 'text-gray-300 hover:text-white hover:bg-[#1E293B]'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className={clsx(
                          'flex-shrink-0 transition-colors duration-150',
                          isSidebarOpen ? 'mr-3 h-5 w-5' : 'h-6 w-6'
                        )} />
                        {isSidebarOpen && item.name}
                      </div>
                      {isSidebarOpen && (
                        <ChevronDown
                          className={clsx(
                            'h-4 w-4 transition-transform duration-200',
                            expandedGroups.includes(item.group) ? 'transform rotate-180' : ''
                          )}
                        />
                      )}
                    </button>
                    
                    {expandedGroups.includes(item.group) && isSidebarOpen && (
                      <div className="ml-4 pl-4 border-l border-[#1E293B] space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = location.pathname === child.href;
                          const showItem = !child.requiresApiKey || (child.requiresApiKey && openAIApiKey);
                          
                          return showItem && (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={clsx(
                                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                                isChildActive
                                  ? 'bg-[#2563EB] text-white'
                                  : 'text-gray-300 hover:text-white hover:bg-[#1E293B]'
                              )}
                            >
                              <child.icon className={clsx(
                                'mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-150'
                              )} />
                              {child.name}
                              {child.requiresApiKey && !openAIApiKey && (
                                <AlertCircle className="ml-2 h-4 w-4 text-amber-500" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E293B]">
          {bottomNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                'text-gray-300 hover:text-white hover:bg-[#1E293B]'
              )}
            >
              <item.icon className={clsx(
                'flex-shrink-0 transition-colors duration-150',
                isSidebarOpen ? 'mr-3 h-5 w-5' : 'h-6 w-6'
              )} />
              {isSidebarOpen && item.name}
            </Link>
          ))}
          <button
            onClick={onSignOut}
            className={clsx(
              'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
              'text-gray-300 hover:text-white hover:bg-[#1E293B]'
            )}
          >
            <Shield className={clsx(
              'flex-shrink-0 transition-colors duration-150',
              isSidebarOpen ? 'mr-3 h-5 w-5' : 'h-6 w-6'
            )} />
            {isSidebarOpen && 'Sign out'}
          </button>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={clsx(
        'flex-1 min-w-0 flex flex-col',
        isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
      )}>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
