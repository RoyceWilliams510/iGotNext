import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Game } from '../types/game';

interface GameContextType {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  selectedGame: Game | null;
  setSelectedGame: React.Dispatch<React.SetStateAction<Game | null>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <GameContext.Provider value={{ games, setGames, selectedGame, setSelectedGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 