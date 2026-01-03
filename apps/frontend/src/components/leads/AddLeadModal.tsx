import { useState } from 'react';
import { LEAD_STAGES } from '../../constants/leadStages';
import type { Lead } from '../../types/lead';
import '../../styles/leads.css';

interface AddLeadModalProps {
  onClose: () => void;
  onSuccess: (newLead: Lead) => void;
}

const AddLeadModal = ({ onClose, onSuccess }: AddLeadModalProps) => {
  const [form, setForm] = useState({
    userName: '',
    companyName: '',
    contactNumber: '',
    email: '',
    stage: LEAD_STAGES[0],
    comments: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // TEMP: frontend-only lead creation (backend next)
    const newLead: Lead = {
      id: crypto.randomUUID(),
      userName: form.userName,
      companyName: form.companyName,
      contactNumber: form.contactNumber,
      email: form.email,
      stage: form.stage,
      firstContactedAt: new Date().toISOString().split('T')[0],
      lastContactedAt: new Date().toISOString().split('T')[0],
    };

    onSuccess(newLead);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Lead</h3>

        <input
          placeholder="User Name"
          value={form.userName}
          onChange={(e) => handleChange('userName', e.target.value)}
        />

        <input
          placeholder="Company Name"
          value={form.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
        />

        <input
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={(e) => handleChange('contactNumber', e.target.value)}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />

        <select
          value={form.stage}
          onChange={(e) => handleChange('stage', e.target.value)}
        >
          {LEAD_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Comments (optional)"
          value={form.comments}
          onChange={(e) => handleChange('comments', e.target.value)}
        />

        <div className="modal-actions">
          <button className="primary-btn" onClick={handleSubmit}>
            Save Lead
          </button>
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;
