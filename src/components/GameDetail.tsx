import React, { useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Users, Star, Clock, Award, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Game } from "@/types/game";
import { Court } from "@/types/court";

interface Player {
  id: string;
  name: string;
  avatar?: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  position?: string;
}



interface GameDetailProps {
  game?: Game;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRSVP?: (gameId: string, attending: boolean) => void;
  court?: Court;
}

const GameDetail = ({
  game,
  open = true,
  onOpenChange,
  onRSVP,
  court,
}: GameDetailProps) => {
  // Mock data - in a real app, this would be fetched based on gameId
  const [isAttending, setIsAttending] = useState(false);

  console.log(game)


  const players: Player[] = [
    {
      id: "1",
      name: "Michael J.",
      skillLevel: "Advanced",
      position: "Guard",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: "2",
      name: "Sarah L.",
      skillLevel: "Intermediate",
      position: "Forward",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: "3",
      name: "David K.",
      skillLevel: "Intermediate",
      position: "Center",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "4",
      name: "Emma R.",
      skillLevel: "Beginner",
      position: "Guard",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    },
    {
      id: "5",
      name: "James T.",
      skillLevel: "Advanced",
      position: "Forward",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    },
    {
      id: "6",
      name: "Lisa M.",
      skillLevel: "Intermediate",
      position: "Guard",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    },
  ];

  const handleRSVP = () => {
    setIsAttending(!isAttending);
    if (onRSVP) {
      onRSVP(game.id, !isAttending);
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{game.title}</DialogTitle>
          <DialogDescription className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {format(game.date, "EEEE, MMMM d, yyyy • h:mm a")}
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-48 rounded-md overflow-hidden mb-4">
          <img
            src={court?.imageUrl 
            }
            alt={court.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h3 className="text-white font-semibold">{court.name}</h3>
            <p className="text-white/90 text-sm flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {game.location}
            </p>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="court">Court Info</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {game.playerCount}/
                  {game.playerLimit} Players
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Award className="w-3 h-3" /> {game.skillLevel}
                </Badge>
                <Badge variant="secondary">{game.gameType}</Badge>
              </div>

              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-600">{game.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Time</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(game.date, "h:mm a")} -{" "}
                  {format(
                    new Date(game.date.getTime() + 2 * 60 * 60 * 1000),
                    "h:mm a",
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="court" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Rating</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(court.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm">{court.rating}/5</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Surface</h4>
                <p className="text-sm text-gray-600">{court.surfaceType}</p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {court.amenities?.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Location</h4>
                <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
                  {/* Placeholder for map - would integrate Google Maps here */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <MapPin className="w-5 h-5 mr-2" /> Map View
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="players" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">
                  Current Players ({players.length}/{game.playerLimit})
                </h4>
              </div>

              <div className="space-y-2">
                {players.map((player) => (
                  <Card key={player.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={player.avatar} alt={player.name} />
                          <AvatarFallback>
                            {player.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium">{player.name}</p>
                          <div className="flex items-center gap-2">
                            {player.position && (
                              <span className="text-xs text-gray-500">
                                {player.position}
                              </span>
                            )}
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${getSkillLevelColor(player.skillLevel)}`}
                            >
                              {player.skillLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" className="gap-1" onClick={() => onOpenChange?.(false)}>
              <X className="h-4 w-4" /> Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleRSVP}
            variant={isAttending ? "destructive" : "default"}
            className="gap-1"
          >
            {isAttending ? "Cancel RSVP" : "RSVP to Game"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameDetail;
