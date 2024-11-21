import React from 'react';
import { AlertCircle, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { formatRelativeTime } from '@/utils/formatters';

export type QueryStatus = 'open' | 'pending' | 'resolved' | 'closed' | 'cancelled';
export type QueryPriority = 'low' | 'medium' | 'high';

interface QueryBadgeProps {
  status: QueryStatus;
  count?: number;
  priority?: QueryPriority;
  createdAt?: Date;
  dueDate?: Date;
  onClick?: () => void;
  showTimestamp?: boolean;
  showDueDate?: boolean;
  compact?: boolean;
}

export default function QueryBadge({
  status,
  count = 1,
  priority,
  createdAt,
  dueDate,
  onClick,
  showTimestamp,
  showDueDate,
  compact = false
}: QueryBadgeProps) {
  const getBadgeStyles = () => {
    const baseStyles = {
      open: {
        container: 'bg-red-100 text-red-800 hover:bg-red-200',
        icon: <AlertCircle className="h-3.5 w-3.5" />,
      },
      pending: {
        container: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        icon: <MessageSquare className="h-3.5 w-3.5" />,
      },
      resolved: {
        container: 'bg-green-100 text-green-800 hover:bg-green-200',
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      },
      closed: {
        container: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      },
      cancelled: {
        container: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        icon: <AlertCircle className="h-3.5 w-3.5" />,
      },
    };

    return baseStyles[status] || baseStyles.open;
  };

  const getPriorityStyles = () => {
    if (!priority) return '';

    switch (priority) {
      case 'high':
        return 'ring-2 ring-red-500 ring-offset-1';
      case 'medium':
        return 'ring-2 ring-amber-500 ring-offset-1';
      case 'low':
        return 'ring-2 ring-blue-500 ring-offset-1';
      default:
        return '';
    }
  };

  const styles = getBadgeStyles();
  const priorityStyle = getPriorityStyles();

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center p-1 rounded ${styles.container} ${priorityStyle} transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        title={`${status.charAt(0).toUpperCase() + status.slice(1)} Query${count > 1 ? ` (${count})` : ''}`}
      >
        {styles.icon}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        styles.container
      } ${priorityStyle} transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      <span className="flex items-center space-x-1">
        {styles.icon}
        <span>{count > 1 ? `${count} Queries` : 'Query'}</span>
        {showTimestamp && createdAt && (
          <span className="text-xs opacity-75">
            {formatRelativeTime(createdAt)}
          </span>
        )}
        {showDueDate && dueDate && (
          <span className="flex items-center space-x-1 text-xs opacity-75">
            <Clock className="h-3 w-3" />
            <span>Due {formatRelativeTime(dueDate)}</span>
          </span>
        )}
      </span>
    </button>
  );
}
