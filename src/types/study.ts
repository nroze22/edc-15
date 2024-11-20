export interface TeamMember {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'pending';
  startDate: string;
  endDate?: string;
  qualifications?: string[];
  certifications?: string[];
  delegatedTasks?: string[];
}

export interface Site {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
  investigatorName: string;
  investigatorEmail: string;
  investigatorPhone: string;
  coordinatorName?: string;
  coordinatorEmail?: string;
  coordinatorPhone?: string;
  activationDate: string;
  deactivationDate?: string;
  lastUpdated: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  facilities?: {
    type: string;
    available: boolean;
    notes?: string;
  }[];
  irb?: {
    name: string;
    number: string;
    approvalDate?: string;
    expirationDate?: string;
  };
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    study_data: {
      view: boolean;
      edit: boolean;
      delete: boolean;
      export: boolean;
    };
    participants: {
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
    };
    queries: {
      view: boolean;
      create: boolean;
      resolve: boolean;
      delete: boolean;
    };
    documents: {
      view: boolean;
      upload: boolean;
      download: boolean;
      delete: boolean;
    };
    team_management: {
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
    };
    site_management: {
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}</content>