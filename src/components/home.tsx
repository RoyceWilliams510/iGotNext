import React, { useState, useEffect } from "react";
import GameMap from "./GameMap";
import GameList from "./GameList";
import GameDetail from "./GameDetail";
import CreateGameForm from "./CreateGameForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, Plus, Calendar, User, LogOut } from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface Game {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  court: string;
  playerCount: number;
  playerLimit: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  gameType: "Casual" | "Competitive";
  position: { lat: number; lng: number };
}

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");
  const [filters, setFilters] = useState({
    date: null,
    skillLevel: "",
    gameType: "",
  });

  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch games from Supabase when component mounts
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  // Mock data for games
  // We'll keep the mock data for now, but in a real app we would fetch from Supabase
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      title: "Saturday Morning Pickup",
      date: new Date(2023, 5, 15),
      time: "10:00 AM",
      location: "Central Park Courts",
      court: "Court 3",
      playerCount: 6,
      playerLimit: 10,
      skillLevel: "Intermediate",
      gameType: "Casual",
      position: { lat: 40.785091, lng: -73.968285 },
    },
    {
      id: "2",
      title: "Competitive 3v3",
      date: new Date(2023, 5, 16),
      time: "6:00 PM",
      location: "Brooklyn Bridge Park",
      court: "Main Court",
      playerCount: 4,
      playerLimit: 6,
      skillLevel: "Advanced",
      gameType: "Competitive",
      position: { lat: 40.7021, lng: -73.99659 },
    },
    {
      id: "3",
      title: "Beginner Friendly Game",
      date: new Date(2023, 5, 17),
      time: "4:00 PM",
      location: "Riverside Park Courts",
      court: "North Court",
      playerCount: 3,
      playerLimit: 10,
      skillLevel: "Beginner",
      gameType: "Casual",
      position: { lat: 40.801138, lng: -73.972088 },
    },
  ]);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setIsDetailOpen(true);
  };

  const handleCreateGame = (newGame: Game) => {
    setGames([...games, newGame]);
    setIsCreateOpen(false);
  };

  const handleJoinGame = (gameId: string) => {
    setGames(
      games.map((game) => {
        if (game.id === gameId && game.playerCount < game.playerLimit) {
          return { ...game, playerCount: game.playerCount + 1 };
        }
        return game;
      }),
    );
    setIsDetailOpen(false);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Pickup Basketball Finder</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setActiveTab("my-games")}>
              <Calendar className="mr-2 h-4 w-4" />
              My Games
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Game
            </Button>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={
                    profile?.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
                  }
                  alt={profile?.full_name || "User"}
                />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <GameMap
              games={games}
              onGameSelect={handleGameSelect}
              selectedGame={selectedGame}
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Nearby Games</h2>
              <GameList
                games={games}
                onGameSelect={handleGameSelect}
                onFilterChange={handleFilterChange}
                compact={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="list">
            <GameList
              games={games}
              onGameSelect={handleGameSelect}
              onFilterChange={handleFilterChange}
              compact={false}
            />
          </TabsContent>

          <TabsContent value="my-games">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">My Games</h2>
              <p className="text-muted-foreground">
                Games you've joined or created will appear here.
              </p>
              {/* This would be filtered to show only the user's games */}
              <GameList
                games={games.slice(0, 1)}
                onGameSelect={handleGameSelect}
                onFilterChange={handleFilterChange}
                compact={false}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Game Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedGame && (
            <GameDetail
              game={selectedGame}
              onJoin={() => handleJoinGame(selectedGame.id)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Game Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <CreateGameForm onSubmit={handleCreateGame} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
