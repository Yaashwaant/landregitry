import React, { useState } from 'react';
import { Search, Filter, Eye, Edit2, MapPin } from 'lucide-react';
import { LandRecord } from '../../types';

interface LandRecordsListProps {
  landRecords: LandRecord[];
  onViewRecord: (record: LandRecord) => void;
  onEditRecord: (record: LandRecord) => void;
}

export const LandRecordsList: React.FC<LandRecordsListProps> = ({
  landRecords,
  onViewRecord,
  onEditRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const filteredRecords = landRecords.filter(record => {
    const matchesSearch = 
      record.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.village.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.acquisitionStatus === statusFilter;
    const matchesDistrict = districtFilter === 'all' || record.district === districtFilter;
    
    return matchesSearch && matchesStatus && matchesDistrict;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'awarded': return 'bg-blue-100 text-blue-800';
      case 'litigated': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Land Records</h2>
        <p className="text-gray-600">Manage and track all land acquisition records</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by survey number, owner name, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="awarded">Awarded</option>
              <option value="paid">Paid</option>
              <option value="litigated">Litigated</option>
            </select>
            
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Districts</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Survey Number</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Owner</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Area</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Compensation</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{record.surveyNumber}</p>
                      <p className="text-sm text-gray-500">{record.landType}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{record.ownerName}</p>
                      <p className="text-sm text-gray-500">{record.aadhaarId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900">{record.village}</p>
                      <p className="text-sm text-gray-500">{record.tehsil}, {record.district}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{record.area} {record.areaUnit}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(record.compensationAmount)}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.acquisitionStatus)}`}>
                      {record.acquisitionStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewRecord(record)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditRecord(record)}
                        className={`p-1 text-gray-400 transition-colors ${record.acquisitionStatus === 'paid' ? 'cursor-not-allowed opacity-50' : 'hover:text-green-600'}`}
                        title={record.acquisitionStatus === 'paid' ? 'Editing disabled for paid records' : 'Edit record'}
                        disabled={record.acquisitionStatus === 'paid'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {/* View Map Image Button */}
                      {record.mapImageBase64 ? (
                        <button
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                          title="View map image"
                          onClick={() => {
                            setViewImage(record.mapImageBase64);
                            setShowImageModal(true);
                          }}
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          className="p-1 text-gray-300 cursor-not-allowed"
                          title="No map image available"
                          disabled
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No records found matching your search criteria.</p>
            </div>
          )}
        </div>
        {/* Map Image Modal */}
        {showImageModal && viewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowImageModal(false)}
                title="Close"
              >
                &times;
              </button>
              <img src={viewImage} alt="Map" className="w-full h-auto rounded" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};