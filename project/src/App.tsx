import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/Auth/LoginForm';
import { CitizenDashboard } from './components/Citizen/CitizenDashboard';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { LandRecordsList } from './components/Records/LandRecordsList';
import { AddRecordForm } from './components/Records/AddRecordForm';
import { LandRecordView } from './components/Records/LandRecordView';
import { QueriesManagement } from './components/Queries/QueriesManagement';
import { mockLandRecords, mockCitizenQueries } from './data/mockData';
import { LandRecord, CitizenQuery } from './types';

function App() {
  const { user, citizenUser, login, citizenLogin, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [landRecords, setLandRecords] = useState<LandRecord[]>(mockLandRecords);
  const [citizenQueries, setCitizenQueries] = useState<CitizenQuery[]>(mockCitizenQueries);
  const [selectedRecord, setSelectedRecord] = useState<LandRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<LandRecord | null>(null);
  const [previousTab, setPreviousTab] = useState<string>('dashboard');

  const handleAddRecord = async (recordData: Omit<LandRecord, 'id' | 'dateCreated' | 'lastUpdated'>) => {
    // Prepare form data for API
    const formData = new FormData();
    Object.entries(recordData).forEach(([key, value]) => {
      if (key === 'imageFile' && value) {
        formData.append('imageFile', value as File);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/api/landRecords', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errorMsg = 'Failed to add record';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const newRecord = await response.json();
      setLandRecords(prev => [...prev, newRecord]);
      setActiveTab('records');
    } catch (error) {
      // Instead of alert, throw error so AddRecordForm can display it
      throw error;
    }
  };

  const handleViewRecord = (record: LandRecord) => {
    setViewRecord(record);
    setPreviousTab(activeTab);
    setActiveTab('view-record');
  };

  const handleEditRecord = (record: LandRecord) => {
    setSelectedRecord(record);
    setActiveTab('add-record');
  };

  const handleSubmitQuery = (queryData: Omit<CitizenQuery, 'id' | 'dateSubmitted' | 'lastUpdated' | 'trackingId'>) => {
    const newQuery: CitizenQuery = {
      ...queryData,
      id: Date.now().toString(),
      dateSubmitted: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      trackingId: `TRK-2024-${String(citizenQueries.length + 1).padStart(3, '0')}`
    };
    
    setCitizenQueries(prev => [...prev, newQuery]);
    alert(`Query submitted successfully! Your tracking ID is: ${newQuery.trackingId}`);
  };

  const handleUpdateQuery = (queryId: string, updates: Partial<CitizenQuery>) => {
    setCitizenQueries(prev => 
      prev.map(query => 
        query.id === queryId 
          ? { ...query, ...updates }
          : query
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-sm">LA</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show citizen dashboard if citizen is logged in
  if (citizenUser) {
    return (
      <CitizenDashboard
        citizen={citizenUser}
        landRecords={landRecords}
        queries={citizenQueries}
        onSubmitQuery={handleSubmitQuery}
        onLogout={logout}
      />
    );
  }

  // Show login form if no user is logged in
  if (!user) {
    return <LoginForm onOfficialLogin={login} onCitizenLogin={citizenLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard landRecords={landRecords} />;
      case 'records':
        return (
          <LandRecordsList
            landRecords={landRecords}
            onViewRecord={handleViewRecord}
            onEditRecord={handleEditRecord}
          />
        );
      case 'add-record':
        return (
          <AddRecordForm
            onSave={handleAddRecord}
            onCancel={() => {
              setActiveTab('records');
              setSelectedRecord(null);
            }}
            existingRecord={selectedRecord || undefined}
          />
        );
      case 'view-record':
        return (
          <LandRecordView
            record={viewRecord!}
            onClose={() => {
              setActiveTab(previousTab);
              setViewRecord(null);
            }}
          />
        );
      case 'queries':
        return (
          <QueriesManagement
            queries={citizenQueries}
            onUpdateQuery={handleUpdateQuery}
          />
        );
      case 'maps':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey Maps</h2>
              <p className="text-gray-600">View and manage survey maps for all properties</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Map viewer functionality will be implemented in the next phase.</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
              <p className="text-gray-600">Advanced analytics and reporting tools</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Advanced analytics features will be available in Phase 4.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600">System configuration and user preferences</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Settings panel coming soon.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard landRecords={landRecords} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        user={user} 
        onLogout={logout} 
      />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
