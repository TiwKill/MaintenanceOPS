import { apiClient } from '@/lib/api-client';
import { Asset, CreateAssetData, CreateInventoryData, InventoryItem, Tool } from '../types';

export const assetService = {
  // Machines/Assets
  getAssets: async (): Promise<Asset[]> => {
    const response = await apiClient.get('/assets');
    return response.data;
  },
  getAsset: async (id: string): Promise<Asset> => {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data;
  },
  createAsset: async (data: CreateAssetData): Promise<Asset> => {
    const response = await apiClient.post('/assets', data);
    return response.data;
  },
  updateAsset: async (id: string, data: Partial<CreateAssetData>): Promise<Asset> => {
    const response = await apiClient.put(`/assets/${id}`, data);
    return response.data;
  },
  deleteAsset: async (id: string): Promise<void> => {
    await apiClient.delete(`/assets/${id}`);
  },

  // Inventory
  getInventory: async (): Promise<InventoryItem[]> => {
    const response = await apiClient.get('/inventory');
    return response.data;
  },
  createInventoryItem: async (data: CreateInventoryData): Promise<InventoryItem> => {
    const response = await apiClient.post('/inventory', data);
    return response.data;
  },
  updateInventoryItem: async (id: string, data: Partial<CreateInventoryData>): Promise<InventoryItem> => {
    const response = await apiClient.put(`/inventory/${id}`, data);
    return response.data;
  },
  deleteInventoryItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/${id}`);
  },

  // Tools
  getTools: async (): Promise<Tool[]> => {
    const response = await apiClient.get('/tools');
    return response.data;
  },
  createTool: async (data: any): Promise<Tool> => {
    const response = await apiClient.post('/tools', data);
    return response.data;
  },
  updateTool: async (id: string, data: any): Promise<Tool> => {
    const response = await apiClient.put(`/tools/${id}`, data);
    return response.data;
  },
  deleteTool: async (id: string): Promise<void> => {
    await apiClient.delete(`/tools/${id}`);
  },
};
