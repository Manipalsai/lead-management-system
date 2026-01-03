import axios from 'axios';

const API_URL = 'http://localhost:4003';

export const fetchLeads = (stage?: string) => {
  return axios.get(`${API_URL}/leads`, {
    params: stage && stage !== 'ALL' ? { stage } : {}
  });
};

export const createLead = (payload: any) => {
  return axios.post(`${API_URL}/leads`, payload);
};
