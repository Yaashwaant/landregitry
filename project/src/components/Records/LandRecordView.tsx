import React from 'react';
import { X } from 'lucide-react';
import { LandRecord } from '../../types';

interface LandRecordViewProps {
  record: LandRecord;
  onClose: () => void;
}

export const LandRecordView: React.FC<LandRecordViewProps> = ({ record, onClose }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Land Record Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Survey Number:</strong> {record.surveyNumber}</p>
            <p><strong>Owner Name:</strong> {record.ownerName}</p>
            <p><strong>Aadhaar ID:</strong> {record.aadhaarId}</p>
            <p><strong>District:</strong> {record.district}</p>
            <p><strong>Tehsil:</strong> {record.tehsil}</p>
            <p><strong>Village:</strong> {record.village}</p>
            <p><strong>Land Type:</strong> {record.landType}</p>
            {record.mapImageBase64 && (
              <div className="mt-2">
                <strong>Map Image:</strong><br />
                <img src={record.mapImageBase64} alt="Map" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 4 }} />
              </div>
            )}
            {record.imageUrl && (
              <div className="mt-2">
                <strong>Uploaded Image:</strong><br />
                <img src={record.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 4 }} />
              </div>
            )}
          </div>
          <div>
            <p><strong>Area:</strong> {record.area} {record.areaUnit}</p>
            <p><strong>Compensation Amount:</strong> {formatCurrency(record.compensationAmount)}</p>
            <p><strong>Acquisition Status:</strong> {record.acquisitionStatus}</p>
            {record.dbtiId && <p><strong>DBT ID:</strong> {record.dbtiId}</p>}
            {record.litigationCaseId && <p><strong>Litigation Case ID:</strong> {record.litigationCaseId}</p>}
            {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
