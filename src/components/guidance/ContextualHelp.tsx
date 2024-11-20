import React from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useGuidanceStore } from '../../store/useGuidanceStore';

interface ContextualHelpProps {
  children: React.ReactNode;
}

export default function ContextualHelp({ children }: ContextualHelpProps) {
  const { contextualHelp } = useGuidanceStore();

  const steps = contextualHelp.map(help => ({
    target: help.selector,
    content: help.content,
    title: help.title,
    placement: help.position,
    disableBeacon: true
  }));

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Handle tour completion
    }
  };

  return (
    <>
      <Joyride
        callback={handleCallback}
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            primaryColor: '#4A90E2',
            textColor: '#2C3E50',
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: 'left'
          },
          buttonNext: {
            backgroundColor: '#4A90E2'
          },
          buttonBack: {
            color: '#4A90E2'
          }
        }}
      />
      {children}
    </>
  );
}