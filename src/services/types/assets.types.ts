export type AssetStatus = 'RUNNING' | 'MAINTENANCE' | 'BREAKDOWN' | 'IDLE';

export interface Asset {
  id: string;
  serial_number: string;
  name: string;
  model: string;
  status: AssetStatus;
  health_score: number;
  team_id?: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  location: string;
  stock_quantity: number;
  min_stock_level: number;
  price: number;
}

export interface Tool {
  id: string;
  name: string;
  brand: string;
  condition: 'GOOD' | 'FAIR' | 'POOR';
  status: 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE';
}

export interface CreateAssetData {
  name: string;
  serial_number: string;
  model: string;
  status?: AssetStatus;
  health_score?: number;
}

export interface CreateInventoryData {
  name: string;
  sku: string;
  category: string;
  location: string;
  stock_quantity: number;
  min_stock_level: number;
  price: number;
}
