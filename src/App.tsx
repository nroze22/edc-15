import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import StudySetup from './pages/StudySetup';
import ProtocolAnalysis from './pages/ProtocolAnalysis';
import ParticipantManagement from './pages/ParticipantManagement';
import StudyManagement from './pages/StudyManagement';
import LandingPage from './pages/LandingPage';
import AIChat from './components/chat/AIChat';
import AISuggestions from './pages/AISuggestions';
import Settings from './pages/Settings';
import StudySchedule from './pages/StudySchedule';
import ValidationRules from './pages/ValidationRules';
import Documentation from './pages/Documentation';
import ClinicalReview from './pages/ClinicalReview';
import DataEntry from './pages/DataEntry';
import QueriesNotes from './pages/QueriesNotes';
import SourceVerification from './pages/SourceVerification';
import ProtocolDeviations from './pages/ProtocolDeviations';
import AdverseEvents from './pages/AdverseEvents';
import MonitoringPlans from './pages/MonitoringPlans';
import SiteVisits from './pages/SiteVisits';
import RiskManagement from './pages/RiskManagement';
import ActionItems from './pages/ActionItems';
import DataExports from './pages/DataExports';
import QueryManagement from './pages/QueryManagement';
import DataCleaning from './pages/DataCleaning';
import Coding from './pages/Coding';
import Reports from './pages/Reports';
import SupplyManagement from './pages/SupplyManagement';
import DrugAccountability from './pages/DrugAccountability';
import SampleTracking from './pages/SampleTracking';
import UserManagement from './pages/UserManagement';
import RolesPermissions from './pages/RolesPermissions';
import APIIntegration from './pages/APIIntegration';
import AuditTrail from './pages/AuditTrail';
import ElectronicSignatures from './pages/ElectronicSignatures';
import Training from './pages/Training';
import HelpDocumentation from './pages/HelpDocumentation';
import Support from './pages/Support';
import Sites from './pages/Sites';
import SiteSetup from './pages/SiteSetup';
import SiteStaff from './pages/SiteStaff';
import SiteDocuments from './pages/SiteDocuments';
import SiteTraining from './pages/SiteTraining';
import SiteMonitoring from './pages/SiteMonitoring';
import CRFBuilder from './pages/CRFBuilder';
import StudyInformation from './pages/StudyInformation';
import PatientData from './pages/PatientData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Only check and set initial auth state, no redirect
  useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = () => {
    // Set auth state
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    
    // Navigate to dashboard after successful auth
    navigate('/app/dashboard');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage onAuth={handleAuth} />} />
        
        {isAuthenticated ? (
          <Route path="/app" element={<AppLayout onSignOut={handleSignOut} />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="study-information" element={<StudyInformation />} />
            <Route path="study-setup" element={<StudySetup />} />
            <Route path="protocol-analysis" element={<ProtocolAnalysis />} />
            <Route path="study-schedule" element={<StudySchedule />} />
            <Route path="validation-rules" element={<ValidationRules />} />
            <Route path="participants" element={<ParticipantManagement />} />
            <Route path="study-management" element={<StudyManagement />} />
            <Route path="ai-suggestions" element={<AISuggestions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="docs" element={<Documentation />} />
            <Route path="sites" element={<Sites />} />
            <Route path="site-setup" element={<SiteSetup />} />
            <Route path="site-staff" element={<SiteStaff />} />
            <Route path="site-documents" element={<SiteDocuments />} />
            <Route path="site-training" element={<SiteTraining />} />
            <Route path="monitoring" element={<SiteMonitoring />} />
            <Route path="clinical-review" element={<ClinicalReview />} />
            <Route path="data-entry" element={<DataEntry />} />
            <Route path="queries" element={<QueriesNotes />} />
            <Route path="source-verify" element={<SourceVerification />} />
            <Route path="deviations" element={<ProtocolDeviations />} />
            <Route path="adverse-events" element={<AdverseEvents />} />
            <Route path="monitoring-plans" element={<MonitoringPlans />} />
            <Route path="site-visits" element={<SiteVisits />} />
            <Route path="risk-management" element={<RiskManagement />} />
            <Route path="action-items" element={<ActionItems />} />
            <Route path="data-exports" element={<DataExports />} />
            <Route path="query-management" element={<QueryManagement />} />
            <Route path="data-cleaning" element={<DataCleaning />} />
            <Route path="coding" element={<Coding />} />
            <Route path="reports" element={<Reports />} />
            <Route path="supplies" element={<SupplyManagement />} />
            <Route path="drug-accountability" element={<DrugAccountability />} />
            <Route path="sample-tracking" element={<SampleTracking />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="api-keys" element={<APIIntegration />} />
            <Route path="audit" element={<AuditTrail />} />
            <Route path="signatures" element={<ElectronicSignatures />} />
            <Route path="training" element={<Training />} />
            <Route path="help-docs" element={<HelpDocumentation />} />
            <Route path="support" element={<Support />} />
            <Route path="crf-builder" element={<CRFBuilder />} />
            <Route path="patient-data" element={<PatientData />} />
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
      <AIChat />
    </div>
  );
}