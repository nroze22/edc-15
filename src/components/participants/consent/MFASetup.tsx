import React, { useState } from 'react';
import { X, Smartphone, Shield, QrCode, Copy, Check } from 'lucide-react';

interface MFASetupProps {
  settings: any;
  onSave: (settings: any) => void;
  onClose: () => void;
}

export default function MFASetup({ settings, onSave, onClose }: MFASetupProps) {
  const [method, setMethod] = useState<'sms' | 'authenticator'>('sms');
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopySecret = () => {
    navigator.clipboard.writeText('ABCD1234EFGH5678');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Configure Two-Factor Authentication</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Choose Authentication Method
                </h4>
                <div className="space-y-4">
                  <div
                    onClick={() => setMethod('sms')}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                      method === 'sms'
                        ? 'border-talosix-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className={`h-6 w-6 ${
                      method === 'sms' ? 'text-talosix-blue' : 'text-gray-400'
                    }`} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">SMS Authentication</p>
                      <p className="text-xs text-gray-500">
                        Receive verification codes via text message
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setMethod('authenticator')}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                      method === 'authenticator'
                        ? 'border-talosix-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Shield className={`h-6 w-6 ${
                      method === 'authenticator' ? 'text-talosix-blue' : 'text-gray-400'
                    }`} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Authenticator App</p>
                      <p className="text-xs text-gray-500">
                        Use an authenticator app like Google Authenticator
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple"
                >
                  Continue Setup
                </button>
              </div>
            </div>
          )}

          {step === 2 && method === 'authenticator' && (
            <div className="space-y-6">
              <div className="text-center">
                <QrCode className="h-48 w-48 mx-auto text-gray-900" />
                <p className="mt-4 text-sm text-gray-500">
                  Scan this QR code with your authenticator app
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Or enter this setup key manually:
                </label>
                <div className="mt-1 flex items-center">
                  <code className="flex-1 block w-full p-2 text-sm bg-gray-50 rounded-md font-mono">
                    ABCD 1234 EFGH 5678
                  </code>
                  <button
                    onClick={handleCopySecret}
                    className="ml-2 p-2 text-gray-400 hover:text-gray-500"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <div className="flex justify-end space- x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Back
                </button>
                <button
                  onClick={() => {/* Handle verification */}}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple"
                >
                  Verify & Complete
                </button>
              </div>
            </div>
          )}

          {step === 2 && method === 'sms' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Phone Number
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    +1
                  </span>
                  <input
                    type="tel"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm"
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <Shield className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Verification Required
                    </h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      We'll send a verification code to this number to confirm it's yours.
                      Standard message rates may apply.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Back
                </button>
                <button
                  onClick={() => {/* Handle send code */}}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple"
                >
                  Send Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}