import { Game } from './game';
import { Court } from './court';

// Map-related types
export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  position: MapPosition;
  title: string;
  color: string;
  court: Court;
  games: Game[];
}

// Component Props
export interface CourtMapProps {
  courts?: Court[];
  games?: Game[];
  onCourtSelect?: (courtId: string) => void;
  selectedCourt?: Court | null;
  center?: { lat: number; lng: number };
  zoom?: number;
  mapStyle?: any[];
}

// Marker Styles
export interface MarkerStyle {
  path: google.maps.SymbolPath | string;
  fillColor: string;
  fillOpacity: number;
  strokeWeight: number;
  strokeColor: string;
  scale: number;
}

// Map Options
export interface MapOptions {
  center: MapPosition;
  zoom: number;
  mapTypeId: google.maps.MapTypeId;
  mapTypeControl: boolean;
  fullscreenControl: boolean;
  streetViewControl: boolean;
  zoomControl: boolean;
  zoomControlOptions?: {
    position: google.maps.ControlPosition;
  };
  styles?: google.maps.MapTypeStyle[];
}

// Info Window Content
export interface CourtInfoWindowContent {
  name: string;
  address: string;
  rating: number;
  surfaceType: string;
  gamesCount: number;
  amenities: string[];
  imageUrl?: string;
} 