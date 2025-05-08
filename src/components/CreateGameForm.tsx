import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface CreateGameFormProps {
  onSubmit?: (gameData: GameFormData) => void;
}

interface GameFormData {
  title: string;
  description: string;
  location: string;
  date: Date | undefined;
  time: string;
  playerLimit: number;
  gameType: string;
  skillLevel: string;
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({
  onSubmit = () => {},
}) => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<GameFormData>({
    title: "",
    description: "",
    location: "",
    date: undefined,
    time: "",
    playerLimit: 10,
    gameType: "casual",
    skillLevel: "all",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setFormData((prev) => ({ ...prev, date: newDate }));
  };

  const handlePlayerLimitChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, playerLimit: value[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create a Pickup Game
        </CardTitle>
        <CardDescription>
          Fill out the details to organize a new basketball game
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Game Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Saturday Morning Hoops"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Details about your game..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" /> Court Location
              </Label>
              <div className="flex flex-col space-y-2">
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter court name or address"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                <div className="h-40 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Map will appear here</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Time
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerLimit" className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" /> Player Limit:{" "}
                {formData.playerLimit}
              </Label>
              <Slider
                defaultValue={[10]}
                max={30}
                min={2}
                step={1}
                onValueChange={handlePlayerLimitChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gameType">Game Type</Label>
                <Select
                  value={formData.gameType}
                  onValueChange={(value) =>
                    handleSelectChange("gameType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select game type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="competitive">Competitive</SelectItem>
                    <SelectItem value="training">Training/Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Skill Level</Label>
                <Select
                  value={formData.skillLevel}
                  onValueChange={(value) =>
                    handleSelectChange("skillLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <CardFooter className="px-0 pt-6 flex justify-end space-x-2">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">Create Game</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGameForm;
