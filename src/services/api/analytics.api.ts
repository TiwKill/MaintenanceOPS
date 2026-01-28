import { apiClient } from '@/lib/api-client';
import { DashboardStats, TrendData } from '../types';

export const analyticsService = {
  getOverview: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/analytics/overview/');
    return response.data;
  },
  getHistory: async (months: number = 6): Promise<TrendData> => {
    const response = await apiClient.get(`/analytics/history/?months=${months}`);
    return response.data;
  },
  getKPIs: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/analytics/kpis/');
    return response.data;
  },
};
