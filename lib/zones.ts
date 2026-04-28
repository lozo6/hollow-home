// lib/zones.ts
export type ZoneId =
  | "clearing"
  | "shallow_wood"
  | "canopy_path"
  | "fernmere"
  | "old_orchard"
  | "deepwood"
  | "stone_ring"
  | "well";

export interface Zone {
  id: ZoneId;
  name: string;
  description: string;
  unlockCondition: string; // Human readable — actual logic checked in game
  unlocked: boolean;
}

export const ZONES: Zone[] = [
  {
    id: "clearing",
    name: "The Clearing",
    description: "Homestead and immediate garden. Where you woke up.",
    unlockCondition: "default",
    unlocked: true,
  },
  {
    id: "shallow_wood",
    name: "The Shallow Wood",
    description: "Dense but friendly forest. Most common resources.",
    unlockCondition: "default",
    unlocked: true,
  },
  {
    id: "canopy_path",
    name: "The Canopy Path",
    description: "Elevated route through treetops. Rare insects.",
    unlockCondition: "Restore the upper floor of the homestead",
    unlocked: false,
  },
  {
    id: "fernmere",
    name: "The Fernmere",
    description: "Boggy wetland. Unusual plants. Moody atmosphere.",
    unlockCondition: "Build your first water channel",
    unlocked: false,
  },
  {
    id: "old_orchard",
    name: "The Old Orchard",
    description: "Overgrown fruit trees. Signs of a previous garden.",
    unlockCondition: "Reach 25% journal completion",
    unlocked: false,
  },
  {
    id: "deepwood",
    name: "The Deepwood",
    description: "Dark, ancient forest. Echoes are frequent here.",
    unlockCondition: "Reach 50% journal completion",
    unlocked: false,
  },
  {
    id: "stone_ring",
    name: "The Stone Ring",
    description: "A clearing with old standing stones. No creatures come here.",
    unlockCondition: "Reach 75% journal completion",
    unlocked: false,
  },
  {
    id: "well",
    name: "The Well",
    description: "The sealed structure at the heart of the forest.",
    unlockCondition: "Reach 100% journal completion or find it by exploration",
    unlocked: false,
  },
];
