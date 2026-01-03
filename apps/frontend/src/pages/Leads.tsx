import { useState } from 'react';
import { LEAD_STAGES } from '../constants/leadStages';
import type { LeadStage } from '../constants/leadStages';
import type { Lead } from '../types/lead';
import AddLeadModal from '../components/leads/AddLeadModal';
import '../styles/leads.css';

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    userName: 'Ravi Kumar',
    companyName: 'TechSoft',
    contactNumber: '9876543210',
    email: 'ravi@techsoft.com',
    firstContactedAt: '2025-01-01',
    lastContactedAt: '2025-01-03',
    stage: 'Lead Generation',
  },
  {
    id: '2',
    userName: 'Anita Sharma',
    companyName: 'InnoCorp',
    contactNumber: '9123456789',
    email: 'anita@innocorp.com',
    firstContactedAt: '2025-01-02',
    lastContactedAt: '2025-01-04',
    stage: 'Lead Tracking',
  },
  {
    id: '3',
    userName: 'Varshini',
    companyName: 'TCS',
    contactNumber: '9123456775',
    email: 'varshini@tcs.com',
    firstContactedAt: '2025-01-03',
    lastContactedAt: '2025-01-03',
    stage: 'Lead Tracking',
  },
];

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const Leads = () => {
  const [selectedStage, setSelectedStage] =
    useState<LeadStage | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredLeads = MOCK_LEADS.filter((lead) => {
    const matchesStage =
      selectedStage === 'ALL' || lead.stage === selectedStage;

    const matchesSearch =
      lead.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactNumber.includes(searchTerm);

    return matchesStage && matchesSearch;
  });

  return (
    <div className="leads-wrapper">
      {/* HEADER */}
      <div className="leads-header">
        <h2 className="page-title">Leads</h2>

        <div className="header-actions">
          {/* SEARCH */}
          <input
            type="text"
            className="search-input"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* STAGE FILTER */}
          <label htmlFor="stageFilter" className="sr-only">
            Filter leads by stage
          </label>

          <select
            id="stageFilter"
            className="stage-filter"
            value={selectedStage}
            onChange={(e) =>
              setSelectedStage(e.target.value as LeadStage | 'ALL')
            }
          >
            <option value="ALL">All Stages</option>
            {LEAD_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>

          {/* ADD LEAD */}
          <button
            className="primary-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add Lead
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="leads-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Company</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Stage</th>
            <th>First Contacted</th>
            <th>Last Contacted</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeads.length === 0 ? (
            <tr>
              <td colSpan={7} className="empty-row">
                No leads found
              </td>
            </tr>
          ) : (
            filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.userName}</td>
                <td>{lead.companyName}</td>
                <td>{lead.contactNumber}</td>
                <td>{lead.email}</td>
                <td>
                  <span className="stage-badge">{lead.stage}</span>
                </td>
                <td>{formatDate(lead.firstContactedAt)}</td>
                <td>{formatDate(lead.lastContactedAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            // next step: refetch leads from backend
          }}
        />
      )}
    </div>
  );
};

export default Leads;
