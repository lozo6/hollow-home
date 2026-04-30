// lib/crafting.ts
import type { ResourceType } from "@/types/game";
import type { InventoryItem } from "@/components/game/Inventory";

export interface Recipe {
  id: string;
  name: string;
  icon: string;
  category: "tool" | "material" | "structure" | "seed";
  ingredients: { type: ResourceType; amount: number }[];
  output: { type: string; name: string; icon: string; amount: number };
  unlocked: boolean;
}

export const RECIPES: Recipe[] = [
  {
    id: "plank",
    name: "Wood Plank",
    icon: "🪵",
    category: "material",
    ingredients: [{ type: "wood", amount: 2 }],
    output: { type: "plank", name: "Wood Plank", icon: "🪵", amount: 1 },
    unlocked: true,
  },
  {
    id: "stone_block",
    name: "Stone Block",
    icon: "🪨",
    category: "material",
    ingredients: [{ type: "stone", amount: 2 }],
    output: { type: "stone_block", name: "Stone Block", icon: "🪨", amount: 1 },
    unlocked: true,
  },
  {
    id: "fibre_rope",
    name: "Fibre Rope",
    icon: "🧵",
    category: "material",
    ingredients: [{ type: "fibre", amount: 3 }],
    output: { type: "fibre_rope", name: "Fibre Rope", icon: "🧵", amount: 1 },
    unlocked: true,
  },
  {
    id: "berry_jam",
    name: "Berry Jam",
    icon: "🫙",
    category: "material",
    ingredients: [{ type: "berry", amount: 4 }],
    output: { type: "berry_jam", name: "Berry Jam", icon: "🫙", amount: 1 },
    unlocked: true,
  },
  {
    id: "mushroom_stew",
    name: "Mushroom Stew",
    icon: "🍲",
    category: "material",
    ingredients: [
      { type: "mushroom", amount: 2 },
      { type: "fibre", amount: 1 },
    ],
    output: {
      type: "mushroom_stew",
      name: "Mushroom Stew",
      icon: "🍲",
      amount: 1,
    },
    unlocked: true,
  },
  {
    id: "basic_axe",
    name: "Basic Axe",
    icon: "🪓",
    category: "tool",
    ingredients: [
      { type: "wood", amount: 3 },
      { type: "stone", amount: 2 },
    ],
    output: { type: "basic_axe", name: "Basic Axe", icon: "🪓", amount: 1 },
    unlocked: true,
  },
  {
    id: "grass_seed",
    name: "Grass Seed",
    icon: "🌱",
    category: "seed",
    ingredients: [{ type: "fibre", amount: 2 }],
    output: { type: "grass_seed", name: "Grass Seed", icon: "🌱", amount: 3 },
    unlocked: true,
  },
  {
    id: "berry_seed",
    name: "Berry Seed",
    icon: "🫐",
    category: "seed",
    ingredients: [{ type: "berry", amount: 2 }],
    output: { type: "berry_seed", name: "Berry Seed", icon: "🫐", amount: 2 },
    unlocked: true,
  },
];

export function canCraft(recipe: Recipe, inventory: InventoryItem[]): boolean {
  return recipe.ingredients.every((ingredient) => {
    const item = inventory.find((i) => i.id === ingredient.type);
    return item && item.quantity >= ingredient.amount;
  });
}

export function craftItem(
  recipe: Recipe,
  inventory: InventoryItem[],
): InventoryItem[] {
  if (!canCraft(recipe, inventory)) return inventory;

  let updated = [...inventory];

  // Deduct ingredients
  recipe.ingredients.forEach((ingredient) => {
    updated = updated
      .map((item) =>
        item.id === ingredient.type
          ? { ...item, quantity: item.quantity - ingredient.amount }
          : item,
      )
      .filter((item) => item.quantity > 0);
  });

  // Add output
  const existing = updated.find((i) => i.id === recipe.output.type);
  if (existing) {
    updated = updated.map((i) =>
      i.id === recipe.output.type
        ? { ...i, quantity: i.quantity + recipe.output.amount }
        : i,
    );
  } else {
    updated.push({
      id: recipe.output.type,
      name: recipe.output.name,
      icon: recipe.output.icon,
      quantity: recipe.output.amount,
      category: recipe.category,
    });
  }

  return updated;
}
