import { create } from 'zustand';

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  validation?: Record<string, any>;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface CRFForm {
  id: string;
  title: string;
  description: string;
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
  version: string;
}

interface CRFState {
  forms: CRFForm[];
  currentForm: CRFForm | null;
  selectedSection: string | null;
  selectedField: string | null;
  setForms: (forms: CRFForm[]) => void;
  setCurrentForm: (form: CRFForm | null) => void;
  addForm: (form: CRFForm) => void;
  updateForm: (formId: string, updates: Partial<CRFForm>) => void;
  deleteForm: (formId: string) => void;
  setSelectedSection: (sectionId: string | null) => void;
  setSelectedField: (fieldId: string | null) => void;
  addSection: (formId: string, section: FormSection) => void;
  updateSection: (formId: string, sectionId: string, updates: Partial<FormSection>) => void;
  deleteSection: (formId: string, sectionId: string) => void;
  addField: (formId: string, sectionId: string, field: FormField) => void;
  updateField: (formId: string, sectionId: string, fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (formId: string, sectionId: string, fieldId: string) => void;
}

export const useCRFStore = create<CRFState>((set) => ({
  forms: [],
  currentForm: null,
  selectedSection: null,
  selectedField: null,

  setForms: (forms) => set({ forms }),
  setCurrentForm: (form) => set({ currentForm: form }),
  
  addForm: (form) =>
    set((state) => ({
      forms: [...state.forms, form],
      currentForm: form,
    })),

  updateForm: (formId, updates) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId ? { ...form, ...updates, updatedAt: new Date().toISOString() } : form
      ),
      currentForm:
        state.currentForm?.id === formId
          ? { ...state.currentForm, ...updates, updatedAt: new Date().toISOString() }
          : state.currentForm,
    })),

  deleteForm: (formId) =>
    set((state) => ({
      forms: state.forms.filter((form) => form.id !== formId),
      currentForm: state.currentForm?.id === formId ? null : state.currentForm,
    })),

  setSelectedSection: (sectionId) => set({ selectedSection: sectionId }),
  setSelectedField: (fieldId) => set({ selectedField: fieldId }),

  addSection: (formId, section) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: [...form.sections, section],
              updatedAt: new Date().toISOString(),
            }
          : form
      ),
      currentForm:
        state.currentForm?.id === formId
          ? {
              ...state.currentForm,
              sections: [...state.currentForm.sections, section],
              updatedAt: new Date().toISOString(),
            }
          : state.currentForm,
    })),

  updateSection: (formId, sectionId, updates) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: form.sections.map((section) =>
                section.id === sectionId ? { ...section, ...updates } : section
              ),
              updatedAt: new Date().toISOString(),
            }
          : form
      ),
      currentForm:
        state.currentForm?.id === formId
          ? {
              ...state.currentForm,
              sections: state.currentForm.sections.map((section) =>
                section.id === sectionId ? { ...section, ...updates } : section
              ),
              updatedAt: new Date().toISOString(),
            }
          : state.currentForm,
    })),

  deleteSection: (formId, sectionId) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: form.sections.filter((section) => section.id !== sectionId),
              updatedAt: new Date().toISOString(),
            }
          : form
      ),
      currentForm:
        state.currentForm?.id === formId
          ? {
              ...state.currentForm,
              sections: state.currentForm.sections.filter(
                (section) => section.id !== sectionId
              ),
              updatedAt: new Date().toISOString(),
            }
          : state.currentForm,
    })),

  addField: (formId, sectionId, field) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: form.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, fields: [...section.fields, field] }
                  : section
              ),
              updatedAt: new Date().toISOString(),
            }
          : form
      ),
      currentForm:
        state.currentForm?.id === formId
          ? {
              ...state.currentForm,
              sections: state.currentForm.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, fields: [...section.fields, field] }
                  : section
              ),
              updatedAt: new Date().toISOString(),
            }
          : state.currentForm,
    })),

  updateField: (formId, sectionId, fieldId, updates) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: form.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      fields: section.fields.map((field) =>
                        field.id === fieldId ? { ...field, ...updates } : field
                      ),
                    }
                  : section
              ),
              updatedAt: new Date().toISOString(),
            }
          : form
      ),
      currentForm:
        state.currentForm?.id === formId
          ? {
              ...state.currentForm,
              sections: state.currentForm.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      fields: section.fields.map((field) =>
                        field.id === fieldId ? { ...field, ...updates } : field
                      ),
                    }
                  : section
              ),
              updatedAt: new Date().toISOString(),
            }
          : state.currentForm,
    })),

  deleteField: (formId, sectionId, fieldId) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === formId
          ? {
              ...form,
              sections: form.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      fields: section.fields.filter((field) => field.id !== fieldId),
                    }
                  : section
              ),
              updatedAt: new Date().toISOString(),
            }
          : form
      ),
      currentForm:
        state.currentForm?.id === formId
          ? {
              ...state.currentForm,
              sections: state.currentForm.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      fields: section.fields.filter((field) => field.id !== fieldId),
                    }
                  : section
              ),
              updatedAt: new Date().toISOString(),
            }
          : state.currentForm,
    })),
}));
