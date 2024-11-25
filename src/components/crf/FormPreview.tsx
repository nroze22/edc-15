import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Laptop,
  Smartphone,
  Tablet,
  MonitorSmartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface FormPreviewProps {
  children: React.ReactNode;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'responsive';

const deviceStyles: Record<DeviceType, string> = {
  mobile: 'w-[375px] h-[667px]',
  tablet: 'w-[768px] h-[1024px]',
  desktop: 'w-[1280px] h-[800px]',
  responsive: 'w-full min-h-[600px]',
};

const deviceNames: Record<DeviceType, string> = {
  mobile: 'Mobile',
  tablet: 'Tablet',
  desktop: 'Desktop',
  responsive: 'Responsive',
};

export default function FormPreview({ children }: FormPreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('responsive');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const DeviceIcon = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Laptop,
    responsive: MonitorSmartphone,
  }[selectedDevice];

  return (
    <div className={cn(
      'flex flex-col gap-4 p-4',
      isFullscreen && 'fixed inset-0 bg-background z-50'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Form Preview</h2>
          <span className="text-sm text-muted-foreground">
            ({deviceNames[selectedDevice]})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            {Object.entries(deviceNames).map(([device, name]) => {
              const Icon = {
                mobile: Smartphone,
                tablet: Tablet,
                desktop: Laptop,
                responsive: MonitorSmartphone,
              }[device as DeviceType];

              return (
                <Button
                  key={device}
                  variant={selectedDevice === device ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                  onClick={() => setSelectedDevice(device as DeviceType)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{name}</span>
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-muted rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Card className={cn(
            'bg-background overflow-auto transition-all duration-200',
            deviceStyles[selectedDevice],
            selectedDevice === 'responsive' ? 'w-full h-full' : 'shadow-lg'
          )}>
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}
