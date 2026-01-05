import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LEAD_STAGES } from '../constants/leadStages';
import type { LeadStage } from '../constants/leadStages';
import type { Lead } from '../types/lead';
import AddLeadModal from '../components/leads/AddLeadModal';
import EditLeadModal from '../components/leads/EditLeadModal';
import DeleteLeadModal from '../components/leads/DeleteLeadModal';
import { fetchLeads } from '../api/leads.api';
import { useAppSelector } from '../app/hooks';
import CustomDropdown from '../components/common/CustomDropdown';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const Leads = () => {
  const getStageName = (stage: Lead['stage']) => {
    if (typeof stage === 'object' && stage !== null && 'name' in stage) {
      return stage.name;
    }
    return stage as string;
  };

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedStage, setSelectedStage] = useState<LeadStage | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'Super Admin' || user?.role === 'Admin';

  /** LOAD LEADS FROM BACKEND */
  const loadLeads = async (stage?: LeadStage | 'ALL') => {
    try {
      setLoading(true);
      const response = await fetchLeads(stage);

      // 🔑 CRITICAL FIX — normalize response
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setLeads(data);
    } catch (error) {
      console.error('Failed to load leads', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadLeads(selectedStage);
  }, [selectedStage]);

  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).openAddLead) {
      setShowAddModal(true);
      // Clear state so it doesn't reopen on refresh/navigation
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStage, searchTerm]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactNumber.includes(searchTerm);

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and track your potential customers</p>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Lead
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="Search leads by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="sm:w-64 w-full min-w-0 max-w-full flex-shrink-0 relative z-20">
          <CustomDropdown
            value={selectedStage}
            onChange={(val) => setSelectedStage(val as LeadStage | 'ALL')}
            options={[
              { label: 'All Stages', value: 'ALL' },
              ...LEAD_STAGES.map(stage => ({ label: stage, value: stage }))
            ]}
          />
        </div>
      </div>

      {/* TABLE/CARDS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile View (Cards) */}
        <div className="block md:hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading leads...</div>
          ) : paginatedLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No leads found</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedLeads.map(lead => (
                <div key={lead.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shrink-0">
                        {lead.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{lead.userName}</div>
                        <div className="text-xs text-gray-500 truncate">{lead.email}</div>
                      </div>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full ml-2 
                                    ${getStageName(lead.stage) === 'Lead Conversion' ? 'bg-green-100 text-green-800' :
                        getStageName(lead.stage) === 'Lead Generation' ? 'bg-blue-100 text-blue-800' :
                          'bg-indigo-100 text-indigo-800'}`}>
                      {getStageName(lead.stage)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="truncate">
                      <span className="text-gray-400 block mb-0.5">Company</span>
                      {lead.companyName}
                    </div>
                    <div className="truncate">
                      <span className="text-gray-400 block mb-0.5">Contact</span>
                      {lead.contactNumber}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                    <div className="text-xs text-gray-400">
                      Last: {formatDate(lead.lastContactedAt)}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingLead(lead)}
                        className="text-indigo-600 font-medium text-xs flex items-center gap-1"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setDeletingLeadId(lead.id)}
                          className="text-red-500 font-medium text-xs flex items-center gap-1"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          {/* Table Content */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Contacted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contacted
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Loading leads...</p>
                  </td>
                </tr>
              ) : paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-lg font-medium text-gray-900">No leads found</p>
                    <p className="text-sm text-gray-500">Get started by creating a new lead.</p>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                            {lead.userName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{lead.userName}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.companyName}</div>
                      <div className="text-xs text-gray-500">{lead.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.contactNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${getStageName(lead.stage) === 'Lead Conversion' ? 'bg-green-100 text-green-800' :
                          getStageName(lead.stage) === 'Lead Generation' ? 'bg-blue-100 text-blue-800' :
                            'bg-indigo-100 text-indigo-800'}`}>
                        {getStageName(lead.stage)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.firstContactedAt ? formatDate(lead.firstContactedAt) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.lastContactedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => setDeletingLeadId(lead.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div >
      </div >

      {filteredLeads.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 gap-4 sm:gap-0">
          <div className="text-sm text-gray-700 text-center sm:text-left w-full sm:w-auto">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="font-medium">{filteredLeads.length}</span> results
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {
        showAddModal && (
          <AddLeadModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              loadLeads(selectedStage);
            }}
          />
        )
      }

      {
        editingLead && (
          <EditLeadModal
            lead={editingLead}
            onClose={() => setEditingLead(null)}
            onSuccess={() => {
              setEditingLead(null);
              loadLeads(selectedStage);
            }}
          />
        )
      }

      {deletingLeadId && (
        <DeleteLeadModal
          leadId={deletingLeadId}
          onClose={() => setDeletingLeadId(null)}
          onSuccess={() => {
            loadLeads(selectedStage);
          }}
        />
      )}
    </div >
  );
};

export default Leads;
