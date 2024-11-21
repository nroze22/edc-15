import { create } from 'zustand';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'file';
  value: string | number | boolean | null;
  status: 'empty' | 'partial' | 'complete' | 'verified' | 'query';
  lastModified?: Date;
  modifiedBy?: string;
  sourceDocument?: string;
  queries?: Array<{
    id: string;
    text: string;
    status: 'open' | 'resolved';
    createdAt: Date;
    createdBy: string;
  }>;
}

export interface Form {
  id: string;
  name: string;
  category: string;
  visitNumber?: number;
  dueDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'verified' | 'locked';
  completionPercentage: number;
  fields: { [fieldId: string]: FormField };
  lastModified?: Date;
  modifiedBy?: string;
}

export interface Visit {
  id: string;
  name: string;
  number: number;
  date?: Date;
  status: 'scheduled' | 'completed' | 'missed' | 'future';
  forms: { [formId: string]: Form };
}

export interface Patient {
  id: string;
  subjectId: string;
  siteId: string;
  enrollmentDate: Date;
  status: 'screening' | 'enrolled' | 'completed' | 'discontinued';
  visits: { [visitId: string]: Visit };
  demographics?: {
    dateOfBirth?: Date;
    gender?: string;
    race?: string;
    ethnicity?: string;
  };
}

interface PatientState {
  patients: { [patientId: string]: Patient };
  selectedPatientId: string | null;
  selectedVisitId: string | null;
  selectedFormId: string | null;
  isLoading: boolean;
  error: string | null;
  setSelectedPatient: (patientId: string | null) => void;
  setSelectedVisit: (visitId: string | null) => void;
  setSelectedForm: (formId: string | null) => void;
  updateFormField: (patientId: string, visitId: string, formId: string, fieldId: string, value: any) => void;
  importPatientData: (file: File) => Promise<void>;
  getFormProgress: (patientId: string) => { total: number; completed: number };
}

// Sample data generator
const generateSampleData = (): { [patientId: string]: Patient } => {
  const patients: { [patientId: string]: Patient } = {};
  
  // Generate 10 sample patients
  for (let i = 1; i <= 10; i++) {
    const patientId = `PAT-${String(i).padStart(3, '0')}`;
    const visits: { [visitId: string]: Visit } = {};
    
    // Generate visits (Screening, Baseline, Follow-ups)
    ['Screening', 'Baseline', ...Array(3).fill(0).map((_, idx) => `Follow-up ${idx + 1}`)].forEach((visitName, vIdx) => {
      const visitId = `VISIT-${patientId}-${vIdx}`;
      const forms: { [formId: string]: Form } = {};
      
      // Generate common forms for each visit
      [
        'Demographics',
        'Vital Signs',
        'Physical Examination',
        'Lab Results',
        'Medications',
        'Adverse Events',
        'Quality of Life'
      ].forEach((formName, fIdx) => {
        const formId = `FORM-${visitId}-${fIdx}`;
        const fields: { [fieldId: string]: FormField } = {};
        
        // Generate fields based on form type
        const fieldConfigs = {
          'Demographics': [
            { label: 'Date of Birth', type: 'date' },
            { label: 'Gender', type: 'select' },
            { label: 'Race', type: 'select' },
            { label: 'Ethnicity', type: 'select' }
          ],
          'Vital Signs': [
            { label: 'Blood Pressure (Systolic)', type: 'number' },
            { label: 'Blood Pressure (Diastolic)', type: 'number' },
            { label: 'Heart Rate', type: 'number' },
            { label: 'Temperature', type: 'number' },
            { label: 'Respiratory Rate', type: 'number' },
            { label: 'Weight', type: 'number' },
            { label: 'Height', type: 'number' }
          ],
          'Physical Examination': [
            { label: 'General Appearance', type: 'text' },
            { label: 'Cardiovascular', type: 'text' },
            { label: 'Respiratory', type: 'text' },
            { label: 'Gastrointestinal', type: 'text' },
            { label: 'Musculoskeletal', type: 'text' },
            { label: 'Neurological', type: 'text' }
          ],
          'Lab Results': [
            { label: 'Hemoglobin', type: 'number' },
            { label: 'White Blood Cell Count', type: 'number' },
            { label: 'Platelet Count', type: 'number' },
            { label: 'Creatinine', type: 'number' },
            { label: 'ALT', type: 'number' },
            { label: 'AST', type: 'number' }
          ],
          'Medications': [
            { label: 'Medication Name', type: 'text' },
            { label: 'Dose', type: 'text' },
            { label: 'Frequency', type: 'select' },
            { label: 'Start Date', type: 'date' },
            { label: 'End Date', type: 'date' }
          ],
          'Adverse Events': [
            { label: 'Event Description', type: 'text' },
            { label: 'Start Date', type: 'date' },
            { label: 'End Date', type: 'date' },
            { label: 'Severity', type: 'select' },
            { label: 'Relationship to Study Drug', type: 'select' }
          ],
          'Quality of Life': [
            { label: 'General Health', type: 'select' },
            { label: 'Physical Functioning', type: 'select' },
            { label: 'Pain Level', type: 'select' },
            { label: 'Fatigue Level', type: 'select' },
            { label: 'Mental Health', type: 'select' }
          ]
        };

        const formConfig = fieldConfigs[formName as keyof typeof fieldConfigs] || [];
        formConfig.forEach((config, idx) => {
          const fieldId = `FIELD-${formId}-${idx}`;
          fields[fieldId] = {
            id: fieldId,
            label: config.label,
            type: config.type as any,
            value: null,
            status: Math.random() > 0.7 ? 'complete' : 'empty',
            lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          };

          // Add some sample queries
          if (Math.random() > 0.8) {
            fields[fieldId].queries = [{
              id: `QUERY-${fieldId}`,
              text: 'Please verify this value against source documents',
              status: Math.random() > 0.5 ? 'open' : 'resolved',
              createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
              createdBy: 'Data Manager'
            }];
          }
        });

        // Calculate completion percentage
        const totalFields = Object.keys(fields).length;
        const completedFields = Object.values(fields).filter(f => f.status === 'complete').length;
        const completionPercentage = (completedFields / totalFields) * 100;

        forms[formId] = {
          id: formId,
          name: formName,
          category: 'Clinical',
          status: completionPercentage === 100 ? 'completed' : completionPercentage > 0 ? 'in_progress' : 'not_started',
          completionPercentage,
          fields,
          lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        };
      });

      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() - (30 * vIdx));

      visits[visitId] = {
        id: visitId,
        name: visitName,
        number: vIdx + 1,
        date: visitDate,
        status: vIdx === 0 ? 'completed' : vIdx === 1 ? 'scheduled' : 'future',
        forms
      };
    });

    patients[patientId] = {
      id: patientId,
      subjectId: patientId,
      siteId: `SITE-${Math.floor(Math.random() * 3) + 1}`,
      enrollmentDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.8 ? 'screening' : 'enrolled',
      visits,
      demographics: {
        dateOfBirth: new Date(1960 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        race: ['White', 'Black', 'Asian', 'Other'][Math.floor(Math.random() * 4)],
        ethnicity: Math.random() > 0.5 ? 'Hispanic or Latino' : 'Not Hispanic or Latino'
      }
    };
  }

  return patients;
};

