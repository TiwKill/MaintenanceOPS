import { apiClient } from '@/lib/api-client';
import { AuditLog, Role, User } from '../types';

export const governanceService = {
  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await apiClient.get('/governance/audit-logs');
    return response.data;
  },

  // Roles (Full CRUD)
  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get('/governance/roles');
    return response.data;
  },
  getPublicRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get('/governance/roles/public');
    return response.data;
  },
  createRole: async (data: any): Promise<Role> => {
    const response = await apiClient.post('/governance/roles', data);
    return response.data;
  },
  updateRole: async (id: string, data: any): Promise<Role> => {
    const response = await apiClient.put(`/governance/roles/${id}`, data);
    return response.data;
  },
  deleteRole: async (id: string): Promise<void> => {
    await apiClient.delete(`/governance/roles/${id}`);
  },

  // Users Management
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/governance/users');
    return response.data;
  },
  getTechnicians: async (): Promise<User[]> => {
    const response = await apiClient.get('/governance/technicians');
    return response.data;
  },
  inviteUser: async (data: { email: string; role: string }): Promise<void> => {
    await apiClient.post('/governance/users/invite', data);
  },
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/governance/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/governance/users/${id}`);
  },

  // Compliance
  getComplianceReport: async (): Promise<any[]> => {
    const response = await apiClient.get('/governance/compliance/report');
    return response.data;
  },
};
