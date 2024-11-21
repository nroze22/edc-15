import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { CheckCircle2, Lock, AlertCircle } from 'lucide-react';

interface FormFinalizationProps {
  onFinalize: (signature: { username: string; password: string; reason: string }) => void;
  onCancel: () => void;
}

const FormFinalization: React.FC<FormFinalizationProps> = ({ onFinalize, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !reason) {
      setError('Please fill in all fields');
      return;
    }
    onFinalize({ username, password, reason });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Form Finalization</h2>
        <p className="text-gray-500">
          Please review and sign off on the form before finalizing. This action cannot be undone.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Form Validation Complete</span>
            </div>
            <div className="flex items-center space-x-2 text-primary">
              <Lock className="w-5 h-5" />
              <span className="font-medium">21 CFR Part 11 Compliant</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium mb-1">
                Reason for Signature
              </label>
              <Input
                id="reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Form review and approval"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Finalize and Sign</Button>
          </div>
        </form>
      </Card>

      <div className="text-sm text-gray-500">
        <p>
          By signing this form, you certify that all information is accurate and complete. This
          electronic signature is legally binding and equivalent to a handwritten signature.
        </p>
      </div>
    </div>
  );
};

export default FormFinalization;
