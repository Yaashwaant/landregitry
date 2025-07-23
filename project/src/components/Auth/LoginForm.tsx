import React, { useState } from 'react';
import { LogIn, Shield, Users, CreditCard } from 'lucide-react';

interface LoginFormProps {
  onOfficialLogin: (email: string, password: string) => boolean;
  onCitizenLogin: (aadhaarId: string) => boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onOfficialLogin, onCitizenLogin }) => {
  const [loginType, setLoginType] = useState<'official' | 'citizen'>('official');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aadhaarId, setAadhaarId] = useState('');
  const [error, setError] = useState('');

  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = onOfficialLogin(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = onCitizenLogin(aadhaarId);
    if (!success) {
      setError('Aadhaar ID not found. Please check your Aadhaar number.');
    }
  };

  const formatAadhaarInput = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add hyphens after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1-');
    
    // Limit to 12 digits (14 characters with hyphens)
    return formatted.substring(0, 14);
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarInput(e.target.value);
    setAadhaarId(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="text-center p-8 pb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Land Acquisition System</h1>
          <p className="text-gray-600 mt-2">Secure Government Portal</p>
        </div>

        {/* Login Type Selection */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setLoginType('official')}
              className={`p-4 rounded-lg border-2 transition-all ${
                loginType === 'official'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Official Portal</p>
            </button>
            
            <button
              onClick={() => setLoginType('citizen')}
              className={`p-4 rounded-lg border-2 transition-all ${
                loginType === 'citizen'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Citizen Portal</p>
            </button>
          </div>
        </div>

        {/* Official Login Form */}
        {loginType === 'official' && (
          <form onSubmit={handleOfficialSubmit} className="px-8 pb-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your official email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In as Official</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 text-center">
                Demo: Any email and password
              </p>
            </div>
          </form>
        )}

        {/* Citizen Login Form */}
        {loginType === 'citizen' && (
          <form onSubmit={handleCitizenSubmit} className="px-8 pb-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={aadhaarId}
                    onChange={handleAadhaarChange}
                    required
                    maxLength={14}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                    placeholder="1234-5678-9012"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your 12-digit Aadhaar number
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Access Citizen Portal</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 text-center font-medium mb-2">
                Demo Aadhaar Numbers:
              </p>
              <div className="text-xs text-green-600 space-y-1">
                <p>1234-5678-9012 (Ramesh Patel)</p>
                <p>2345-6789-0123 (Sunita Sharma)</p>
                <p>3456-7890-1234 (Mohan Verma)</p>
                <p>4567-8901-2345 (Priya Gupta)</p>
                <p>5678-9012-3456 (Amit Singh)</p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};