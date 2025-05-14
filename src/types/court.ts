export interface Court {
    id: string;
    name: string;
    address: string;
    amenities: string[];
    latitude: number;
    longitude: number;
    surfaceType: string;
    rating?: number | 0;
    imageUrl?: string;
  }