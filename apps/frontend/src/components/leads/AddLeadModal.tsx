import { useState } from 'react';
import { LEAD_STAGES } from '../../constants/leadStages';
import { createLead } from '../../api/leads.api';
import type { Lead } from '../../types/lead';
import { leadSchema } from '../../schemas/lead.schema';

import { COUNTRY_CODES } from '../../constants/countryCodes';

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
    countryCode: COUNTRY_CODES[0].code,
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

      // Combine code and number
      const fullContact = `${form.countryCode}${form.contactNumber}`;

      const payload = {
        ...form,
        contactNumber: fullContact,
        firstContactedAt: now,
        lastContactedAt: now,
      };

      // Remove countryCode from payload as backend doesn't expect it separate
      // @ts-ignore
      delete payload.countryCode;

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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col animate-scale-in max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800">Add New Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-2 hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">User Name *</label>
                <input
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.userName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                  placeholder="e.g. John Doe"
                  value={form.userName}
                  onChange={(e) => handleChange('userName', e.target.value)}
                />
                {errors.userName && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.userName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                <input
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.companyName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                  placeholder="e.g. Acme Inc"
                  value={form.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                />
                {errors.companyName && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.companyName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                  placeholder="e.g. CEO, Developer"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                <div className="flex gap-2">
                  <select
                    className="w-28 px-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm shadow-sm"
                    value={form.countryCode}
                    onChange={(e) => {
                      setForm(prev => ({ ...prev, countryCode: e.target.value }));
                      if (form.contactNumber) {
                        const code = COUNTRY_CODES.find(c => c.code === e.target.value);
                        if (code && form.contactNumber.length !== code.limit) {
                          setErrors(prev => ({ ...prev, contactNumber: `Number must be ${code.limit} digits` }));
                        } else {
                          setErrors(prev => ({ ...prev, contactNumber: '' }));
                        }
                      }
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.country})
                      </option>
                    ))}
                  </select>
                  <input
                    className={`flex-1 px-4 py-2.5 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.contactNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                    placeholder="1234567890"
                    value={form.contactNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setForm(prev => ({ ...prev, contactNumber: val }));

                      const code = COUNTRY_CODES.find(c => c.code === form.countryCode);
                      if (code && val.length > code.limit) return;

                      if (code && val.length !== code.limit) {
                        setErrors(prev => ({ ...prev, contactNumber: `Number must be ${code.limit} digits` }));
                      } else {
                        setErrors(prev => ({ ...prev, contactNumber: '' }));
                      }
                    }}
                  />
                </div>
                {errors.contactNumber && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.contactNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Stage</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white text-gray-900 shadow-sm"
                    value={form.stage}
                    onChange={(e) => handleChange('stage', e.target.value)}
                  >
                    {LEAD_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Comments</label>
              <textarea
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all outline-none resize-none text-gray-900 bg-white shadow-sm ${errors.comments ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                placeholder="Add any specific requirements or notes..."
                value={form.comments}
                onChange={(e) => handleChange('comments', e.target.value)}
              />
              {errors.comments && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.comments}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md disabled:opacity-70 flex items-center gap-2 transition-all transform active:scale-95"
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
                ) : 'Save New Lead'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;
