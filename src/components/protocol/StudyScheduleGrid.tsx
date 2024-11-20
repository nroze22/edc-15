import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface StudyScheduleProps {
  schedule: {
    visits: Array<{
      name: string;
      window: string;
      procedures: Array<{
        name: string;
        required: boolean;
        notes?: string;
      }>;
    }>;
    procedures: string[];
  };
}

export default function StudyScheduleGrid({ schedule }: StudyScheduleProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-talosix-blue mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Study Schedule</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedure
                </th>
                {schedule.visits.map((visit, index) => (
                  <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col">
                      <span>{visit.name}</span>
                      <span className="text-gray-400 font-normal mt-1">
                        {visit.window}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedule.procedures.map((procedure, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {procedure}
                  </td>
                  {schedule.visits.map((visit, visitIndex) => {
                    const proc = visit.procedures.find(p => p.name === procedure);
                    return (
                      <td key={visitIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proc ? (
                          <div className="flex items-center">
                            {proc.required ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            )}
                            {proc.notes && (
                              <span className="ml-2 text-xs text-gray-400">
                                {proc.notes}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}