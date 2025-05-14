export interface Court {
    id: string;
    name: string;
    address: string;
    amenities: string[];
    latitude: number;
    longitude: number;
    surfaceType: string;
    rating: number;
    imageUrl?: string;
  }