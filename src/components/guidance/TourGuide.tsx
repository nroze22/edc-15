import React from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useGuidanceStore } from '../../store/useGuidanceStore';

export default function TourGuide() {
  const { 
    showTour,
    currentTour,
    setShowTour,
    markTourComplete,
    tours
  } = useGuidanceStore();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setShowTour(false);
      if (status === STATUS.FINISHED) {
        markTourComplete(currentTour);
      }
    }
  };

  if (!showTour || !currentTour || !tours[currentTour]) return null;

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={tours[currentTour]}
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
  );
}