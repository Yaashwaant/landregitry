export interface LandRecord {
  id: string;
  surveyNumber: string;
  district: string;
  tehsil: string;
  village: string;
  ownerName: string;
  aadhaarId: string;
  landType: 'agricultural' | 'non-agricultural';
  area: number;
  areaUnit: 'acres' | 'hectares';
  acquisitionStatus: 'pending' | 'awarded' | 'litigated' | 'paid';
  compensationAmount: number;
  dateCreated: string;
  lastUpdated: string;
  mapImageUrl?: string;
  mapImageBase64?: string;
  dbtiId?: string;
  litigationCaseId?: string;
  notes?: string;
  imageUrl?: string; // Path or URL to uploaded image
  imageFile?: File; // For form submission only
}

export interface CitizenQuery {
  id: string;
  queryType: 'compensation' | 'status' | 'documentation' | 'objection' | 'general';
  title: string;
  description: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  aadhaarId?: string;
  surveyNumber?: string;
  district: string;
  tehsil: string;
  village: string;
  status: 'submitted' | 'under-review' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dateSubmitted: string;
  lastUpdated: string;
  assignedOfficer?: string;
  officialResponse?: string;
  resolutionDate?: string;
  attachments?: string[];
  trackingId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'official' | 'operator';
  district?: string;
  tehsil?: string;
}

export interface CitizenUser {
  id: string;
  name: string;
  aadhaarId: string;
  phone: string;
  email: string;
  associatedSurveyNumbers: string[];
}

export interface DashboardMetrics {
  totalProperties: number;
  propertiesAcquired: number;
  compensationPending: number;
  compensationPaid: number;
  litigationCases: number;
  totalCompensation: number;
}