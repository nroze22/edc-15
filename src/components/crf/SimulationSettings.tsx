import React from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Slider } from '../ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Info } from 'lucide-react';

export interface SimulationConfig {
  numPatients: number;
  studyDuration: number;
  durationUnit: 'days' | 'weeks' | 'months';
  missingDataRate: number;
  errorRate: number;
  patientDropoutRate: number;
  dataEntryDelay: number;
  siteCount: number;
  populationDistribution: 'uniform' | 'normal' | 'skewed';
}

interface SimulationSettingsProps {
  config: SimulationConfig;
  onChange: (config: SimulationConfig) => void;
}

export default function SimulationSettings({
  config,
  onChange,
}: SimulationSettingsProps) {
  const handleChange = (key: keyof SimulationConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Simulation Settings</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Configure simulation parameters to test your CRF under various
                real-world conditions. The AI will analyze the results and suggest
                improvements.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Number of Patients */}
        <div className="space-y-2">
          <Label>Number of Patients</Label>
          <Input
            type="number"
            min={1}
            max={10000}
            value={config.numPatients}
            onChange={(e) =>
              handleChange('numPatients', parseInt(e.target.value) || 1)
            }
          />
        </div>

        {/* Study Duration */}
        <div className="space-y-2">
          <Label>Study Duration</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              value={config.studyDuration}
              onChange={(e) =>
                handleChange('studyDuration', parseInt(e.target.value) || 1)
              }
              className="flex-1"
            />
            <Select
              value={config.durationUnit}
              onValueChange={(value: 'days' | 'weeks' | 'months') =>
                handleChange('durationUnit', value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Site Count */}
        <div className="space-y-2">
          <Label>Number of Sites</Label>
          <Input
            type="number"
            min={1}
            max={1000}
            value={config.siteCount}
            onChange={(e) =>
              handleChange('siteCount', parseInt(e.target.value) || 1)
            }
          />
        </div>

        {/* Population Distribution */}
        <div className="space-y-2">
          <Label>Population Distribution</Label>
          <Select
            value={config.populationDistribution}
            onValueChange={(value: 'uniform' | 'normal' | 'skewed') =>
              handleChange('populationDistribution', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="skewed">Skewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Missing Data Rate */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Missing Data Rate</Label>
            <span className="text-sm text-muted-foreground">
              {config.missingDataRate}%
            </span>
          </div>
          <Slider
            value={[config.missingDataRate]}
            min={0}
            max={30}
            step={1}
            onValueChange={([value]) => handleChange('missingDataRate', value)}
          />
        </div>

        {/* Error Rate */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Data Entry Error Rate</Label>
            <span className="text-sm text-muted-foreground">
              {config.errorRate}%
            </span>
          </div>
          <Slider
            value={[config.errorRate]}
            min={0}
            max={20}
            step={1}
            onValueChange={([value]) => handleChange('errorRate', value)}
          />
        </div>

        {/* Patient Dropout Rate */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Patient Dropout Rate</Label>
            <span className="text-sm text-muted-foreground">
              {config.patientDropoutRate}%
            </span>
          </div>
          <Slider
            value={[config.patientDropoutRate]}
            min={0}
            max={50}
            step={1}
            onValueChange={([value]) => handleChange('patientDropoutRate', value)}
          />
        </div>

        {/* Data Entry Delay */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Avg. Data Entry Delay (days)</Label>
            <span className="text-sm text-muted-foreground">
              {config.dataEntryDelay} days
            </span>
          </div>
          <Slider
            value={[config.dataEntryDelay]}
            min={0}
            max={30}
            step={1}
            onValueChange={([value]) => handleChange('dataEntryDelay', value)}
          />
        </div>
      </div>
    </Card>
  );
}
