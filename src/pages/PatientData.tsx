import React, { useState } from 'react';
import { usePatientStore } from '@/stores/patientStore';
import FormHeader from '@/components/forms/FormHeader';
import FormToolbar from '@/components/forms/FormToolbar';
import FormSidebar from '@/components/forms/FormSidebar';
import QueryBadge from '@/components/forms/QueryBadge';
import { 
  UserCircle, 
  ChevronRight, 
  Search, 
  Calendar,
  ChevronLeft,
  Home
} from 'lucide-react';
import { Patient, Visit, Form } from '@/stores/patientStore';

export default function PatientData() {
  const { patients, selectedPatientId, setSelectedPatient } = usePatientStore();
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentForm, setCurrentForm] = useState<Form | null>(null);
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPatient = selectedPatientId ? patients[selectedPatientId] : null;
  const patientList = Object.values(patients).filter(patient => 
    patient.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.siteId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    if (currentForm) {
      setCurrentForm(null);
      setCurrentVisit(null);
    } else if (currentPatient) {
      setSelectedPatient(null);
    }
  };

  const renderBreadcrumbs = () => {
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <button 
          onClick={() => {
            setCurrentForm(null);
            setCurrentVisit(null);
            setSelectedPatient(null);
          }}
          className="flex items-center hover:text-gray-700"
        >
          <Home className="h-4 w-4" />
          <span className="ml-1">Patients</span>
        </button>
        {currentPatient && (
          <>
            <ChevronRight className="h-4 w-4" />
            <button 
              onClick={() => {
                setCurrentForm(null);
                setCurrentVisit(null);
              }}
              className="hover:text-gray-700"
            >
              {currentPatient.subjectId}
            </button>
          </>
        )}
        {currentVisit && currentForm && (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-700">{currentForm.name}</span>
          </>
        )}
      </nav>
    );
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Patient List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patients</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {patientList.map(patient => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedPatientId === patient.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    patient.status === 'enrolled' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <UserCircle className={`h-6 w-6 ${
                      patient.status === 'enrolled' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {patient.subjectId}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        patient.status === 'enrolled' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {patient.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(patient.enrollmentDate).toLocaleDateString()}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Site {patient.siteId}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            {(currentPatient || currentForm) && (
              <button
                onClick={handleBack}
                className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </button>
            )}
            {renderBreadcrumbs()}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {currentForm ? (
            <div className="flex flex-col h-full">
              <FormHeader
                form={{
                  id: currentForm.id,
                  name: currentForm.name,
                  status: currentForm.status,
                  completionPercentage: currentForm.completionPercentage,
                  lastModified: currentForm.lastModified || new Date(),
                  modifiedBy: currentForm.modifiedBy || 'Unknown',
                  version: '1.0',
                  subjectId: currentPatient?.subjectId,
                  visitName: currentVisit?.name,
                  siteId: currentPatient?.siteId,
                  hasQueries: true,
                  queryCount: 2
                }}
                onSave={() => console.log('Saving...')}
                onImport={() => console.log('Importing...')}
                onLock={() => console.log('Locking...')}
                onVerify={() => console.log('Verifying...')}
                onShowQueries={() => setShowSidebar(true)}
                isLocked={false}
                isVerified={false}
                canVerify={true}
              />
              <div className="border-t border-gray-200">
                <FormToolbar
                  totalFields={20}
                  completedFields={13}
                  openQueries={2}
                  timeSpent={45}
                  currentPage={1}
                  totalPages={3}
                  hasAttachments={true}
                  attachmentCount={2}
                  isReadOnly={false}
                  onShowQueries={() => setShowSidebar(true)}
                  hasPrevious={false}
                  hasNext={true}
                />
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {/* Form fields will go here */}
              </div>
            </div>
          ) : currentPatient ? (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Patient {currentPatient.subjectId}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      View and manage patient forms across all visits
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    currentPatient.status === 'enrolled' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentPatient.status}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Site</div>
                    <div className="mt-1 font-medium">{currentPatient.siteId}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Enrollment Date</div>
                    <div className="mt-1 font-medium">
                      {new Date(currentPatient.enrollmentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Demographics</div>
                    <div className="mt-1 font-medium">
                      {currentPatient.demographics?.gender}, {' '}
                      {new Date().getFullYear() - new Date(currentPatient.demographics?.dateOfBirth || '').getFullYear()} years
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 space-y-6">
                {Object.values(currentPatient.visits).map(visit => (
                  <div key={visit.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        {visit.name}
                        <span className={`ml-3 px-2.5 py-0.5 rounded-full text-sm ${
                          visit.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : visit.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {visit.status}
                        </span>
                      </h3>
                      {visit.date && (
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(visit.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.values(visit.forms).map(form => (
                        <button
                          key={form.id}
                          onClick={() => {
                            setCurrentForm(form);
                            setCurrentVisit(visit);
                          }}
                          className="relative rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {form.name}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                {form.category}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  form.status === 'completed' || form.status === 'verified'
                                    ? 'bg-green-500'
                                    : form.status === 'in_progress'
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300'
                                }`}
                                style={{ width: `${form.completionPercentage}%` }}
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm">
                              <span className="text-gray-500">{form.completionPercentage}% Complete</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                form.status === 'completed' || form.status === 'verified'
                                  ? 'bg-green-100 text-green-800'
                                  : form.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {form.status}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Patient Selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a patient from the list to view their forms
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && currentForm && (
        <FormSidebar
          validationIssues={mockValidationIssues}
          queries={mockQueries}
          auditTrail={mockAuditTrail}
          onClose={() => setShowSidebar(false)}
          onResolveValidation={(id) => console.log('Resolving validation:', id)}
          onResolveQuery={(id) => console.log('Resolving query:', id)}
          onAddQueryResponse={(id, response) => console.log('Adding response:', id, response)}
        />
      )}
    </div>
  );
}
