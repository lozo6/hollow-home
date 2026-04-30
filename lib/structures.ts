import type { Structure, StructureId } from "@/types/game";
import type { InventoryItem } from "@/components/game/Inventory";

export interface StructureDefinition {
  id: StructureId;
  name: string;
  icon: string;
  description: string;
  col: number; // Where it gets placed on the map
  row: number;
  cost: { itemId: string; amount: number }[];
  unlocks: string; // Flavour text for what it enables
}

export const STRUCTURE_DEFINITIONS: StructureDefinition[] = [
  {
    id: "bed",
    name: "Bed",
    icon: "🛏️",
    description:
      "A simple bed made from wood and fibre. Sleep to end the day and save your progress.",
    col: 25,
    row: 24,
    cost: [
      { itemId: "plank", amount: 3 },
      { itemId: "fibre_rope", amount: 2 },
    ],
    unlocks: "Sleep mechanic — advance the day and autosave",
  },
  {
    id: "storage_chest",
    name: "Storage Chest",
    icon: "📦",
    description: "A sturdy chest to store your gathered resources.",
    col: 27,
    row: 24,
    cost: [
      { itemId: "plank", amount: 4 },
      { itemId: "stone_block", amount: 1 },
    ],
    unlocks: "Extended storage — 40 extra inventory slots",
  },
  {
    id: "garden_plot",
    name: "Garden Plot",
    icon: "🌱",
    description: "A cleared patch of earth, ready for planting seeds.",
    col: 23,
    row: 27,
    cost: [
      { itemId: "plank", amount: 2 },
      { itemId: "fibre_rope", amount: 1 },
    ],
    unlocks: "Planting system — grow crops across seasons",
  },
];

export function getStructureDef(id: StructureId): StructureDefinition {
  return STRUCTURE_DEFINITIONS.find((s) => s.id === id)!;
}

export function canBuild(
  def: StructureDefinition,
  inventory: InventoryItem[],
): boolean {
  return def.cost.every((cost) => {
    const item = inventory.find((i) => i.id === cost.itemId);
    return item && item.quantity >= cost.amount;
  });
}

export function spendMaterials(
  def: StructureDefinition,
  inventory: InventoryItem[],
): InventoryItem[] {
  let updated = [...inventory];
  def.cost.forEach((cost) => {
    updated = updated
      .map((item) =>
        item.id === cost.itemId
          ? { ...item, quantity: item.quantity - cost.amount }
          : item,
      )
      .filter((item) => item.quantity > 0);
  });
  return updated;
}

export function createDefaultStructures(): Structure[] {
  return STRUCTURE_DEFINITIONS.map((def) => ({
    id: def.id,
    name: def.name,
    icon: def.icon,
    built: false,
    col: def.col,
    row: def.row,
  }));
}
