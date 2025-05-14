export interface Game {
  id: string;
  title: string;
  courtName: string;
  courtType: "Indoor" | "Outdoor";
  latitude: number;
  longitude: number;
  date: Date;
  creator_id?: string;
  location: string;
  time: string;
  playerCount: number;
  playerLimit: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  gameType: "Casual" | "Competitive";
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  courtId?: string;
} 