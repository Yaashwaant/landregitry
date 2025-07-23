import React, { useState } from 'react';
import { Send, X, Upload, AlertCircle } from 'lucide-react';
import { CitizenQuery } from '../../types';

interface QueryFormProps {
  onSubmit: (query: Omit<CitizenQuery, 'id' | 'dateSubmitted' | 'lastUpdated' | 'trackingId'>) => void;
  onCancel: () => void;
  prefilledData?: {
    citizenName?: string;
    citizenPhone?: string;
    citizenEmail?: string;
    aadhaarId?: string;
    surveyNumber?: string;
  };
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSubmit, onCancel, prefilledData }) => {
  const [formData, setFormData] = useState({
    queryType: 'general' as CitizenQuery['queryType'],
    title: '',
    description: '',
    citizenName: prefilledData?.citizenName || '',
    citizenPhone: prefilledData?.citizenPhone || '',
    citizenEmail: prefilledData?.citizenEmail || '',
    aadhaarId: prefilledData?.aadhaarId || '',
    surveyNumber: prefilledData?.surveyNumber || '',
    district: '',
    tehsil: '',
    village: '',
    priority: 'medium' as CitizenQuery['priority']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.citizenName.trim()) newErrors.citizenName = 'Name is required';
    if (!formData.citizenPhone.trim()) newErrors.citizenPhone = 'Phone number is required';
    if (!formData.citizenEmail.trim()) newErrors.citizenEmail = 'Email is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.tehsil.trim()) newErrors.tehsil = 'Tehsil is required';
    if (!formData.village.trim()) newErrors.village = 'Village is required';

    if (formData.citizenPhone && !/^\+91-[0-9]{10}$/.test(formData.citizenPhone)) {
      newErrors.citizenPhone = 'Phone number must be in format +91-XXXXXXXXXX';
    }

    if (formData.citizenEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.citizenEmail)) {
      newErrors.citizenEmail = 'Please enter a valid email address';
    }

    if (formData.aadhaarId && !/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/.test(formData.aadhaarId)) {
      newErrors.aadhaarId = 'Aadhaar ID must be in format XXXX-XXXX-XXXX';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const queryData = {
      ...formData,
      status: 'submitted' as const,
      assignedOfficer: undefined,
      officialResponse: undefined,
      resolutionDate: undefined,
      attachments: undefined,
      aadhaarId: formData.aadhaarId || undefined,
      surveyNumber: formData.surveyNumber || undefined
    };
    
    onSubmit(queryData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const queryTypeOptions = [
    { value: 'compensation', label: 'Compensation Related' },
    { value: 'status', label: 'Status Inquiry' },
    { value: 'documentation', label: 'Document Request' },
    { value: 'objection', label: 'Objection/Appeal' },
    { value: 'general', label: 'General Inquiry' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit New Query</h2>
            <p className="text-gray-600">Fill out the form below to raise your concern</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Query Type *
              </label>
              <select
                name="queryType"
                value={formData.queryType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {queryTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Query Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief title describing your concern"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Provide detailed information about your query or concern..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Full Name *
              </label>
              <input
                type="text"
                name="citizenName"
                value={formData.citizenName}
                onChange={handleInputChange}
                disabled={!!prefilledData?.citizenName}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.citizenName ? 'border-red-300' : 'border-gray-300'
                } ${prefilledData?.citizenName ? 'bg-gray-50' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.citizenName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.citizenName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="citizenPhone"
                value={formData.citizenPhone}
                onChange={handleInputChange}
                disabled={!!prefilledData?.citizenPhone}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.citizenPhone ? 'border-red-300' : 'border-gray-300'
                } ${prefilledData?.citizenPhone ? 'bg-gray-50' : ''}`}
                placeholder="+91-9876543210"
              />
              {errors.citizenPhone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.citizenPhone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="citizenEmail"
                value={formData.citizenEmail}
                onChange={handleInputChange}
                disabled={!!prefilledData?.citizenEmail}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.citizenEmail ? 'border-red-300' : 'border-gray-300'
                } ${prefilledData?.citizenEmail ? 'bg-gray-50' : ''}`}
                placeholder="your.email@example.com"
              />
              {errors.citizenEmail && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.citizenEmail}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar ID (Optional)
              </label>
              <input
                type="text"
                name="aadhaarId"
                value={formData.aadhaarId}
                onChange={handleInputChange}
                disabled={!!prefilledData?.aadhaarId}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.aadhaarId ? 'border-red-300' : 'border-gray-300'
                } ${prefilledData?.aadhaarId ? 'bg-gray-50' : ''}`}
                placeholder="1234-5678-9012"
              />
              {errors.aadhaarId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.aadhaarId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Survey Number (If applicable)
              </label>
              <input
                type="text"
                name="surveyNumber"
                value={formData.surveyNumber}
                onChange={handleInputChange}
                disabled={!!prefilledData?.surveyNumber}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  prefilledData?.surveyNumber ? 'bg-gray-50' : ''
                }`}
                placeholder="e.g., SUR-001/2024"
              />
              {prefilledData?.surveyNumber && (
                <p className="text-xs text-gray-500 mt-1">
                  This query will be associated with the selected survey number
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.district ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select District</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Nashik">Nashik</option>
                <option value="Nagpur">Nagpur</option>
              </select>
              {errors.district && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.district}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tehsil *
              </label>
              <input
                type="text"
                name="tehsil"
                value={formData.tehsil}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.tehsil ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter tehsil name"
              />
              {errors.tehsil && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.tehsil}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Village *
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.village ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter village name"
              />
              {errors.village && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.village}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Query</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};