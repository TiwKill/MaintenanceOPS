import { apiClient } from '@/lib/api-client';
import { BreakdownLog, ReportBreakdownData, PreventiveTask, WorkOrder, CreateWorkOrderData } from '../types';

export const operationService = {
  // Work Orders (Full CRUD)
  getWorkOrders: async (): Promise<WorkOrder[]> => {
    const response = await apiClient.get('/work-orders/');
    return response.data;
  },
  createWorkOrder: async (data: CreateWorkOrderData): Promise<WorkOrder> => {
    const response = await apiClient.post('/work-orders/', data);
    return response.data;
  },
  updateWorkOrder: async (id: string, data: Partial<CreateWorkOrderData>): Promise<WorkOrder> => {
    const response = await apiClient.put(`/work-orders/${id}/`, data);
    return response.data;
  },
  deleteWorkOrder: async (id: string): Promise<void> => {
    await apiClient.delete(`/work-orders/${id}/`);
  },

  // Preventive Tasks (PMs)
  getPreventiveTasks: async (assetId?: string): Promise<PreventiveTask[]> => {
    const url = assetId ? `/operations/preventive/?asset_id=${assetId}` : '/operations/preventive/';
    const response = await apiClient.get(url);
    return response.data;
  },
  createPreventiveTask: async (data: any): Promise<PreventiveTask> => {
    const response = await apiClient.post('/operations/preventive/', data);
    return response.data;
  },
  deletePreventiveTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/operations/preventive/${id}/`);
  },
  runPreventiveGenerator: async (): Promise<{ message: string; work_orders_created: number }> => {
    const response = await apiClient.post('/operations/preventive/generate/');
    return response.data;
  },

  // Breakdowns
  getBreakdowns: async (assetId?: string): Promise<BreakdownLog[]> => {
    const url = assetId ? `/operations/breakdowns/?asset_id=${assetId}` : '/operations/breakdowns/';
    const response = await apiClient.get(url);
    return response.data;
  },
  reportBreakdown: async (data: ReportBreakdownData): Promise<BreakdownLog> => {
    const response = await apiClient.post('/operations/breakdowns/', data);
    return response.data;
  },
  resolveBreakdown: async (id: string, data: { completion_notes: string; root_cause: string }): Promise<BreakdownLog> => {
    const response = await apiClient.put(`/operations/breakdowns/${id}/resolve/`, data);
    return response.data;
  },

  // Schedules
  getSchedules: async (): Promise<any[]> => {
    const response = await apiClient.get('/operations/schedules/');
    return response.data;
  },
};
