/**
 * Format a percentage value to at most 1 decimal place, removing trailing zeros
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value * 10) / 10}%`.replace('.0%', '%');
}

/**
 * Format a duration in minutes to a readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

/**
 * Format a field value based on its type
 */
export function formatFieldValue(value: any, type: string): string {
  if (value == null) return '';
  
  switch (type) {
    case 'number':
      return typeof value === 'number' 
        ? value.toString().replace(/\.?0+$/, '')
        : value;
    case 'date':
      return value instanceof Date 
        ? value.toLocaleDateString()
        : value;
    case 'boolean':
      return value ? 'Yes' : 'No';
    default:
      return String(value);
  }
}

/**
 * Format a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Clean and format an eCRF field name for display
 */
export function formatFieldName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim();
}

/**
 * Format a timestamp relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}
