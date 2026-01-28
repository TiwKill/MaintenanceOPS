export interface GeneralSettings {
  org_name: string;
  industry: string;
  contact_email: string;
  phone: string;
  timezone: string;
  currency: string;
}

export interface Integration {
  id: string;
  service_name: string;
  status: 'Connected' | 'Disconnected';
  lastSync: string;
  type: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  is_active: boolean;
}
