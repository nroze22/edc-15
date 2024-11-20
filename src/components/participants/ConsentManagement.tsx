import React, { useState } from 'react';
import { 
  FileText, 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  Download,
  Send,
  Lock,
  Smartphone
} from 'lucide-react';
import ConsentFormPreview from './consent/ConsentFormPreview';
import ConsentEmailPreview from './consent/ConsentEmailPreview';
import MFASetup from './consent/MFASetup';
import { useConsentStore } from '../../store/useConsentStore';

export default function ConsentManagement() {
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false);
  
  const { 
    consentTemplate,
    emailTemplate,
    mfaSettings,
    updateConsentTemplate,
    updateEmailTemplate,
    updateMFASettings,
    sendConsentRequest
  } = useConsentStore();

  const handleSendConsent = async (participantId: string) => {
    await sendConsentRequest(participantId);
  };

  return (
    <div className="space-y-6">
      {/* Consent Process Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">eConsent Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              21 CFR Part 11 compliant electronic consent process
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowEmailPreview(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Mail className="h-4 w-4 mr-1.5" />
              Preview Email
            </button>
            <button
              onClick={() => setShowFormPreview(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Preview Form
            </button>
          </div>
        </div>

        {/* Consent Process Steps */}
        <div className="grid grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-talosix-blue mr-2" />
              <h4 className="text-sm font-medium text-gray-900">1. Email Invitation</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                Secure email delivery
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                Unique access link
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                Study information packet
              </li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-talosix-blue mr-2" />
              <h4 className="text-sm font-medium text-gray-900">2. Identity Verification</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                Two-factor authentication
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                SMS or authenticator app
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                Identity confirmation
              </li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-talosix-blue mr-2" />
              <h4 className="text-sm font-medium text-gray-900">3. eConsent Review</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                Interactive consent form
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                Section acknowledgments
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                Digital signature capture
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security & Compliance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Security & Compliance</h3>
            <p className="mt-1 text-sm text-gray-500">
              Authentication and regulatory compliance features
            </p>
          </div>
          <button
            onClick={() => setShowMFASetup(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Lock className="h-4 w-4 mr-1.5" />
            Configure MFA
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Authentication Methods</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS Authentication</p>
                    <p className="text-xs text-gray-500">Verification code via text message</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Enabled</span>
                  <div className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-talosix-blue focus:ring-offset-2 bg-talosix-blue">
                    <span className="translate-x-4 inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Authenticator App</p>
                    <p className="text-xs text-gray-500">Time-based one-time passwords</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Enabled</span>
                  <div className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-talosix-blue focus:ring-offset-2 bg-talosix-blue">
                    <span className="translate-x-4 inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Compliance Features</h4>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">21 CFR Part 11 Compliance</p>
                  <ul className="mt-1 text-xs text-gray-500 space-y-1">
                    <li>• Electronic signature validation</li>
                    <li>• Audit trail maintenance</li>
                    <li>• System security controls</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">HIPAA Compliance</p>
                  <ul className="mt-1 text-xs text-gray-500 space-y-1">
                    <li>• Data encryption</li>
                    <li>• Access controls</li>
                    <li>• Privacy safeguards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFormPreview && (
        <ConsentFormPreview
          template={consentTemplate}
          onClose={() => setShowFormPreview(false)}
        />
      )}

      {showEmailPreview && (
        <ConsentEmailPreview
          template={emailTemplate}
          onClose={() => setShowEmailPreview(false)}
        />
      )}

      {showMFASetup && (
        <MFASetup
          settings={mfaSettings}
          onSave={updateMFASettings}
          onClose={() => setShowMFASetup(false)}
        />
      )}
    </div>
  );
}