"use client";

import { useState, useCallback } from "react";
import type { GameState, JournalEntry } from "@/types/game";
import { saveGame, loadGame } from "@/lib/save";

const DEFAULT_STATE: GameState = {
  status: "menu",
  day: 1,
  season: "spring",
  timeOfDay: 0.5,
  journalCompletion: 0,
  endingsSeen: [],
  unlockedZones: ["clearing", "shallow_wood"],
  player: {
    x: 0,
    y: 0,
    health: 100,
    stamina: 100,
  },
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE);
  const [journal, setJournal] = useState<JournalEntry[]>([]);

  const startNewGame = useCallback(() => {
    setGameState({ ...DEFAULT_STATE, status: "playing" });
    setJournal([]);
  }, []);

  const loadSave = useCallback(() => {
    const save = loadGame();
    if (!save) return false;
    setGameState(save.gameState);
    setJournal(save.journal);
    return true;
  }, []);

  const save = useCallback(() => {
    saveGame(gameState, journal);
  }, [gameState, journal]);

  const advanceDay = useCallback(() => {
    setGameState((prev) => {
      const newDay = prev.day + 1;
      const seasonIndex = Math.floor((newDay - 1) / 28) % 4;
      const seasons = ["spring", "summer", "autumn", "winter"] as const;
      return {
        ...prev,
        day: newDay,
        season: seasons[seasonIndex],
      };
    });
  }, []);

  return {
    gameState,
    journal,
    startNewGame,
    loadSave,
    save,
    advanceDay,
    setGameState,
    setJournal,
  };
}
