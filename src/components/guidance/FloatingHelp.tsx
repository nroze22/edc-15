import React from 'react';
import { useFloating, useInteractions, useHover, offset, flip, shift } from '@floating-ui/react';
import { HelpCircle } from 'lucide-react';

interface FloatingHelpProps {
  content: string;
  children: React.ReactNode;
}

export default function FloatingHelp({ content, children }: FloatingHelpProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip(), shift()],
    placement: 'top'
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 max-w-xs bg-white p-2 rounded-lg shadow-lg border border-gray-200"
        >
          <div className="text-sm text-gray-600">{content}</div>
        </div>
      )}
    </>
  );
}