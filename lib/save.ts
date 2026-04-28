import type { SaveData, GameState, JournalEntry } from "@/types/game";

const SAVE_KEY = "hollow-home-save";

export function saveGame(state: GameState, journal: JournalEntry[]): void {
  const saveData: SaveData = {
    gameState: state,
    journal,
    lastSaved: new Date().toISOString(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

export function loadGame(): SaveData | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveData;
  } catch {
    console.error("Failed to parse save data");
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function exportSave(): void {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  const blob = new Blob([raw], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hollow-home-save.json";
  a.click();
  URL.revokeObjectURL(url);
}
