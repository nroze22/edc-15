import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Loader } from 'lucide-react';

interface AuthFormProps {
  initialView: 'signin' | 'signup';
  onAuth: () => void;
}

export default function AuthForm({ initialView, onAuth }: AuthFormProps) {
  const [isSignIn, setIsSignIn] = useState(initialView === 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    organization: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isSignIn) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.organization) {
        newErrors.organization = 'Organization is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onAuth();
      navigate('/app/dashboard');
    }, 1500);
  };

  return (
    <div>
      <div className="flex justify-center mb-6">
        <img 
          src="https://framerusercontent.com/images/021L73kQYq9ZIfe4FnXRxtsHM.svg" 
          alt="Talosix" 
          className="h-12 w-12"
        />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {isSignIn ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isSignIn 
            ? 'Sign in to your account to continue'
            : 'Start your 14-day free trial, no credit card required'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isSignIn && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                Organization
              </label>
              <div className="mt-1">
                <input
                  id="organization"
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm ${
                    errors.organization ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.organization && (
                  <p className="mt-1 text-xs text-red-600">{errors.organization}</p>
                )}
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`appearance-none block w-full pl-10 px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`appearance-none block w-full pl-10 pr-10 px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talosix-blue focus:border-talosix-blue sm:text-sm ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        {isSignIn && (
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a href="#" className="font-medium text-talosix-blue hover:text-talosix-purple">
                Forgot your password?
              </a>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-talosix-blue to-talosix-purple hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-talosix-blue disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {isSignIn ? 'Sign in' : 'Create account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </button>
          </div>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        {isSignIn ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setIsSignIn(!isSignIn)}
          className="font-medium text-talosix-blue hover:text-talosix-purple"
        >
          {isSignIn ? 'Create a free account' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}