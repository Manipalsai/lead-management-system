import { useState } from 'react';
import { LEAD_STAGES } from '../../constants/leadStages';
import '../..//styles/leads.css';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const AddLeadModal = ({ onClose, onSuccess }: Props) => {
  const [form, setForm] = useState({
    userName: '',
    companyName: '',
    contactNumber: '',
    email: '',
    stage: LEAD_STAGES[0],
    comments: ''
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    // TEMP – backend hookup next
    console.log('Lead payload:', form);
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Lead</h3>

        <input
          placeholder="User Name"
          onChange={(e) => handleChange('userName', e.target.value)}
        />
        <input
          placeholder="Company Name"
          onChange={(e) => handleChange('companyName', e.target.value)}
        />
        <input
          placeholder="Contact Number"
          onChange={(e) => handleChange('contactNumber', e.target.value)}
        />
        <input
          placeholder="Email"
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
