import { apiClient } from '@/lib/api-client';
import { GeneralSettings, Integration, Workflow } from '../types';

export const settingsService = {
  getGeneralSettings: async (): Promise<GeneralSettings> => {
    const response = await apiClient.get('/settings/general');
    return response.data;
  },
  updateGeneralSettings: async (data: Partial<GeneralSettings>): Promise<GeneralSettings> => {
    const response = await apiClient.put('/settings/general', data);
    return response.data;
  },
  getIntegrations: async (): Promise<Integration[]> => {
    const response = await apiClient.get('/settings/integrations');
    return response.data;
  },
  connectIntegration: async (data: { service_name: string; api_key: string }): Promise<Integration> => {
    const response = await apiClient.post('/settings/integrations/connect', data);
    return response.data;
  },
  getWorkflows: async (): Promise<Workflow[]> => {
    const response = await apiClient.get('/settings/workflows');
    return response.data;
  },
  createWorkflow: async (data: Omit<Workflow, 'id'>): Promise<Workflow> => {
    const response = await apiClient.post('/settings/workflows', data);
    return response.data;
  },
  updateWorkflow: async (id: string, data: Partial<Workflow>): Promise<Workflow> => {
    const response = await apiClient.put(`/settings/workflows/${id}`, data);
    return response.data;
  },
};
