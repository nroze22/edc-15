import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: () => void;
  initialView?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onAuth, initialView = 'signin' }: AuthModalProps) {
  const [view, setView] = useState(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Simulate auth delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the auth callback first
      onAuth();
      
      // Only close after successful auth
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="text-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {view === 'signin' ? 'Sign In' : 'Create Account'}
                  </h3>
                </Dialog.Title>

                {error && (
                  <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
                    {error}
                  </div>
                )}

                <div className="px-6 pb-6 space-y-5">
                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      disabled={isLoading}
                      className="flex items-center justify-center px-4 py-2 border border-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-700 transition-colors group disabled:opacity-50"
                      onClick={handleAuth}
                    >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                      <span>Google</span>
                    </button>
                    <button
                      disabled={isLoading}
                      className="flex items-center justify-center px-4 py-2 border border-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-700 transition-colors group disabled:opacity-50"
                      onClick={handleAuth}
                    >
                      <img src="https://www.microsoft.com/favicon.ico" alt="Teams" className="w-5 h-5 mr-2" />
                      <span>Teams</span>
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {view === 'signin' ? (
                    <>
                      <SignInForm onAuth={handleAuth} isLoading={isLoading} />
                      <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <button
                          onClick={() => setView('signup')}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Sign up
                        </button>
                      </p>
                    </>
                  ) : (
                    <>
                      <SignUpForm onAuth={handleAuth} isLoading={isLoading} />
                      <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <button
                          onClick={() => setView('signin')}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Sign in
                        </button>
                      </p>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}