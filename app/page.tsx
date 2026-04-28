// app/page.tsx
"use client";

import { useState } from "react";
import { GameCanvas } from "@/components/game/GameCanvas";
import { Inventory, type InventoryItem } from "@/components/game/Inventory";

// Placeholder items so we can see the UI working
const PLACEHOLDER_ITEMS: InventoryItem[] = [
  { id: "wood", name: "Wood", quantity: 12, icon: "🪵", category: "material" },
  { id: "stone", name: "Stone", quantity: 5, icon: "🪨", category: "material" },
  { id: "berry", name: "Wild Berry", quantity: 8, icon: "🫐", category: "food" },
  { id: "seed", name: "Grass Seed", quantity: 3, icon: "🌱", category: "seed" },
];

export default function HomePage() {
  const [items] = useState<InventoryItem[]>(PLACEHOLDER_ITEMS);
  const [hotbar, setHotbar] = useState<(InventoryItem | null)[]>(
    Array(6).fill(null)
  );

  const handleHotbarAssign = (item: InventoryItem, slot: number) => {
    setHotbar((prev) => {
      const next = [...prev];
      next[slot] = item;
      return next;
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      <h1 className="text-2xl font-bold text-zinc-200 mb-6 tracking-widest uppercase">
        Hollow Home
      </h1>
      <div className="relative">
        <GameCanvas />
        <Inventory
          items={items}
          hotbar={hotbar}
          onHotbarAssign={handleHotbarAssign}
        />
      </div>
    </main>
  );
}
