import React, { useState } from 'react';
import { Search, Filter, Eye, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react';
import { CitizenQuery } from '../../types';

interface QueriesManagementProps {
  queries: CitizenQuery[];
  onUpdateQuery: (queryId: string, updates: Partial<CitizenQuery>) => void;
}

export const QueriesManagement: React.FC<QueriesManagementProps> = ({
  queries,
  onUpdateQuery
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState<CitizenQuery | null>(null);
  const [response, setResponse] = useState('');

  const filteredQueries = queries.filter(query => {
    const matchesSearch = 
      query.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (query.surveyNumber && query.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || query.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'under-review': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (queryId: string, newStatus: CitizenQuery['status']) => {
    const updates: Partial<CitizenQuery> = {
      status: newStatus,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (newStatus === 'under-review') {
      updates.assignedOfficer = 'Rajesh Kumar'; // In real app, this would be the current user
    }

    if (newStatus === 'resolved' || newStatus === 'rejected') {
      updates.resolutionDate = new Date().toISOString().split('T')[0];
      if (response.trim()) {
        updates.officialResponse = response.trim();
      }
    }

    onUpdateQuery(queryId, updates);
    setSelectedQuery(null);
    setResponse('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const queryStats = {
    total: queries.length,
    submitted: queries.filter(q => q.status === 'submitted').length,
    underReview: queries.filter(q => q.status === 'under-review').length,
    resolved: queries.filter(q => q.status === 'resolved').length,
    rejected: queries.filter(q => q.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Citizen Queries Management</h2>
        <p className="text-gray-600">Review and respond to citizen queries about land acquisition</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Queries</p>
              <p className="text-2xl font-bold text-gray-900">{queryStats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New</p>
              <p className="text-2xl font-bold text-yellow-600">{queryStats.submitted}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">{queryStats.underReview}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{queryStats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{queryStats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by tracking ID, citizen name, or survey number..."
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
              <option value="submitted">Submitted</option>
              <option value="under-review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tracking ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Citizen</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Query</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((query) => (
                <tr key={query.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-mono text-sm font-medium text-gray-900">{query.trackingId}</p>
                    <p className="text-xs text-gray-500 capitalize">{query.queryType}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{query.citizenName}</p>
                      <p className="text-sm text-gray-500">{query.citizenPhone}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{query.title}</p>
                      {query.surveyNumber && (
                        <p className="text-sm text-gray-500">{query.surveyNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm text-gray-900">{query.village}</p>
                      <p className="text-sm text-gray-500">{query.tehsil}, {query.district}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(query.priority)}`}>
                      {query.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(query.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(query.status)}`}>
                        {query.status.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{formatDate(query.dateSubmitted)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedQuery(query)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View and respond"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredQueries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No queries found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedQuery.title}</h3>
                <p className="text-sm text-gray-600">Tracking ID: {selectedQuery.trackingId}</p>
              </div>
              <button
                onClick={() => setSelectedQuery(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Citizen Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedQuery.citizenName}</span>
                    </div>
                    <p>📞 {selectedQuery.citizenPhone}</p>
                    <p>✉️ {selectedQuery.citizenEmail}</p>
                    {selectedQuery.aadhaarId && <p>🆔 {selectedQuery.aadhaarId}</p>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Query Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Type:</span> {selectedQuery.queryType}</p>
                    <p><span className="font-medium">Priority:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedQuery.priority)}`}>
                        {selectedQuery.priority}
                      </span>
                    </p>
                    <p><span className="font-medium">Location:</span> {selectedQuery.village}, {selectedQuery.tehsil}, {selectedQuery.district}</p>
                    {selectedQuery.surveyNumber && (
                      <p><span className="font-medium">Survey Number:</span> {selectedQuery.surveyNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Description</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{selectedQuery.description}</p>
                </div>
              </div>

              {selectedQuery.officialResponse && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Previous Response</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-900">{selectedQuery.officialResponse}</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Official Response</h4>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your response to the citizen..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedQuery(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                
                {selectedQuery.status === 'submitted' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedQuery.id, 'under-review')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Review
                  </button>
                )}
                
                {selectedQuery.status === 'under-review' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedQuery.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedQuery.id, 'resolved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};