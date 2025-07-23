import React from 'react';
import { MetricCard } from './MetricCard';
import { LandRecord } from '../../types';

interface DashboardProps {
  landRecords: LandRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ landRecords }) => {
  const totalProperties = landRecords.length;
  const propertiesAcquired = landRecords.filter(r => r.acquisitionStatus === 'paid' || r.acquisitionStatus === 'awarded').length;
  const compensationPending = landRecords.filter(r => r.acquisitionStatus === 'pending' || r.acquisitionStatus === 'awarded').length;
  const compensationPaid = landRecords.filter(r => r.acquisitionStatus === 'paid').length;
  const litigationCases = landRecords.filter(r => r.acquisitionStatus === 'litigated').length;
  const totalCompensation = landRecords.reduce((sum, record) => {
    return record.acquisitionStatus === 'paid' ? sum + record.compensationAmount : sum;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const recentActivities = landRecords
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Track land acquisition progress and compensation status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Properties"
          value={totalProperties}
          subtitle="Under acquisition"
          
          color="blue"
        />
        
        <MetricCard
          title="Properties Acquired"
          value={propertiesAcquired}
          subtitle={`${Math.round((propertiesAcquired / totalProperties) * 100)}% completion rate`}
          
          color="green"
        />
        
        <MetricCard
          title="Compensation Pending"
          value={compensationPending}
          subtitle="Awaiting payment"
          color="yellow"
        />
        
        <MetricCard
          title="Compensation Paid"
          value={compensationPaid}
          subtitle="Successfully disbursed"
          
          color="green"
        />
        
        <MetricCard
          title="Litigation Cases"
          value={litigationCases}
          subtitle="Under legal review"
          
          color="red"
        />
        
        <MetricCard
          title="Total Compensation"
          value={formatCurrency(totalCompensation)}
          subtitle="Disbursed amount"
          
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {[
              { status: 'Paid', count: compensationPaid, color: 'bg-green-500' },
              { status: 'Awarded', count: landRecords.filter(r => r.acquisitionStatus === 'awarded').length, color: 'bg-blue-500' },
              { status: 'Pending', count: landRecords.filter(r => r.acquisitionStatus === 'pending').length, color: 'bg-yellow-500' },
              { status: 'Litigated', count: litigationCases, color: 'bg-red-500' }
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                </div>
                <span className="text-sm text-gray-600">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((record) => (
              <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{record.surveyNumber}</p>
                  <p className="text-xs text-gray-500">{record.ownerName} • {record.village}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    record.acquisitionStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    record.acquisitionStatus === 'awarded' ? 'bg-blue-100 text-blue-800' :
                    record.acquisitionStatus === 'litigated' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.acquisitionStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
