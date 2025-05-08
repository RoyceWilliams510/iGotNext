import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Game {
  id: string;
  title: string;
  date: Date;
  location: string;
  playerCount: number;
  playerLimit: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  gameType: "Casual" | "Competitive";
  courtType: string;
}

interface GameListProps {
  games?: Game[];
  onGameSelect?: (game: Game) => void;
}

const GameList = ({
  games = defaultGames,
  onGameSelect = () => {},
}: GameListProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [gameType, setGameType] = useState<string>("");

  // Filter games based on selected filters
  const filteredGames = games.filter((game) => {
    // Filter by date if selected
    if (date && !isSameDay(game.date, date)) return false;

    // Filter by skill level if selected
    if (skillLevel && skillLevel !== "all" && game.skillLevel !== skillLevel)
      return false;

    // Filter by game type if selected
    if (gameType && gameType !== "all" && game.gameType !== gameType)
      return false;

    return true;
  });

  // Helper function to check if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return (
    <div className="w-full bg-background p-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Available Games</CardTitle>
            <div className="flex flex-wrap gap-2">
              {/* Date Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Skill Level Filter */}
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              {/* Game Type Filter */}
              <Select value={gameType} onValueChange={setGameType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Game Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Competitive">Competitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <GameListItem
                    key={game.id}
                    game={game}
                    onSelect={() => onGameSelect(game)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No games found matching your filters.
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <GameGridItem
                    key={game.id}
                    game={game}
                    onSelect={() => onGameSelect(game)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground col-span-full">
                  No games found matching your filters.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface GameItemProps {
  game: Game;
  onSelect: () => void;
}

const GameListItem = ({ game, onSelect }: GameItemProps) => {
  return (
    <div
      className="border rounded-lg p-4 hover:bg-accent/10 cursor-pointer transition-colors flex flex-col sm:flex-row justify-between gap-4"
      onClick={onSelect}
    >
      <div className="flex-1">
        <h3 className="font-medium text-lg">{game.title}</h3>
        <p className="text-muted-foreground">{game.location}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={game.gameType === "Casual" ? "secondary" : "default"}>
            {game.gameType}
          </Badge>
          <Badge variant="outline">{game.skillLevel}</Badge>
          <Badge variant="outline">{game.courtType}</Badge>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="text-right">
          <p className="font-medium">{format(game.date, "E, MMM d")}</p>
          <p className="text-sm text-muted-foreground">
            {format(game.date, "h:mm a")}
          </p>
        </div>
        <div className="mt-2 text-right">
          <p className="text-sm">
            <span className="font-medium">{game.playerCount}</span>
            <span className="text-muted-foreground">
              /{game.playerLimit} players
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const GameGridItem = ({ game, onSelect }: GameItemProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{game.title}</h3>
          <Badge variant={game.gameType === "Casual" ? "secondary" : "default"}>
            {game.gameType}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-3">{game.location}</p>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-medium">{format(game.date, "E, MMM d")}</p>
            <p className="text-sm text-muted-foreground">
              {format(game.date, "h:mm a")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              <span className="font-medium">{game.playerCount}</span>
              <span className="text-muted-foreground">
                /{game.playerLimit} players
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{game.skillLevel}</Badge>
          <Badge variant="outline">{game.courtType}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample data for development and testing
const defaultGames: Game[] = [
  {
    id: "1",
    title: "Weekend Pickup Game",
    date: new Date(Date.now() + 86400000), // Tomorrow
    location: "Central Park Courts",
    playerCount: 8,
    playerLimit: 10,
    skillLevel: "Intermediate",
    gameType: "Casual",
    courtType: "Outdoor",
  },
  {
    id: "2",
    title: "Competitive 3v3",
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    location: "Brooklyn YMCA",
    playerCount: 5,
    playerLimit: 6,
    skillLevel: "Advanced",
    gameType: "Competitive",
    courtType: "Indoor",
  },
  {
    id: "3",
    title: "Beginners Welcome",
    date: new Date(Date.now() + 259200000), // 3 days from now
    location: "Queens Community Center",
    playerCount: 6,
    playerLimit: 12,
    skillLevel: "Beginner",
    gameType: "Casual",
    courtType: "Indoor",
  },
  {
    id: "4",
    title: "Lunchtime Hoops",
    date: new Date(Date.now() + 86400000), // Tomorrow
    location: "Downtown Rec Center",
    playerCount: 7,
    playerLimit: 10,
    skillLevel: "Intermediate",
    gameType: "Casual",
    courtType: "Indoor",
  },
  {
    id: "5",
    title: "Evening Shootaround",
    date: new Date(Date.now() + 172800000), // Day after tomorrow
    location: "Riverside Courts",
    playerCount: 4,
    playerLimit: 8,
    skillLevel: "Advanced",
    gameType: "Competitive",
    courtType: "Outdoor",
  },
];

export default GameList;
