import React, { useState, useEffect } from "react";
import GameMap from "./GameMap";
import GameList from "./GameList";
import GameDetail from "./GameDetail";
import CreateGameForm, { GameFormData } from "./CreateGameForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, Plus, Calendar, User, LogOut } from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Game } from "@/types/game";
import { Court } from "@/types/court";
import { courtData } from "@/data/courts";
import { gameData} from "@/data/games";



export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
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
  const [games, setGames] = useState<Game[]>(gameData);
  const [courts, setCourts] = useState<Court[]>(courtData);

  const handleGameSelect = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    const court = courts.find(c => c.id === game?.courtId);
    if (game && court) {
      setSelectedCourt(court);
      setSelectedGame(game);
      setIsDetailOpen(true);
    }
  };

  const handleCreateGame = (gameData: GameFormData) => {
    const newGame: Game = {
      ...gameData,
      id: Math.random().toString(36).substr(2, 9),
      playerCount: 1,
      courtType: "Outdoor",
      latitude: 37.7749,
      longitude: -122.4194
    };
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
              court={selectedCourt}
              onOpenChange={setIsDetailOpen}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Game Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle className = "hidden"></DialogTitle>
          <CreateGameForm onSubmit={handleCreateGame} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
