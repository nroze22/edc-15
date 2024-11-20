import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useGuidanceStore } from '../../store/useGuidanceStore';

interface HelpButtonProps {
  section: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export default function HelpButton({ section, position = 'right' }: HelpButtonProps) {
  const { showContextualHelp } = useGuidanceStore();

  return (
    <button
      onClick={() => showContextualHelp(section)}
      className="p-1 text-gray-400 hover:text-talosix-blue transition-colors rounded-full hover:bg-gray-100"
      title="Get help"
    >
      <HelpCircle className="h-5 w-5" />
    </button>
  );
}