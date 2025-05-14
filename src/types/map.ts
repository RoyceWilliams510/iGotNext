import { Game } from './game';

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
  game: Game;
}

// Component Props
export interface GameMapProps {
  games?: Game[];
  onGameSelect?: (gameId: string) => void;
  selectedGame?: Game | null;
  center?: { lat: number; lng: number };
  zoom?: number;
  mapStyle?: any[];
}

// Marker Styles
export interface MarkerStyle {
  path: google.maps.SymbolPath;
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
export interface InfoWindowContent {
  title: string;
  courtName: string;
  date: string;
  time: string;
  playerCount: number;
  playerLimit: number;
  skillLevel: string;
  gameType: string;
} 