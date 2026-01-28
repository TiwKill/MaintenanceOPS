export type UserRole = 'ADMIN' | 'MANAGER' | 'SENIOR_TECH' | 'JUNIOR_TECH';

export interface User {
  id: string;
  email: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  team_id?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url?: string;
}
