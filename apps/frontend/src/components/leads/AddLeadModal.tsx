import { useState } from 'react';
import { LEAD_STAGES } from '../../constants/leadStages';
import { createLead } from '../../api/leads.api';
import type { Lead } from '../../types/lead';
import { leadSchema } from '../../schemas/lead.schema';

interface AddLeadModalProps {
  onClose: () => void;
  onSuccess: (newLead: Lead) => void;
}

const AddLeadModal = ({ onClose, onSuccess }: AddLeadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    userName: '',
    companyName: '',
    title: '',
    contactNumber: '',
    email: '',
    stage: LEAD_STAGES[0],
    comments: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error when user types
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod Validation
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0].toString()] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const now = new Date().toISOString();

      const payload = {
        ...form,
        firstContactedAt: now,
        lastContactedAt: now,
      };

      const res = await createLead(payload);
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to add lead', err);
      alert('Failed to add lead. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Add New Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Name *</label>
            <input
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${errors.userName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="e.g. John Doe"
              value={form.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
            />
            {errors.userName && <p className="text-xs text-red-500 mt-1">{errors.userName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${errors.companyName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="e.g. Acme Inc"
              value={form.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
            {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              placeholder="e.g. CEO, Developer"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="+1 234..."
                value={form.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 transition-all outline-none ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500'}`}
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stage</label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                value={form.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
              >
                {LEAD_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
              placeholder="Any initial notes..."
              value={form.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm disabled:opacity-70 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
