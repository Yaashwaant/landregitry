import { LandRecord, User } from '../types';
import { CitizenQuery, CitizenUser } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@gov.in',
  role: 'official',
  district: 'Mumbai',
  tehsil: 'Andheri'
};

export const mockCitizenUsers: CitizenUser[] = [
  {
    id: 'c1',
    name: 'Ramesh Patel',
    aadhaarId: '1234-5678-9012',
    phone: '+91-9876543210',
    email: 'ramesh.patel@email.com',
    associatedSurveyNumbers: ['SUR-001/2024']
  },
  {
    id: 'c2',
    name: 'Sunita Sharma',
    aadhaarId: '2345-6789-0123',
    phone: '+91-9876543211',
    email: 'sunita.sharma@email.com',
    associatedSurveyNumbers: ['SUR-002/2024']
  },
  {
    id: 'c3',
    name: 'Mohan Verma',
    aadhaarId: '3456-7890-1234',
    phone: '+91-9876543212',
    email: 'mohan.verma@email.com',
    associatedSurveyNumbers: ['SUR-003/2024']
  },
  {
    id: 'c4',
    name: 'Priya Gupta',
    aadhaarId: '4567-8901-2345',
    phone: '+91-9876543213',
    email: 'priya.gupta@email.com',
    associatedSurveyNumbers: ['SUR-004/2024']
  },
  {
    id: 'c5',
    name: 'Amit Singh',
    aadhaarId: '5678-9012-3456',
    phone: '+91-9876543214',
    email: 'amit.singh@email.com',
    associatedSurveyNumbers: ['SUR-005/2024']
  }
];

export const mockLandRecords: LandRecord[] = [
  {
    id: '1',
    surveyNumber: 'SUR-001/2024',
    district: 'Mumbai',
    tehsil: 'Andheri',
    village: 'Versova',
    ownerName: 'Ramesh Patel',
    aadhaarId: '1234-5678-9012',
    landType: 'agricultural',
    area: 2.5,
    areaUnit: 'acres',
    acquisitionStatus: 'paid',
    compensationAmount: 5000000,
    dateCreated: '2024-01-15',
    lastUpdated: '2024-02-20',
    mapImageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    dbtiId: 'DBT-001-2024'
  },
  {
    id: '2',
    surveyNumber: 'SUR-002/2024',
    district: 'Mumbai',
    tehsil: 'Andheri',
    village: 'Versova',
    ownerName: 'Sunita Sharma',
    aadhaarId: '2345-6789-0123',
    landType: 'non-agricultural',
    area: 1.8,
    areaUnit: 'acres',
    acquisitionStatus: 'awarded',
    compensationAmount: 8500000,
    dateCreated: '2024-01-20',
    lastUpdated: '2024-03-01',
    mapImageUrl: 'https://images.pexels.com/photos/1243949/pexels-photo-1243949.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: '3',
    surveyNumber: 'SUR-003/2024',
    district: 'Mumbai',
    tehsil: 'Andheri',
    village: 'Juhu',
    ownerName: 'Mohan Verma',
    aadhaarId: '3456-7890-1234',
    landType: 'agricultural',
    area: 3.2,
    areaUnit: 'hectares',
    acquisitionStatus: 'litigated',
    compensationAmount: 6200000,
    dateCreated: '2024-02-05',
    lastUpdated: '2024-03-15',
    litigationCaseId: 'LIT-001-2024'
  },
  {
    id: '4',
    surveyNumber: 'SUR-004/2024',
    district: 'Mumbai',
    tehsil: 'Andheri',
    village: 'Juhu',
    ownerName: 'Priya Gupta',
    aadhaarId: '4567-8901-2345',
    landType: 'non-agricultural',
    area: 0.75,
    areaUnit: 'acres',
    acquisitionStatus: 'pending',
    compensationAmount: 3200000,
    dateCreated: '2024-02-12',
    lastUpdated: '2024-02-12'
  },
  {
    id: '5',
    surveyNumber: 'SUR-005/2024',
    district: 'Mumbai',
    tehsil: 'Bandra',
    village: 'Khar',
    ownerName: 'Amit Singh',
    aadhaarId: '5678-9012-3456',
    landType: 'agricultural',
    area: 4.1,
    areaUnit: 'acres',
    acquisitionStatus: 'paid',
    compensationAmount: 7800000,
    dateCreated: '2024-01-08',
    lastUpdated: '2024-03-20',
    dbtiId: 'DBT-002-2024'
  }
];

