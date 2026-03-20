export * from './map';

export interface NewsItem {
  source: string;
  title: string;
  link: string;
  pubDate: Date;
  isAlert: boolean;
  monitorColor?: string;
  tier?: number;
  lat?: number;
  long?: number;
  locationName?: string;
}

export interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lon: number;
  keywords: string[];
  subtext?: string;
  location?: string;
  level?: 'low' | 'elevated' | 'high';
  description?: string;
  status?: string;
}

// Add more types as needed during porting
