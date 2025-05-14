import React from "react";
import { format } from "date-fns";
import { MapPin, Star, Users, Clock, Award, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Game } from "@/types/game";
import { Court } from "@/types/court";

interface CourtDetailProps {
  court: Court;
  games: Game[];
  onGameSelect: (gameId: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CourtDetail: React.FC<CourtDetailProps> = ({
  court,
  games,
  onGameSelect,
  open = true,
  onOpenChange,
}) => {
    court.rating = 5.0;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="relative w-full h-48 -mt-6 -mx-6 mb-4">
          <img
            src={court.imageUrl || "https://placehold.co/800x400"}
            alt={court.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl font-bold text-white mb-2">{court.name}</h2>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" />
              <span>{court.address}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Court Info</TabsTrigger>
            <TabsTrigger value="games">Games ({games.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            {/* Rating and Surface Type */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(court.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{court.rating.toFixed(1)}</span>
              </div>
              <Badge variant="secondary">{court.surfaceType}</Badge>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {court.amenities?.map((amenity, index) => (
                  <Badge key={index} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Surface Details</h4>
                  <p className="text-sm text-muted-foreground">
                    {court.surfaceType} court with professional-grade flooring.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Operating Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Open daily from 6:00 AM to 10:00 PM
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Photo Gallery */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                <img
                  src={court.imageUrl || "https://placehold.co/300x300"}
                  alt={court.name}
                  className="w-full h-24 object-cover rounded-md"
                />
                {/* Add more photos here */}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="games" className="mt-4">
            <div className="space-y-4">
              {games.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming games at this court.</p>
                  <Button className="mt-4" onClick={() => onOpenChange?.(false)}>
                    Create a Game
                  </Button>
                </div>
              ) : (
                games.map((game) => (
                  <Card key={game.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{game.title}</h3>
                        <Badge
                          variant={
                            game.gameType === "Competitive"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {game.gameType}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(game.date, "MMM d, yyyy")} at {game.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {game.playerCount}/{game.playerLimit} players
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>{game.skillLevel}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-3"
                        onClick={() => onGameSelect(game.id)}
                      >
                        View Game Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="gap-1">
              <X className="h-4 w-4" /> Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourtDetail; 