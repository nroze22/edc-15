import { create } from 'zustand';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  site?: string;
  phone?: string;
}

interface Site {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface StudySetupStore {
  teamMembers: TeamMember[];
  sites: Site[];
  roles: Role[];
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  removeTeamMember: (id: string) => void;
  addSite: (site: Omit<Site, 'id'>) => void;
  updateSite: (site: Site) => void;
  removeSite: (id: string) => void;
  updateRole: (role: Role) => void;
}

export const useStudySetupStore = create<StudySetupStore>((set) => ({
  teamMembers: [],
  sites: [],
  roles: [
    {
      id: 'role-1',
      name: 'Principal Investigator',
      description: 'Lead researcher responsible for conducting the clinical trial',
      permissions: ['full_access']
    },
    {
      id: 'role-2',
      name: 'Study Coordinator',
      description: 'Manages day-to-day clinical trial operations',
      permissions: ['manage_participants', 'manage_data']
    },
    {
      id: 'role-3',
      name: 'Data Manager',
      description: 'Handles data entry and quality control',
      permissions: ['view_data', 'edit_data']
    }
  ],

  addTeamMember: (member) =>
    set((state) => ({
      teamMembers: [...state.teamMembers, { ...member, id: `member-${Date.now()}` }]
    })),

  updateTeamMember: (member) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => (m.id === member.id ? member : m))
    })),

  removeTeamMember: (id) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.id !== id)
    })),

  addSite: (site) =>
    set((state) => ({
      sites: [...state.sites, { ...site, id: `site-${Date.now()}` }]
    })),

  updateSite: (site) =>
    set((state) => ({
      sites: state.sites.map((s) => (s.id === site.id ? site : s))
    })),

  removeSite: (id) =>
    set((state) => ({
      sites: state.sites.filter((s) => s.id !== id)
    })),

  updateRole: (role) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.id === role.id ? role : r))
    }))
}));