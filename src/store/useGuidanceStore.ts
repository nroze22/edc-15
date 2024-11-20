import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Step } from 'react-joyride';

interface Tour {
  id: string;
  steps: Step[];
}

interface ContextualHelp {
  id: string;
  selector: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  title: string;
  content: string;
}

interface GuidanceState {
  showTour: boolean;
  currentTour: string | null;
  completedTours: string[];
  contextualHelp: ContextualHelp[];
  tours: Record<string, Step[]>;
  
  setShowTour: (show: boolean) => void;
  startTour: (tourId: string) => void;
  markTourComplete: (tourId: string) => void;
  showContextualHelp: (section: string) => void;
  dismissContextualHelp: (helpId: string) => void;
}

export const useGuidanceStore = create<GuidanceState>()(
  persist(
    (set, get) => ({
      showTour: false,
      currentTour: null,
      completedTours: [],
      contextualHelp: [],
      tours: {
        'study-setup': [
          {
            target: '.study-setup-header',
            content: "Welcome to Study Setup! This is where you will configure your study team, sites, and roles.",
            title: 'Study Setup',
            disableBeacon: true
          },
          {
            target: '.team-management',
            content: 'Start by adding your study team members. You can assign roles and permissions here.',
            title: 'Team Management'
          },
          {
            target: '.site-management',
            content: 'Next, set up your study sites and assign team members to each location.',
            title: 'Site Management'
          },
          {
            target: '.role-permissions',
            content: 'Finally, configure role-based permissions to ensure proper access control.',
            title: 'Role Permissions'
          }
        ],
        'protocol-analysis': [
          {
            target: '.protocol-upload',
            content: 'Begin by uploading your study protocol document. We support PDF, DOC, and DOCX formats.',
            title: 'Upload Protocol'
          },
          {
            target: '.ai-analysis',
            content: 'Our AI will analyze your protocol and suggest optimizations for better efficiency.',
            title: 'AI Analysis'
          },
          {
            target: '.study-schedule',
            content: 'Review and customize the suggested study schedule based on protocol requirements.',
            title: 'Study Schedule'
          }
        ],
        'crf-design': [
          {
            target: '.crf-builder',
            content: 'Design your eCRFs with our intuitive form builder. Start with templates or create custom forms.',
            title: 'CRF Builder'
          },
          {
            target: '.field-palette',
            content: 'Choose from a variety of field types optimized for clinical data collection.',
            title: 'Field Types'
          },
          {
            target: '.validation-rules',
            content: 'Set up data validation rules to ensure data quality and compliance.',
            title: 'Validation Rules'
          }
        ]
      },

      setShowTour: (show) => set({ showTour: show }),
      
      startTour: (tourId) => {
        const { completedTours } = get();
        if (!completedTours.includes(tourId)) {
          set({ showTour: true, currentTour: tourId });
        }
      },
      
      markTourComplete: (tourId) => {
        const { completedTours } = get();
        if (!completedTours.includes(tourId)) {
          set({ completedTours: [...completedTours, tourId] });
        }
      },
      
      showContextualHelp: (section) => {
        // Implementation for showing contextual help
      },
      
      dismissContextualHelp: (helpId) => {
        const { contextualHelp } = get();
        set({
          contextualHelp: contextualHelp.filter(help => help.id !== helpId)
        });
      }
    }),
    {
      name: 'talosix-guidance',
      partialize: (state) => ({
        completedTours: state.completedTours
      })
    }
  )
);