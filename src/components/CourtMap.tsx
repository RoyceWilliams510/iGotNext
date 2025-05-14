import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { MapPin, Users, Calendar, Clock, Star, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
import { Map, Marker, InfoWindow, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { 
  CourtMapProps, 
  MapPosition, 
  MapOptions, 
  MarkerStyle,
  CourtInfoWindowContent 
} from '@/types/map';
import { Game } from '@/types/game';
import { Court } from '@/types/court';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// San Francisco coordinates
const SF_COORDINATES = { lat: 37.7749, lng: -122.4194 };

// Custom basketball court SVG marker path
const COURT_MARKER_PATH = "M-2,-2 h4 v4 h-4 z M-1.5,-1.5 h3 v3 h-3 z";


const CourtMap: React.FC<CourtMapProps> = ({
  courts = [],
  games = [],
  onCourtSelect = () => {},
  center = SF_COORDINATES,
  zoom = 12,
  mapStyle = [],
}) => {
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [hoveredCourt, setHoveredCourt] = useState<Court | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  // const [map, setMap] = useState<google.maps.Map | null>();
  const map = useMap();
   
  // Add useEffect to track selectedCourt changes
  useEffect(() => {
    if (selectedCourt) {
      console.log('Selected Court Updated:', selectedCourt);
      console.log('Court Coordinates:', { lat: selectedCourt.latitude, lng: selectedCourt.longitude });
    }
  }, [selectedCourt]);

  // Add useEffect to track map initialization
  useEffect(() => {
    console.log('Map Object:', map);
  }, [map]);

  // Get games for a specific court
  const getCourtGames = useCallback((courtId: string) => {
    return games.filter(game => game.courtId === courtId);
  }, [games]);

  // Memoize map options with optimized controls for user interaction
  const mapOptions = useMemo<MapOptions>(() => ({
    center,
    zoom,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    scrollwheel: true,
    gestureHandling: 'greedy',
    styles: [
      {
        featureType: "poi.sports_complex",
        elementType: "geometry",
        stylers: [{ color: "#c7e9c0" }],
      },
      {
        featureType: "poi.sports_complex",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
      ...mapStyle,
    ],
  }), [center, zoom, mapStyle]);

  // Memoize marker style
  const getMarkerStyle = useCallback((court: Court): MarkerStyle => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#ef4444", // Red color
    fillOpacity: court.id === selectedCourt?.id ? 1 : 0.8,
    strokeWeight: 2,
    strokeColor: "#ffffff",
    scale: 15, // Increased size
  }), [selectedCourt]);

  // Handle marker click
  const handleMarkerClick = (court: Court) => {
    console.log('Marker Clicked:', court);
    setSelectedCourt(court);
    setInfoWindowOpen(true);
    if (map) {
      console.log('Panning to:', { lat: court.latitude, lng: court.longitude });
      map.panTo({ lat: court.latitude, lng: court.longitude });
      map.setZoom(15);
    } else {
      console.log('Map not initialized');
    }
  };

  // Handle marker hover
  const handleMarkerMouseOver = (court: Court) => {
    setHoveredCourt(court);
  };

  const handleMarkerMouseOut = () => {
    setHoveredCourt(null);
  };

  // Handle view details
  const handleViewDetails = (court: Court) => {
    onCourtSelect(court.id);
    setInfoWindowOpen(false);
  };

  return (
    <div className="w-full h-full bg-background rounded-lg border overflow-hidden">
      {/* Map Container */}
      <div className="w-full h-[500px] relative">
        <Map
          mapId="basketball-map"
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={true}
          fullscreenControl={true}
          streetViewControl={false}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
          onClick={() => {
            setInfoWindowOpen(false);
            setSelectedCourt(null);
          }}
        >
          {courts.map((court) => (
            <Marker
              key={court.id}
              position={{ lat: court.latitude, lng: court.longitude }}
              onClick={() => handleMarkerClick(court)}
              onMouseOver={() => handleMarkerMouseOver(court)}
              onMouseOut={handleMarkerMouseOut}
              icon={getMarkerStyle(court)}
            />
          ))}

          {selectedCourt && infoWindowOpen && (
            <InfoWindow
              position={{ lat: selectedCourt.latitude, lng: selectedCourt.longitude }}
              onCloseClick={() => setInfoWindowOpen(false)}
            >
              <div 
                role="dialog"
                aria-labelledby="court-name"
                aria-describedby="court-details"
                className="p-4 max-w-xs bg-white rounded-lg shadow-sm"
              >
                {selectedCourt.imageUrl && (
                  <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden group">
                    <img 
                      src={selectedCourt.imageUrl} 
                      alt={selectedCourt.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <h3 
                  id="court-name" 
                  className="text-lg font-bold mb-2 text-primary"
                >
                  {selectedCourt.name}
                </h3>
                <div id="court-details" className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="flex-1">{selectedCourt.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      {/* <span className="text-sm font-medium">{selectedCourt.rating?.toFixed(1)}</span> */}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {selectedCourt.surfaceType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{getCourtGames(selectedCourt.id).length} upcoming games</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedCourt.amenities?.map((amenity, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs bg-muted/50"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full mt-4 transition-colors"
                  onClick={() => handleViewDetails(selectedCourt)}
                  aria-label={`View details for ${selectedCourt.name}`}
                >
                  View Court Details
                </Button>
              </div>
            </InfoWindow>
          )}
        </Map>
         
        {/* Map Legend */}
        <div className="absolute top-4 right-4 bg-background/95 p-3 rounded-lg shadow-md z-10 backdrop-blur-sm border">
          <h4 className="text-sm font-medium mb-2">Map Legend</h4>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
            <span className="text-xs">Basketball Court</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtMap;
