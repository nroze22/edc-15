import create from 'zustand';
import { exportService, type ValidationResult, type DomainMapping } from '../services/exportService';

interface ExportState {
  mappingConfig: DomainMapping[] | null;
  validationResults: ValidationResult[] | null;
  isValidating: boolean;
  isExporting: boolean;
  error: string | null;

  updateMapping: (mapping: DomainMapping[]) => void;
  validateData: (format: string) => Promise<boolean>;
  exportData: (format: string) => Promise<void>;
}

export const useExportStore = create<ExportState>((set, get) => ({
  mappingConfig: null,
  validationResults: null,
  isValidating: false,
  isExporting: false,
  error: null,

  updateMapping: (mapping) => set({ mappingConfig: mapping }),

  validateData: async (format) => {
    set({ isValidating: true, error: null });
    try {
      const results = await exportService.validateData(format, {});
      set({ validationResults: results });
      return results.every(r => r.type !== 'error');
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error validating data',
        validationResults: null
      });
      return false;
    } finally {
      set({ isValidating: false });
    }
  },

  exportData: async (format) => {
    const { mappingConfig } = get();
    if (!mappingConfig) {
      throw new Error('Mapping configuration not found');
    }

    set({ isExporting: true, error: null });
    try {
      let blob: Blob;
      
      switch (format) {
        case 'sdtm':
          blob = await exportService.exportToSDTM({}, mappingConfig);
          break;
        case 'adam':
          blob = await exportService.exportToADaM({}, mappingConfig);
          break;
        case 'excel':
          blob = await exportService.exportToExcel({}, mappingConfig);
          break;
        case 'csv':
          blob = await exportService.exportToCSV({}, mappingConfig);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `study-export-${format}-${new Date().toISOString()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error exporting data' });
    } finally {
      set({ isExporting: false });
    }
  }
}));