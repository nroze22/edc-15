import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  field?: string;
  section?: string;
  message: string;
  standardReference?: string;
  suggestion?: {
    description: string;
    fix?: string;
    impact?: string;
  };
}

interface ValidationResultsProps {
  issues: ValidationIssue[];
  onApplyFix?: (issue: ValidationIssue) => void;
}

export default function ValidationResults({
  issues,
  onApplyFix,
}: ValidationResultsProps) {
  const getIcon = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'info':
        return <Info className="w-5 h-5 text-info" />;
    }
  };

  const getBadgeVariant = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (issues.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
        <h3 className="text-lg font-semibold mb-2">All Validations Passed</h3>
        <p className="text-sm text-muted-foreground">
          No issues were found with your form design.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Validation Results</h3>
        <div className="flex gap-2">
          <Badge variant="destructive">
            {issues.filter((i) => i.type === 'error').length} Errors
          </Badge>
          <Badge variant="warning">
            {issues.filter((i) => i.type === 'warning').length} Warnings
          </Badge>
          <Badge variant="secondary">
            {issues.filter((i) => i.type === 'info').length} Suggestions
          </Badge>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {issues.map((issue, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                {getIcon(issue.type)}
                <div className="text-left">
                  <div className="font-medium">{issue.message}</div>
                  {(issue.field || issue.section) && (
                    <div className="text-sm text-muted-foreground">
                      {issue.section && `${issue.section} → `}
                      {issue.field}
                    </div>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-4">
                {issue.standardReference && (
                  <div className="text-sm">
                    <span className="font-medium">Reference: </span>
                    {issue.standardReference}
                  </div>
                )}
                {issue.suggestion && (
                  <div className="space-y-3">
                    <div className="text-sm">{issue.suggestion.description}</div>
                    {issue.suggestion.impact && (
                      <div className="text-sm">
                        <span className="font-medium">Impact: </span>
                        {issue.suggestion.impact}
                      </div>
                    )}
                    {issue.suggestion.fix && onApplyFix && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApplyFix(issue)}
                      >
                        Apply Fix
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
