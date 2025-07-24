import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { LandRecord } from '../../types';

interface AddRecordFormProps {
  onSave: (record: Omit<LandRecord, 'id' | 'dateCreated' | 'lastUpdated'>) => void;
  onCancel: () => void;
  existingRecord?: Omit<LandRecord, 'id' | 'dateCreated' | 'lastUpdated'>;
}

export const AddRecordForm: React.FC<{ onSave: any, onCancel: any }> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    surveyNumber: '',
    district: '',
    tehsil: '',
    village: '',
    ownerName: '',
    aadhaarId: '',
    landType: 'agricultural',
    area: '',
    areaUnit: 'acres',
    acquisitionStatus: 'pending',
    compensationAmount: '',
    dbtiId: '',
    litigationCaseId: '',
    notes: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const recordData = {
        ...formData,
        area: parseFloat(formData.area) || 0,
        compensationAmount: parseFloat(formData.compensationAmount) || 0,
        dbtiId: formData.dbtiId || undefined,
        litigationCaseId: formData.litigationCaseId || undefined,
        notes: formData.notes || undefined,
        imageFile // include image file in submission (optional)
      };
      await onSave(recordData);
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Land Record</h2>
          <p className="text-gray-600">Enter details for new land acquisition record</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-300">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Number *
            </label>
            <input
              type="text"
              name="surveyNumber"
              value={formData.surveyNumber}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., SUR-001/2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name *
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter owner's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhaar ID *
            </label>
            <input
              type="text"
              name="aadhaarId"
              value={formData.aadhaarId}
              onChange={handleInputChange}
              required
              pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1234-5678-9012"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District *
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select District</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Nagpur">Nagpur</option>
            </select>
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tehsil name"
            />
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter village name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Type *
            </label>
            <select
              name="landType"
              value={formData.landType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="agricultural">Agricultural</option>
              <option value="non-agricultural">Non-Agricultural</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="areaUnit"
                value={formData.areaUnit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compensation Amount (₹) *
            </label>
            <input
              type="number"
              name="compensationAmount"
              value={formData.compensationAmount}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Acquisition Status *
            </label>
            <select
              name="acquisitionStatus"
              value={formData.acquisitionStatus}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="awarded">Awarded</option>
              <option value="paid">Paid</option>
              <option value="litigated">Litigated</option>
            </select>
          </div>

          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Map Image (optional)
              </label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {formData.acquisitionStatus === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DBT ID
              </label>
              <input
                type="text"
                name="dbtiId"
                value={formData.dbtiId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="DBT-001-2024"
              />
            </div>
          )}

          {formData.acquisitionStatus === 'litigated' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Litigation Case ID
              </label>
              <input
                type="text"
                name="litigationCaseId"
                value={formData.litigationCaseId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="LIT-001-2024"
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any additional notes or comments..."
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-60"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const EditRecordForm: React.FC<{ onSave: any, onCancel: any, existingRecord: any }> = ({ onSave, onCancel, existingRecord }) => {
  const [formData, setFormData] = useState({
    surveyNumber: existingRecord?.surveyNumber || '',
    district: existingRecord?.district || '',
    tehsil: existingRecord?.tehsil || '',
    village: existingRecord?.village || '',
    ownerName: existingRecord?.ownerName || '',
    aadhaarId: existingRecord?.aadhaarId || '',
    landType: existingRecord?.landType || 'agricultural',
    area: existingRecord?.area?.toString() || '',
    areaUnit: existingRecord?.areaUnit || 'acres',
    acquisitionStatus: existingRecord?.acquisitionStatus || 'pending',
    compensationAmount: existingRecord?.compensationAmount?.toString() || '',
    dbtiId: existingRecord?.dbtiId || '',
    litigationCaseId: existingRecord?.litigationCaseId || '',
    notes: existingRecord?.notes || ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const recordData = {
        ...formData,
        area: parseFloat(formData.area) || 0,
        compensationAmount: parseFloat(formData.compensationAmount) || 0,
        dbtiId: formData.dbtiId || undefined,
        litigationCaseId: formData.litigationCaseId || undefined,
        notes: formData.notes || undefined
        // No imageFile here; use reupload in modal
      };
      await onSave(recordData);
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Land Record</h2>
          <p className="text-gray-600">Update details for the land acquisition record</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-300">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Number *
            </label>
            <input
              type="text"
              name="surveyNumber"
              value={formData.surveyNumber}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., SUR-001/2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Owner Name *
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter owner's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aadhaar ID *
            </label>
            <input
              type="text"
              name="aadhaarId"
              value={formData.aadhaarId}
              onChange={handleInputChange}
              required
              pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1234-5678-9012"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District *
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select District</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Nagpur">Nagpur</option>
            </select>
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tehsil name"
            />
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter village name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Type *
            </label>
            <select
              name="landType"
              value={formData.landType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="agricultural">Agricultural</option>
              <option value="non-agricultural">Non-Agricultural</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                name="areaUnit"
                value={formData.areaUnit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compensation Amount (₹) *
            </label>
            <input
              type="number"
              name="compensationAmount"
              value={formData.compensationAmount}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Acquisition Status *
            </label>
            <select
              name="acquisitionStatus"
              value={formData.acquisitionStatus}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="awarded">Awarded</option>
              <option value="paid">Paid</option>
              <option value="litigated">Litigated</option>
            </select>
          </div>

          {/* Removed image upload for edit form */}

          {formData.acquisitionStatus === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DBT ID
              </label>
              <input
                type="text"
                name="dbtiId"
                value={formData.dbtiId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="DBT-001-2024"
              />
            </div>
          )}

          {formData.acquisitionStatus === 'litigated' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Litigation Case ID
              </label>
              <input
                type="text"
                name="litigationCaseId"
                value={formData.litigationCaseId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="LIT-001-2024"
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any additional notes or comments..."
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-60"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Record'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};