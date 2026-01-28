import axios from 'axios';

const MULTIPOTH_PUBLIC_API = 'https://multipothtech.ddns.net/api/multipoth/v1';

export interface PublicService {
  title: string;
  subTitle: string;
  icon: string;
  status: 'online' | 'offline' | 'maintenance';
  tags: string[];
}

export const multipothService = {
  getPublicServices: async (): Promise<PublicService[]> => {
    const response = await axios.get(`${MULTIPOTH_PUBLIC_API}/services`);
    return response.data;
  }
};
