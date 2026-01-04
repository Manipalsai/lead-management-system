import { useState } from 'react';
import { LEAD_STAGES } from '../../constants/leadStages';
import { updateLead } from '../../api/leads.api';
import type { Lead } from '../../types/lead';
import { leadSchema } from '../../schemas/lead.schema';

interface EditLeadModalProps {
    lead: Lead;
    onClose: () => void;
    onSuccess: () => void;
}

const EditLeadModal = ({ lead, onClose, onSuccess }: EditLeadModalProps) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState({
        userName: lead.userName,
        companyName: lead.companyName,
        title: lead.title ?? '',
        contactNumber: lead.contactNumber,
        email: lead.email,
        lastContactedAt: lead.lastContactedAt || new Date().toISOString(),
        stage: typeof lead.stage === 'object' ? lead.stage.name : lead.stage,
        comments: lead.comments || '',
    });

    const handleChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = leadSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((error) => {
                if (error.path[0]) fieldErrors[error.path[0].toString()] = error.message;
            });
            setErrors(fieldErrors);
            return;
        }

        try {
            setLoading(true);
            await updateLead(lead.id, form);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to update lead', err);
            alert('Failed to update lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Edit Lead</h3>
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
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${errors.userName ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
                            value={form.userName}
                            onChange={(e) => handleChange('userName', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                        <input
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${errors.companyName ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
                            value={form.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={form.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={form.contactNumber}
                                onChange={(e) => handleChange('contactNumber', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
                                value={form.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Contacted</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={form.lastContactedAt.split('T')[0]} // Format needed for date input
                            onChange={(e) => handleChange('lastContactedAt', new Date(e.target.value).toISOString())}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={form.stage}
                            onChange={(e) => handleChange('stage', e.target.value)}
                        >
                            {LEAD_STAGES.map((stage) => (
                                <option key={stage} value={stage}>{stage}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            value={form.comments}
                            onChange={(e) => handleChange('comments', e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Lead'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default EditLeadModal;
