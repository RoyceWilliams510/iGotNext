import { Game } from "@/types/game";

export const gameData: Game[] = [
    {
      id: "1",
      title: "Mission Bay Matchup",
      date: new Date(2024, 3, 15, 10, 0), // April 15, 2024, 10:00 AM
      time: "10:00 AM",
      location: "Mission Bay Courts",
      courtName: "Mission Bay Park Courts",
      courtType: "Outdoor",
      courtId: "mb001",
      latitude: 37.7725,
      longitude: -122.3875,
      playerCount: 6,
      playerLimit: 10,
      skillLevel: "Intermediate",
      gameType: "Casual",
      description: "Morning pickup game at Mission Bay. All skill levels welcome!"
    },
    {
      id: "2",
      title: "Sunset Showdown",
      date: new Date(2024, 3, 15, 17, 0), // April 15, 2024, 5:00 PM
      time: "5:00 PM",
      location: "Sunset Recreation Center",
      courtName: "Sunset Rec Courts",
      courtType: "Indoor",
      courtId: "sr001",
      latitude: 37.7516,
      longitude: -122.4935,
      playerCount: 8,
      playerLimit: 10,
      skillLevel: "Advanced",
      gameType: "Competitive",
      description: "Competitive full-court games. Advanced players only."
    },
    {
      id: "3",
      title: "Hayes Valley Hoops",
      date: new Date(2024, 3, 16, 12, 0), // April 16, 2024, 12:00 PM
      time: "12:00 PM",
      location: "Hayes Valley Playground",
      courtName: "Hayes Valley Courts",
      courtType: "Outdoor",
      courtId: "hv001",
      latitude: 37.7759,
      longitude: -122.4245,
      playerCount: 4,
      playerLimit: 8,
      skillLevel: "Beginner",
      gameType: "Casual",
      description: "Lunchtime pickup games. Beginners welcome!"
    },
    {
      id: "4",
      title: "Glen Park Tournament",
      date: new Date(2024, 3, 16, 14, 0), // April 16, 2024, 2:00 PM
      time: "2:00 PM",
      location: "Glen Park Recreation Center",
      courtName: "Glen Park Courts",
      courtType: "Indoor",
      courtId: "gp001",
      latitude: 37.7374,
      longitude: -122.4388,
      playerCount: 10,
      playerLimit: 15,
      skillLevel: "Intermediate",
      gameType: "Competitive",
      description: "Afternoon tournament style games. Teams welcome!"
    },
    {
      id: "5",
      title: "Potrero Hill Practice",
      date: new Date(2024, 3, 17, 9, 0), // April 17, 2024, 9:00 AM
      time: "9:00 AM",
      location: "Potrero Hill Recreation Center",
      courtName: "Potrero Hill Courts",
      courtType: "Outdoor",
      courtId: "ph001",
      latitude: 37.7544,
      longitude: -122.4004,
      playerCount: 3,
      playerLimit: 12,
      skillLevel: "Beginner",
      gameType: "Casual",
      description: "Morning shootaround and casual games. Perfect for beginners!"
    }
  ]