export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type WorkOrderStatus = 'OPEN' | 'IN_PROGRESS' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: WorkOrderStatus;
  asset_id: string;
  assignee_id?: string;
  due_date: string;
  created_at: string;
}

export interface PreventiveTask {
  id: string;
  machine: string;
  task: string;
  frequency: string;
  nextDate: string;
  status: 'Pending' | 'Completed';
}

export interface BreakdownLog {
  id?: string;
  machine: string;
  startTime: string;
  endTime?: string;
  duration: string;
  cause: string;
}

export interface CreateWorkOrderData {
  title: string;
  description: string;
  asset_id: string;
  priority: Priority;
  due_date: string;
}

export interface ReportBreakdownData {
  asset_id: string;
  cause: string;
  description?: string;
}
