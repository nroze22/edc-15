import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react';
import GlobalSettings from '../components/settings/GlobalSettings';

interface AppLayoutProps {
  children: React.ReactNode;
  onSignOut: () => void;
}

export default function AppLayout({ children, onSignOut }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Study Setup', href: '/app/study-setup', icon: Settings },
    { name: 'Protocol Analysis', href: '/app/protocol-analysis', icon: FileText },
    { name: 'Participants', href: '/app/participants', icon: Users },
    { name: 'Study Management', href: '/app/study-management', icon: ClipboardList },
  ];

  const handleSignOut = () => {
    onSignOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 bg-gradient-to-b from-talosix-navy to-talosix-blue transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center h-16 px-4 border-b border-white/10">
          <img 
            src="https://framerusercontent.com/images/021L73kQYq9ZIfe4FnXRxtsHM.svg" 
            alt="Talosix" 
            className="h-8 w-8"
          />
          {!isSidebarCollapsed && (
            <span className="ml-2 text-xl font-codec font-bold text-white">Talosix</span>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="ml-auto text-white/80 hover:text-white"
          >
            <ChevronLeft className={`h-5 w-5 transform transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.href);
              }}
              className={`
                group flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 transition-all duration-150
                ${location.pathname === item.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className={`${isSidebarCollapsed ? 'mx-auto' : 'mr-3'} h-6 w-6`} />
              {!isSidebarCollapsed && <span>{item.name}</span>}
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex-1 flex items-center">
              <div className="max-w-2xl w-full lg:max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search across studies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-talosix-blue focus:border-talosix-blue"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSettings />
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
                <HelpCircle className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
              <div className="border-l border-gray-200 h-6 mx-2"></div>
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
                <button
                  onClick={handleSignOut}
                  className="ml-3 text-sm font-medium text-gray-700 hover:text-gray-800 flex items-center"
                >
                  <span className="mr-2">Sign Out</span>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}