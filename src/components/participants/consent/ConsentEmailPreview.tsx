import React from 'react';
import { X, Send } from 'lucide-react';

interface ConsentEmailPreviewProps {
  template: any;
  onClose: () => void;
}

export default function ConsentEmailPreview({ template, onClose }: ConsentEmailPreviewProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Consent Email Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <div className="mt-1 text-sm text-gray-900">
                Important: Your Consent Required for [Study Name]
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Content</label>
              <div className="mt-1 prose max-w-none text-sm text-gray-900">
                <p>Dear [Participant Name],</p>
                
                <p>Thank you for your interest in participating in our clinical research study: [Study Name].</p>
                
                <p>Before you can begin participation, we need to obtain your informed consent. This process is designed to ensure you understand all aspects of the study and your rights as a participant.</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 my-4">
                  <p className="font-medium">Next Steps:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Click the secure link below to access the consent portal</li>
                    <li>Verify your identity using two-factor authentication</li>
                    <li>Review the study information and consent document</li>
                    <li>Sign electronically if you agree to participate</li>
                  </ol>
                </div>

                <div className="bg-gray-100 p-4 rounded-md text-center my-4">
                  <a href="#" className="text-talosix-blue hover:text-talosix-purple font-medium">
                    Access Consent Portal →
                  </a>
                </div>

                <p>This link will expire in 7 days for security purposes.</p>
                
                <p>If you have any questions about the consent process or the study, please contact:</p>
                <ul>
                  <li>Study Coordinator: [Name]</li>
                  <li>Phone: [Phone Number]</li>
                  <li>Email: [Email Address]</li>
                </ul>
                
                <p>Best regards,<br/>[Study Team Name]</p>
                
                <div className="text-xs text-gray-500 mt-4 border-t border-gray-200 pt-4">
                  <p>This email contains confidential information. If you received this in error, please notify the sender and delete this email.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Close
            </button>
            <button
              onClick={() => {/* Handle send test */}}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talosix-blue hover:bg-talosix-purple"
            >
              <Send className="h-4 w-4 mr-1.5" />
              Send Test Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}