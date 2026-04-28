export type Season = "spring" | "summer" | "autumn" | "winter";

export type GameStatus = "menu" | "playing" | "cutscene" | "paused";

export type EndingType = "cycle" | "knowing" | "leaving";

export interface Player {
  x: number;
  y: number;
  health: number;
  stamina: number;
}

export interface GameState {
  status: GameStatus;
  day: number;
  season: Season;
  timeOfDay: number;        // 0–1, where 0 = midnight, 0.5 = noon
  journalCompletion: number; // 0–100
  endingsSeen: EndingType[];
  player: Player;
}

export interface JournalEntry {
  id: string;
  category: "creature" | "plant" | "artefact" | "fragment";
  title: string;
  description: string;
  discovered: boolean;
  discoveredOnDay?: number;
}

export interface SaveData {
  gameState: GameState;
  journal: JournalEntry[];
  lastSaved: string; // ISO date string
}
