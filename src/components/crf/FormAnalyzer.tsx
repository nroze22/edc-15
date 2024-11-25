import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Play, RefreshCw } from 'lucide-react';
import SimulationSettings, { SimulationConfig } from './SimulationSettings';
import ValidationResults, { ValidationIssue } from './ValidationResults';
import { crfAI } from '../../services/crfAI';

interface FormAnalyzerProps {
  form: any;
  onApplyFix?: (issue: ValidationIssue) => void;
}

const defaultConfig: SimulationConfig = {
  numPatients: 100,
  studyDuration: 12,
  durationUnit: 'months',
  missingDataRate: 5,
  errorRate: 2,
  patientDropoutRate: 10,
  dataEntryDelay: 3,
  siteCount: 5,
  populationDistribution: 'normal',
};

export default function FormAnalyzer({ form, onApplyFix }: FormAnalyzerProps) {
  const [activeTab, setActiveTab] = useState('validation');
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    setIsLoading(true);
    try {
      const validationIssues = await crfAI.validateForm(form);
      setIssues(validationIssues);
    } catch (error) {
      console.error('Error validating form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const result = await crfAI.simulateDataEntry(form, config);
      setIssues(result.issues);
      // You can add additional handling for the simulation data and metrics here
    } catch (error) {
      console.error('Error simulating data entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={handleValidate}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Analyzing...' : 'Analyze Form'}
            </Button>
          </div>
          <ValidationResults issues={issues} onApplyFix={onApplyFix} />
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <SimulationSettings config={config} onChange={setConfig} />
          <div className="flex justify-end">
            <Button
              onClick={handleSimulate}
              disabled={isLoading}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </div>
          {issues.length > 0 && (
            <ValidationResults issues={issues} onApplyFix={onApplyFix} />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
