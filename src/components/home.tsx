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

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
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

  // State for games and courts
  const [games, setGames] = useState<Game[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch games and courts from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch courts
        const { data: courtsData, error: courtsError } = await supabase
          .from('courts')
          .select('*');

        if (courtsError) throw new Error('Error fetching courts: ' + courtsError.message);

        // Fetch games
        const { data: gamesData, error: gamesError } = await supabase
          .from('games')
          .select('*');

        if (gamesError) throw new Error('Error fetching games: ' + gamesError.message);

        // Convert date strings to Date objects for games
        const processedGames = gamesData.map(game => ({
          ...game,
          date: new Date(game.date)
        }));

        setCourts(courtsData);
        setGames(processedGames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleGameSelect = (gameId: string) => {
    console.log(games)
    const game = games.find(g => g.id === gameId);
    const court = courts.find(c => c.id === game?.courtId);
    if (game && court) {
      setSelectedCourt(court);
      setSelectedGame(game);
      setIsDetailOpen(true);
    }
  };

  const handleCreateGame = async (gameData: GameFormData) => {
    // try {
    //   const selectedCourt = courts.find(c => c.id === gameData.courtId);
    //   if (!selectedCourt) throw new Error('Court not found');

    //   const newGame: Omit<Game, 'id'> = {
    //     ...gameData,
    //     playerCount: 1,
    //     latitude: selectedCourt.latitude,
    //     longitude: selectedCourt.longitude,
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    //     creator_id: user?.id
    //   };

    //   const { data, error } = await supabase
    //     .from('games')
    //     .insert([newGame])
    //     .select()
    //     .single();

    //   if (error) throw error;

    //   // Add the new game to the state
    //   setGames(prevGames => [...prevGames, { ...data, date: new Date(data.date) }]);
    //   setIsCreateOpen(false);
    // } catch (err) {
    //   console.error('Error creating game:', err);
    //   // You might want to show an error message to the user here
    // }
    return;
  };

  const handleJoinGame = async (gameId: string) => {
    try {
      const gameToUpdate = games.find(g => g.id === gameId);
      if (!gameToUpdate || gameToUpdate.playerCount >= gameToUpdate.playerLimit) return;

      const { data, error } = await supabase
        .from('games')
        .update({ playerCount: gameToUpdate.playerCount + 1 })
        .eq('id', gameId)
        .select()
        .single();

      if (error) throw error;

      // Update the game in state
      setGames(prevGames =>
        prevGames.map(game =>
          game.id === gameId ? { ...data, date: new Date(data.date) } : game
        )
      );
      setIsDetailOpen(false);
    } catch (err) {
      console.error('Error joining game:', err);
      // You might want to show an error message to the user here
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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
              <GameList
                games={games.filter(game => game.creator_id === user?.id)}
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
              court={selectedCourt}
              onJoin={() => handleJoinGame(selectedGame.id)}
              onOpenChange={setIsDetailOpen}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Game Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogTitle className="hidden"></DialogTitle>
          <CreateGameForm onSubmit={handleCreateGame} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
