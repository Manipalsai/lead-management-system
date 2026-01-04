import { leadApi } from './axios';

export const fetchLeads = (stage?: string) => {
  return leadApi.get('/', {
    params: stage && stage !== 'ALL' ? { stage } : {}
  });
};

export const createLead = (payload: any) => {
  return leadApi.post('/', payload);
};

export const updateLead = (id: string, data: any) => {
  return leadApi.put(`/${id}`, data);
};

export const deleteLead = (id: string) => {
  return leadApi.delete(`/${id}`);
};

export const fetchLeadStats = () => {
  return leadApi.get('/stats');
};

export const fetchRecentLeads = (limit = 5) => {
  return leadApi.get('/recent', { params: { limit } });
};

export const fetchNotifications = () => {
  return leadApi.get('/notifications');
};

export const markNotificationsRead = () => {
  return leadApi.post('/notifications/read');
};
