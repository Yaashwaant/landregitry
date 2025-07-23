import React, { useState } from 'react';
import { FileText, MessageSquare, Eye, Plus, Clock, CheckCircle, XCircle, AlertCircle, MapPin, CreditCard, Calendar } from 'lucide-react';
import { CitizenUser, LandRecord, CitizenQuery } from '../../types';
import { QueryForm } from './QueryForm';

interface CitizenDashboardProps {
  citizen: CitizenUser;
  landRecords: LandRecord[];
  queries: CitizenQuery[];
  onSubmitQuery: (query: Omit<CitizenQuery, 'id' | 'dateSubmitted' | 'lastUpdated' | 'trackingId'>) => void;
  onLogout: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  citizen,
  landRecords,
  queries,
  onSubmitQuery,
  onLogout
}) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'submit-query'>('dashboard');
  const [selectedSurveyNumber, setSelectedSurveyNumber] = useState<string>('');

  // Get land records associated with this citizen
  const citizenLandRecords = landRecords.filter(record => 
    citizen.associatedSurveyNumbers.includes(record.surveyNumber)
  );

  // Get queries for this citizen's survey numbers
  const citizenQueries = queries.filter(query => 
    query.aadhaarId === citizen.aadhaarId || 
    (query.surveyNumber && citizen.associatedSurveyNumbers.includes(query.surveyNumber))
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'awarded': return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'litigated': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'awarded': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'litigated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getQueryStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'under-review': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSubmitQuery = (queryData: Omit<CitizenQuery, 'id' | 'dateSubmitted' | 'lastUpdated' | 'trackingId'>) => {
    // Pre-fill citizen information
    const completeQuery = {
      ...queryData,
      citizenName: citizen.name,
      citizenPhone: citizen.phone,
      citizenEmail: citizen.email,
      aadhaarId: citizen.aadhaarId,
      surveyNumber: selectedSurveyNumber || queryData.surveyNumber
    };
    
    onSubmitQuery(completeQuery);
    setActiveView('dashboard');
    setSelectedSurveyNumber('');
  };

  if (activeView === 'submit-query') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ←
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Submit New Query</h1>
                  <p className="text-sm text-gray-500">Raise a concern about your land acquisition</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <QueryForm
            onSubmit={handleSubmitQuery}
            onCancel={() => setActiveView('dashboard')}
            prefilledData={{
              citizenName: citizen.name,
              citizenPhone: citizen.phone,
              citizenEmail: citizen.email,
              aadhaarId: citizen.aadhaarId,
              surveyNumber: selectedSurveyNumber
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Citizen Portal</h1>
                <p className="text-sm text-gray-500">Welcome, {citizen.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{citizen.name}</p>
                <p className="text-xs text-gray-500">Aadhaar: {citizen.aadhaarId}</p>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Your Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{citizenLandRecords.length}</p>
                  <p className="text-sm text-gray-500">Under acquisition</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Queries</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {citizenQueries.filter(q => q.status !== 'resolved' && q.status !== 'rejected').length}
                  </p>
                  <p className="text-sm text-gray-500">Pending responses</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Compensation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(citizenLandRecords.reduce((sum, record) => sum + record.compensationAmount, 0))}
                  </p>
                  <p className="text-sm text-gray-500">Across all properties</p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Land Records Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Land Records</h2>
              <p className="text-sm text-gray-600">Properties associated with your Aadhaar ID</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {citizenLandRecords.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{record.surveyNumber}</h3>
                        <p className="text-sm text-gray-600">{record.landType} • {record.area} {record.areaUnit}</p>
                        <p className="text-sm text-gray-500">{record.village}, {record.tehsil}, {record.district}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.acquisitionStatus)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(record.acquisitionStatus)}`}>
                          {record.acquisitionStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Compensation Amount:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(record.compensationAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="text-gray-900">{formatDate(record.lastUpdated)}</span>
                      </div>
                      {record.dbtiId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">DBT ID:</span>
                          <span className="font-mono text-gray-900">{record.dbtiId}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSurveyNumber(record.surveyNumber);
                          setActiveView('submit-query');
                        }}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Raise Query</span>
                      </button>
                      {record.mapImageUrl && (
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors border border-gray-200 rounded-lg">
                          <MapPin className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {citizenLandRecords.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No land records found for your Aadhaar ID.</p>
                  <p className="text-sm text-gray-400 mt-1">Please contact the land acquisition office if you believe this is an error.</p>
                </div>
              )}
            </div>
          </div>

          {/* Queries by Survey Number */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Your Queries</h2>
                <p className="text-sm text-gray-600">Track queries organized by survey number</p>
              </div>
              <button
                onClick={() => setActiveView('submit-query')}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Query</span>
              </button>
            </div>
            <div className="p-6">
              {citizen.associatedSurveyNumbers.map((surveyNumber) => {
                const surveyQueries = citizenQueries.filter(q => q.surveyNumber === surveyNumber);
                const landRecord = citizenLandRecords.find(r => r.surveyNumber === surveyNumber);
                
                return (
                  <div key={surveyNumber} className="mb-8 last:mb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{surveyNumber}</h3>
                          {landRecord && (
                            <p className="text-sm text-gray-500">{landRecord.village}, {landRecord.tehsil}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{surveyQueries.length} queries</span>
                    </div>

                    {surveyQueries.length > 0 ? (
                      <div className="space-y-3 ml-11">
                        {surveyQueries.map((query) => (
                          <div key={query.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getQueryStatusIcon(query.status)}
                                  <h4 className="font-medium text-gray-900">{query.title}</h4>
                                  <span className="text-xs text-gray-500">#{query.trackingId}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{query.description}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(query.dateSubmitted)}</span>
                                  </span>
                                  <span className="capitalize">{query.queryType}</span>
                                  <span className="capitalize">{query.priority} priority</span>
                                </div>
                                {query.officialResponse && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs font-medium text-blue-900 mb-1">Official Response:</p>
                                    <p className="text-sm text-blue-800">{query.officialResponse}</p>
                                  </div>
                                )}
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                query.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                query.status === 'under-review' ? 'bg-blue-100 text-blue-800' :
                                query.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {query.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="ml-11 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-500 text-center">No queries raised for this survey number</p>
                        <button
                          onClick={() => {
                            setSelectedSurveyNumber(surveyNumber);
                            setActiveView('submit-query');
                          }}
                          className="mt-2 w-full text-sm text-green-600 hover:text-green-700 transition-colors"
                        >
                          + Raise your first query
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {citizen.associatedSurveyNumbers.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No survey numbers associated with your account.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};