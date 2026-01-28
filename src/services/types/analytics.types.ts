export interface DashboardStats {
  active_work_orders: number;
  critical_assets: number;
  current_uptime: string;
  mttr: string;
  mtbf: string;
}

export interface TrendData {
  reliability_trend: { month: string; score: number }[];
  breakdown_trend: { month: string; count: number }[];
}
