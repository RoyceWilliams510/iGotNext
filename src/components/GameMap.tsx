import React, { useState, useEffect } from "react";
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

interface Game {
  id: string;
  title: string;
  courtName: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  playerCount: number;
  playerLimit: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  gameType: "Casual" | "Competitive";
}

interface GameMapProps {
  games?: Game[];
  onGameSelect?: (gameId: string) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const GameMap: React.FC<GameMapProps> = ({
  games = mockGames,
  onGameSelect = () => {},
  center = { lat: 40.7128, lng: -74.006 }, // Default to NYC
  zoom = 12,
}) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null,
  );

  // Initialize map
  useEffect(() => {
    // Load Google Maps API script if not already loaded
    if (!window.google) {
      console.log(
        "Google Maps API not loaded. In a real app, you would load it here.",
      );
      setMapLoaded(true); // For demo purposes, pretend it's loaded
      return;
    }

    // Initialize map
    const mapElement = document.getElementById("game-map");
    if (mapElement && !map) {
      const newMap = new window.google.maps.Map(mapElement, {
        center,
        zoom,
        mapTypeId: "roadmap",
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
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
        ],
      });

      setMap(newMap);
      setInfoWindow(new google.maps.InfoWindow());
      setMapLoaded(true);
    }
  }, [center, zoom, map]);

  // Add markers for games
  useEffect(() => {
    if (!mapLoaded || !map || !infoWindow) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    // Add new markers
    const newMarkers = games.map((game) => {
      // Determine marker color based on skill level
      const markerColor =
        game.skillLevel === "Beginner"
          ? "green"
          : game.skillLevel === "Intermediate"
            ? "orange"
            : "red";

      const marker = new google.maps.Marker({
        position: { lat: game.latitude, lng: game.longitude },
        map,
        title: game.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 0.8,
          strokeWeight: 2,
          strokeColor: "#ffffff",
          scale: 10,
        },
        animation: google.maps.Animation.DROP,
      });

      // Add click listener to marker
      marker.addListener("click", () => {
        setSelectedGame(game);

        // Create info window content
        const content = `
          <div class="p-2">
            <h3 class="font-bold">${game.title}</h3>
            <p>${game.courtName}</p>
            <p>${game.date} at ${game.time}</p>
            <p>${game.playerCount}/${game.playerLimit} players</p>
            <p>${game.skillLevel} · ${game.gameType}</p>
          </div>
        `;

        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to markers if there are any
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach((marker) => bounds.extend(marker.getPosition()!));
      map.fitBounds(bounds);

      // Don't zoom in too far
      if (map.getZoom()! > 15) map.setZoom(15);
    }
  }, [games, map, mapLoaded, infoWindow]);

  const handleViewDetails = (gameId: string) => {
    if (onGameSelect) {
      onGameSelect(gameId);
    }
    // Close info window
    if (infoWindow) {
      infoWindow.close();
    }
  };

  return (
    <div className="w-full h-full bg-background rounded-lg border overflow-hidden">
      {/* Map Container */}
      <div id="game-map" className="w-full h-[500px] relative">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Game Info Panel (shows when a game is selected) */}
      {selectedGame && (
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
                <span>{selectedGame.date}</span>
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
                onClick={() => handleViewDetails(selectedGame.id)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-background/90 p-3 rounded-md shadow-md">
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
                <p className="text-xs">
                  Games for players with some experience
                </p>
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

// Mock data for development
const mockGames: Game[] = [
  {
    id: "1",
    title: "Sunday Morning Hoops",
    courtName: "Central Park Courts",
    latitude: 40.7812,
    longitude: -73.9665,
    date: "2023-07-09",
    time: "10:00 AM",
    playerCount: 6,
    playerLimit: 10,
    skillLevel: "Intermediate",
    gameType: "Casual",
  },
  {
    id: "2",
    title: "Competitive 3v3",
    courtName: "West 4th Street Courts",
    latitude: 40.7318,
    longitude: -74.0023,
    date: "2023-07-10",
    time: "6:00 PM",
    playerCount: 4,
    playerLimit: 6,
    skillLevel: "Advanced",
    gameType: "Competitive",
  },
  {
    id: "3",
    title: "Beginner Friendly Game",
    courtName: "Tompkins Square Park",
    latitude: 40.7268,
    longitude: -73.9816,
    date: "2023-07-11",
    time: "5:30 PM",
    playerCount: 3,
    playerLimit: 10,
    skillLevel: "Beginner",
    gameType: "Casual",
  },
  {
    id: "4",
    title: "Lunch Break Basketball",
    courtName: "Bryant Park Courts",
    latitude: 40.7536,
    longitude: -73.9832,
    date: "2023-07-12",
    time: "12:30 PM",
    playerCount: 8,
    playerLimit: 10,
    skillLevel: "Intermediate",
    gameType: "Casual",
  },
  {
    id: "5",
    title: "Pro Run",
    courtName: "Rucker Park",
    latitude: 40.8296,
    longitude: -73.9384,
    date: "2023-07-13",
    time: "7:00 PM",
    playerCount: 8,
    playerLimit: 10,
    skillLevel: "Advanced",
    gameType: "Competitive",
  },
];

export default GameMap;