export const mockCitizenQueries: CitizenQuery[] = [
  {
    id: '1',
    queryType: 'compensation',
    title: 'Delay in compensation payment',
    description: 'My land was acquired 6 months ago but I have not received the compensation amount yet. The survey number is SUR-001/2024 and the acquisition was marked as completed.',
    citizenName: 'Ramesh Patel',
    citizenPhone: '+91-9876543210',
    citizenEmail: 'ramesh.patel@email.com',
    aadhaarId: '1234-5678-9012',
    surveyNumber: 'SUR-001/2024',
    district: 'Mumbai',
    tehsil: 'Andheri',
    village: 'Versova',
    status: 'resolved',
    priority: 'high',
    dateSubmitted: '2024-02-15',
    lastUpdated: '2024-03-01',
    assignedOfficer: 'Rajesh Kumar',
    officialResponse: 'Your compensation has been processed and transferred to your bank account. DBT ID: DBT-001-2024. Please check your account within 2-3 business days.',
    resolutionDate: '2024-03-01',
    trackingId: 'TRK-2024-001'
  },
  {
    id: '2',
    queryType: 'status',
    title: 'Status inquiry for land acquisition',
    description: 'I want to know the current status of my land acquisition case. I received a notice 3 months ago but no updates since then.',
    citizenName: 'Sunita Sharma',
    citizenPhone: '+91-9876543211',
    citizenEmail: 'sunita.sharma@email.com',
    aadhaarId: '2345-6789-0123',
    surveyNumber: 'SUR-002/2024',
    district: 'Mumbai',
    tehsil: 'Andheri',
    village: 'Versova',
    status: 'under-review',
    priority: 'medium',
    dateSubmitted: '2024-03-10',
    lastUpdated: '2024-03-12',
    assignedOfficer: 'Rajesh Kumar',
    trackingId: 'TRK-2024-002'
  },
  {
    id: '3',
    queryType: 'objection',
    title: 'Objection to compensation amount',
    description: 'The compensation amount offered for my agricultural land seems insufficient compared to current market rates. I request a re-evaluation of the compensation.',
    citizenName: 'Mohan Verma',
    citizenPhone: '+91-9876543212',
    citizenEmail: 'mohan.verma@email.com',
    aadhaarId: '3456-7890-1234',
    surveyNumber: 'SUR-003/2024',
    district: 'Mumbai',
    tehsil: 'Andheri',
    village: 'Juhu',
    status: 'submitted',
    priority: 'high',
    dateSubmitted: '2024-03-18',
    lastUpdated: '2024-03-18',
    trackingId: 'TRK-2024-003'
  },
  {
    id: '4',
    queryType: 'documentation',
    title: 'Missing land ownership documents',
    description: 'I need copies of the acquisition documents and survey maps for my records. The original documents were submitted during the acquisition process.',
    citizenName: 'Priya Gupta',
    citizenPhone: '+91-9876543213',
    citizenEmail: 'priya.gupta@email.com',
    aadhaarId: '4567-8901-2345',
    district: 'Mumbai',
    tehsil: 'Andheri',
    village: 'Juhu',
    status: 'under-review',
    priority: 'low',
    dateSubmitted: '2024-03-20',
    lastUpdated: '2024-03-21',
    assignedOfficer: 'Rajesh Kumar',
    trackingId: 'TRK-2024-004'
  }
];