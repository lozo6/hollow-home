// app/page.tsx
"use client";

import { useState, useCallback } from "react";
import { GameCanvas } from "@/components/game/GameCanvas";
import { Inventory, type InventoryItem } from "@/components/game/Inventory";
import { RESOURCE_INFO } from "@/lib/gathering";
import type { ResourceType } from "@/types/game";

const INITIAL_ITEMS: InventoryItem[] = [];

export default function HomePage() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [hotbar, setHotbar] = useState<(InventoryItem | null)[]>(
    Array(6).fill(null)
  );

  const handleGather = useCallback((type: ResourceType, amount: number) => {
    const info = RESOURCE_INFO[type];

    setItems((prev) => {
      const existing = prev.find((item) => item.id === type);

      if (existing) {
        // Increase quantity of existing item
        return prev.map((item) =>
          item.id === type
            ? { ...item, quantity: item.quantity + amount }
            : item
        );
      } else {
        // Add new item to inventory
        const newItem: InventoryItem = {
          id: type,
          name: info.name,
          quantity: amount,
          icon: info.icon,
          category: "material",
        };
        return [...prev, newItem];
      }
    });
  }, []);

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
        <GameCanvas onGather={handleGather} />
        <Inventory
          items={items}
          hotbar={hotbar}
          onHotbarAssign={handleHotbarAssign}
        />
      </div>
    </main>
  );
}
