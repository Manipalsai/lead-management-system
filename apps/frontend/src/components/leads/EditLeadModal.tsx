import { useState } from 'react';
import { LEAD_STAGES } from '../../constants/leadStages';
import { updateLead } from '../../api/leads.api';
import type { Lead } from '../../types/lead';
import { leadSchema } from '../../schemas/lead.schema';

import { COUNTRY_CODES } from '../../constants/countryCodes';

interface EditLeadModalProps {
    lead: Lead;
    onClose: () => void;
    onSuccess: () => void;
}

const EditLeadModal = ({ lead, onClose, onSuccess }: EditLeadModalProps) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Parse existing contact number
    const initialCode = COUNTRY_CODES.find(c => lead.contactNumber.startsWith(c.code))?.code || COUNTRY_CODES[0].code;
    const initialNumber = lead.contactNumber.replace(initialCode, '');

    const [form, setForm] = useState({
        userName: lead.userName,
        companyName: lead.companyName,
        title: lead.title ?? '',
        countryCode: initialCode,
        contactNumber: initialNumber,
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
            const fullContact = `${form.countryCode}${form.contactNumber}`;

            // Create a copy to submit
            const payload = { ...form, contactNumber: fullContact };
            // @ts-ignore
            delete payload.countryCode;

            await updateLead(lead.id, payload);
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
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col animate-scale-in max-h-[95vh] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-800">Edit Lead</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-2 hover:bg-gray-100">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">User Name *</label>
                                <input
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.userName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                    value={form.userName}
                                    onChange={(e) => handleChange('userName', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Name *</label>
                                <input
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.companyName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                    value={form.companyName}
                                    onChange={(e) => handleChange('companyName', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                                <input
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                    value={form.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                                {errors.title && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                                <input
                                    className={`w-full px-4 py-2 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                    value={form.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact</label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-28 px-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm shadow-sm"
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
                                                {c.code}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        className={`flex-1 px-4 py-2 border rounded-xl focus:ring-2 transition-all outline-none text-gray-900 bg-white shadow-sm ${errors.contactNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
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
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Contacted</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-900 bg-white shadow-sm"
                                    value={form.lastContactedAt.split('T')[0]}
                                    onChange={(e) => handleChange('lastContactedAt', new Date(e.target.value).toISOString())}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stage</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm appearance-none"
                                    value={form.stage}
                                    onChange={(e) => handleChange('stage', e.target.value)}
                                >
                                    {LEAD_STAGES.map((stage) => (
                                        <option key={stage} value={stage}>{stage}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Comments</label>
                            <textarea
                                rows={3}
                                className={`w-full px-4 py-2 border rounded-xl focus:ring-2 transition-all outline-none resize-none text-gray-900 bg-white shadow-sm ${errors.comments ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                value={form.comments}
                                onChange={(e) => handleChange('comments', e.target.value)}
                            />
                            {errors.comments && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.comments}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2 shadow-md transition-all transform active:scale-95"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Lead'}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default EditLeadModal;
