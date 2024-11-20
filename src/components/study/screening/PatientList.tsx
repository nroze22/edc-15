import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, User } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  matchScore: number;
  status: 'pending' | 'approved' | 'rejected';
  concerns: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onPatientSelect: (patientId: string) => void;
}

export default function PatientList({
  patients,
  selectedPatientId,
  onPatientSelect
}: PatientListProps) {
  const sortedPatients = [...patients].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">
          Screened Patients ({patients.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {sortedPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => onPatientSelect(patient.id)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
              selectedPatientId === patient.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {patient.name}
                </span>
              </div>
              {patient.status === 'approved' && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {patient.status === 'rejected' && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      patient.matchScore >= 0.8 ? 'bg-green-500' :
                      patient.matchScore >= 0.6 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${patient.matchScore * 100}%` }}
                  />
                </div>
                <span className="ml-2 text-xs text-gray-500">
                  {Math.round(patient.matchScore * 100)}% match
                </span>
              </div>
              {patient.concerns.length > 0 && (
                <div className="flex items-center">
                  <AlertTriangle className={`h-4 w-4 ${
                    patient.concerns.some(c => c.severity === 'high')
                      ? 'text-red-500'
                      : patient.concerns.some(c => c.severity === 'medium')
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                  }`} />
                  <span className="ml-1 text-xs text-gray-500">
                    {patient.concerns.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}