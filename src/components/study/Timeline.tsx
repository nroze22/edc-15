import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Timeline() {
  const events = [
    {
      date: '2024-02-28',
      type: 'milestone',
      title: 'Study Initiation',
      description: 'All sites activated and ready for enrollment',
      status: 'completed'
    },
    {
      date: '2024-03-15',
      type: 'deadline',
      title: 'First Patient First Visit',
      description: 'Target date for first patient enrollment',
      status: 'upcoming'
    },
    {
      date: '2024-06-30',
      type: 'milestone',
      title: 'Interim Analysis',
      description: 'Scheduled interim data analysis',
      status: 'upcoming'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Study Timeline</h3>
            <p className="mt-1 text-sm text-gray-500">
              Key milestones and upcoming deadlines
            </p>
          </div>
        </div>

        <div className="flow-root">
          <ul className="-mb-8">
            {events.map((event, eventIdx) => (
              <li key={event.date}>
                <div className="relative pb-8">
                  {eventIdx !== events.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        event.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        {event.type === 'milestone' ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : (
                          <Clock className="h-5 w-5 text-white" />
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time dateTime={event.date}>
                          <Calendar className="inline-block h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}