export const usePatientStore = create<PatientState>()((set, get) => ({
  patients: generateSampleData(),
  selectedPatientId: null,
  selectedVisitId: null,
  selectedFormId: null,
  isLoading: false,
  error: null,

  setSelectedPatient: (patientId) => set({ selectedPatientId: patientId }),
  
  setSelectedVisit: (visitId) => set({ selectedVisitId: visitId }),
  
  setSelectedForm: (formId) => set({ selectedFormId: formId }),

  updateFormField: (patientId, visitId, formId, fieldId, value) => {
    set((state) => {
      const patient = state.patients[patientId];
      if (!patient) return state;

      const visit = patient.visits[visitId];
      if (!visit) return state;

      const form = visit.forms[formId];
      if (!form) return state;

      const updatedForm = {
        ...form,
        fields: {
          ...form.fields,
          [fieldId]: {
            ...form.fields[fieldId],
            value,
            status: value ? 'complete' : 'empty',
            lastModified: new Date(),
          }
        }
      };

      // Calculate new completion percentage
      const totalFields = Object.keys(updatedForm.fields).length;
      const completedFields = Object.values(updatedForm.fields).filter(
        field => field.status === 'complete' || field.status === 'verified'
      ).length;
      updatedForm.completionPercentage = (completedFields / totalFields) * 100;

      return {
        patients: {
          ...state.patients,
          [patientId]: {
            ...patient,
            visits: {
              ...patient.visits,
              [visitId]: {
                ...visit,
                forms: {
                  ...visit.forms,
                  [formId]: updatedForm
                }
              }
            }
          }
        }
      };
    });
  },

  importPatientData: async (file) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement OCR and data extraction
      // For now, just mock the import
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error importing data', isLoading: false });
    }
  },

  getFormProgress: (patientId) => {
    const patient = get().patients[patientId];
    if (!patient) return { total: 0, completed: 0 };

    let total = 0;
    let completed = 0;

    Object.values(patient.visits).forEach(visit => {
      Object.values(visit.forms).forEach(form => {
        total++;
        if (form.status === 'completed' || form.status === 'verified') {
          completed++;
        }
      });
    });

    return { total, completed };
  }
}));
