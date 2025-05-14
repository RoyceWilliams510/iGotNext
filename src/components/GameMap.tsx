import React, { useState, useCallback, useMemo, useRef } from "react";
import { MapPin, Users, Calendar, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
import { Map, Marker, InfoWindow, useMapsLibrary } from '@vis.gl/react-google-maps';
import { 
  GameMapProps, 
  MapPosition, 
  MapOptions, 
  MarkerStyle,
  InfoWindowContent 
} from '@/types/map';
import { Game } from '@/types/game';
import { format } from "date-fns";

// San Francisco coordinates
const SF_COORDINATES = { lat: 37.7749, lng: -122.4194 };

// Map component wrapper that captures the map instance
// const MapWithRef: React.FC<{
//   children: React.ReactNode;
//   onMapReady: (map: google.maps.Map) => void;
//   mapOptions: MapOptions;
// }> = ({ children, onMapReady, mapOptions }) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapsLibrary = useMapsLibrary('maps');
  
//   // Initialize map
//   React.useEffect(() => {
//     if (!mapRef.current || !mapsLibrary) return;
    
//     const map = new mapsLibrary.Map(mapRef.current, mapOptions);
//     onMapReady(map);
    
//     // Clean up on unmount
//     return () => {
//       // The vis.gl library doesn't have a clear method to destroy the map
//       // This can be revisited if there's a better cleanup approach
//     };
//   }, [mapsLibrary, mapOptions, onMapReady]);
  
//   return (
//     <div ref={mapRef} style={{ width: '100%', height: '100%' }}>
//       {mapsLibrary && children}
//     </div>
//   );
// };

const GameMap: React.FC<GameMapProps> = ({
  games = [],
  onGameSelect = () => {},
  center = SF_COORDINATES, // Default to San Francisco
  zoom = 12,
  mapStyle = [],
}) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
   
  // Function to handle map reference
  const handleMapReady = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

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
    scrollwheel: true, // Enable mouse wheel zoom
    gestureHandling: 'greedy', // Make the map fully interactive
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
  const getMarkerStyle = useCallback((skillLevel: string): MarkerStyle => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: skillLevel === "Beginner" ? "green" : 
               skillLevel === "Intermediate" ? "orange" : "red",
    fillOpacity: 0.8,
    strokeWeight: 2,
    strokeColor: "#ffffff",
    scale: 10,
  }), []);

  // Handle marker click
  const handleMarkerClick = (game: Game) => {
    setSelectedGame(game);
    setInfoWindowOpen(true);
     
    // Center map on selected game
    if (map) {
      map.panTo({ lat: game.latitude, lng: game.longitude });
      map.setZoom(15); // Zoom in to see the location better
    }
  };

  // Handle view details
  const handleViewDetails = (game: Game) => {
    onGameSelect(game.id);
    setSelectedGame(game)
    console.log(game)
    setInfoWindowOpen(false);
  };

  // Function to fit bounds to markers
  const fitBoundsToMarkers = useCallback(() => {
    if (map && games.length > 0) {
      const bounds = new google.maps.LatLngBounds();
       
      games.forEach(game => {
        bounds.extend({ lat: game.latitude, lng: game.longitude });
      });
       
      map.fitBounds(bounds);
       
      // Don't zoom in too far
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined && currentZoom > 15) {
        map.setZoom(15);
      }
    }
  }, [games, map]);

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
          streetViewControl={true}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
          onClick={() => setInfoWindowOpen(false)}
        >
          {games.map((game) => (
            <Marker
              key={game.id}
              position={{ lat: game.latitude, lng: game.longitude }}
              onClick={() => handleMarkerClick(game)}
              icon={getMarkerStyle(game.skillLevel)}
            />
          ))}

          {selectedGame && infoWindowOpen && (
            <InfoWindow
              position={{ lat: selectedGame.latitude, lng: selectedGame.longitude }}
              onCloseClick={() => setInfoWindowOpen(false)}
            >
              <div 
                role="dialog"
                aria-labelledby="game-title"
                aria-describedby="game-details"
                className="p-2"
              >
                <h3 id="game-title" className="font-bold">{selectedGame.title}</h3>
                <div id="game-details">
                  <p>{selectedGame.courtName}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(selectedGame.date, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                    <span>{selectedGame.time}</span>
                  </div>
                  <p>{selectedGame.playerCount}/{selectedGame.playerLimit} players</p>
                  <p>{selectedGame.skillLevel} · {selectedGame.gameType}</p>
                </div>
                <Button
                  className="w-full mt-2"
                  onClick={() => handleViewDetails(selectedGame)}
                  aria-label={`View details for ${selectedGame.title}`}
                >
                  View Details
                </Button>
              </div>
            </InfoWindow>
          )}
        </Map>
         
        {/* Custom map controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            onClick={fitBoundsToMarkers}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M9 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3"></path>
              <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"></path>
              <path d="M5 12h14"></path>
            </svg>
          </Button>
        </div>
      </div>

      {/* Game Info Panel (shows when a game is selected) */}
      {/* {selectedGame && (
        <Card className="absolute bottom-4 left-4 w-72 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{selectedGame.title}</h3>
                <Badge
                  variant={
                    selectedGame.gameType === "Competitive"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {selectedGame.gameType}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{selectedGame.courtName}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(selectedGame.date, "MMM d, yyyy")}</span>
                <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                <span>{selectedGame.time}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedGame.playerCount}/{selectedGame.playerLimit} players
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span>Skill Level: {selectedGame.skillLevel}</span>
              </div>

              <Button
                className="w-full mt-2"
                onClick={() => handleViewDetails(selectedGame)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Map Legend */}
      <div className="absolute top-30 right-4 bg-background/90 p-3 rounded-md shadow-md z-10">
        <h4 className="text-sm font-medium mb-2">Skill Levels</h4>
        <div className="flex flex-col gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Beginner</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Games for players new to basketball</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-xs">Intermediate</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Games for players with some experience</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">Advanced</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Games for experienced players</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};



export default GameMap;
