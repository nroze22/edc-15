import React, { useState } from 'react';
import { Plus, Users, Building2, Shield, Trash2, Edit, Search } from 'lucide-react';
import TeamMemberModal from '../components/study/setup/TeamMemberModal';
import SiteModal from '../components/study/setup/SiteModal';
import RolePermissionsModal from '../components/study/setup/RolePermissionsModal';
import { useStudySetupStore } from '../store/useStudySetupStore';
import { motion } from 'framer-motion';

export default function StudySetup() {
  const [activeTab, setActiveTab] = useState('team');
  const [showTeamMemberModal, setShowTeamMemberModal] = useState(false);
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const {
    teamMembers,
    sites,
    roles,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    addSite,
    updateSite,
    removeSite,
    updateRole
  } = useStudySetupStore();

  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSites = sites.filter(site => 
    (filterStatus === 'all' || site.status === filterStatus) &&
    (site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: 'team', name: 'Team Members', icon: Users, color: 'blue' },
    { id: 'sites', name: 'Sites', icon: Building2, color: 'emerald' },
    { id: 'roles', name: 'Roles & Permissions', icon: Shield, color: 'violet' },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Study Setup</h1>
          <p className="mt-2 text-base text-gray-600">
            Configure your study team, research sites, and access controls
          </p>
        </div>
        <button
          onClick={() => {
            switch (activeTab) {
              case 'team':
                setSelectedMember(null);
                setShowTeamMemberModal(true);
                break;
              case 'sites':
                setSelectedSite(null);
                setShowSiteModal(true);
                break;
              case 'roles':
                setSelectedRole(null);
                setShowRoleModal(true);
                break;
            }
          }}
          className={`
            inline-flex items-center px-4 py-2.5 rounded-xl text-white font-medium shadow-sm
            transition-all duration-200 transform hover:scale-105
            ${activeTab === 'team' ? 'bg-blue-600 hover:bg-blue-700' :
              activeTab === 'sites' ? 'bg-emerald-600 hover:bg-emerald-700' :
              'bg-violet-600 hover:bg-violet-700'}
          `}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add {activeTab === 'team' ? 'Team Member' : activeTab === 'sites' ? 'Site' : 'Role'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg
                font-medium text-sm transition-all duration-200
                ${isActive 
                  ? `bg-white text-${tab.color}-600 shadow-sm` 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}
              `}
            >
              <Icon className={`h-5 w-5 mr-2 ${isActive ? `text-${tab.color}-500` : 'text-gray-400'}`} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl bg-white shadow-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        {activeTab === 'sites' && (
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === 'team' && (
          <div className="divide-y divide-gray-200">
            {filteredTeamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setShowTeamMemberModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredTeamMembers.length === 0 && (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No team members found</h3>
                <p className="text-sm text-gray-500">Add team members to get started</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sites' && (
          <div className="divide-y divide-gray-200">
            {filteredSites.map((site) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{site.name}</h3>
                      <p className="text-sm text-gray-500">{site.location}</p>
                    </div>
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${site.status === 'active' ? 'bg-green-100 text-green-800' :
                        site.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedSite(site);
                      setShowSiteModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeSite(site.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {filteredSites.length === 0 && (
              <div className="p-8 text-center">
                <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No sites found</h3>
                <p className="text-sm text-gray-500">Add research sites to get started</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="divide-y divide-gray-200">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setShowRoleModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
            {roles.length === 0 && (
              <div className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No roles defined</h3>
                <p className="text-sm text-gray-500">Define roles and permissions to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <TeamMemberModal
        isOpen={showTeamMemberModal}
        onClose={() => {
          setShowTeamMemberModal(false);
          setSelectedMember(null);
        }}
        onSave={(member) => {
          if (selectedMember) {
            updateTeamMember(member);
          } else {
            addTeamMember(member);
          }
          setShowTeamMemberModal(false);
          setSelectedMember(null);
        }}
        initialData={selectedMember}
        sites={sites}
        roles={roles}
      />

      <SiteModal
        isOpen={showSiteModal}
        onClose={() => {
          setShowSiteModal(false);
          setSelectedSite(null);
        }}
        onSave={(site) => {
          if (selectedSite) {
            updateSite(site);
          } else {
            addSite(site);
          }
          setShowSiteModal(false);
          setSelectedSite(null);
        }}
        initialData={selectedSite}
      />

      <RolePermissionsModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedRole(null);
        }}
        onSave={(role) => {
          updateRole(role);
          setShowRoleModal(false);
          setSelectedRole(null);
        }}
        initialData={selectedRole}
      />
    </div>
  );
}