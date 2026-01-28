export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  target: string;
}

export interface Role {
  id?: string;
  name: string;
  description: string;
  userCount?: number;
}
