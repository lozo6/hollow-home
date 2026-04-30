"use client";

import { useState, useCallback } from "react";
import { GameCanvas } from "@/components/game/GameCanvas";
import { Inventory, type InventoryItem } from "@/components/game/Inventory";
import { CraftingTable } from "@/components/game/CraftingTable";
import { Homestead } from "@/components/game/Homestead";
import { RESOURCE_INFO } from "@/lib/gathering";
import { craftItem, type Recipe } from "@/lib/crafting";
import {
  createDefaultStructures,
  spendMaterials,
  type StructureDefinition,
} from "@/lib/structures";
import type { ResourceType, Structure } from "@/types/game";

export default function HomePage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [hotbar, setHotbar] = useState<(InventoryItem | null)[]>(Array(6).fill(null));
  const [craftingOpen, setCraftingOpen] = useState(false);
  const [homesteadOpen, setHomesteadOpen] = useState(false);
  const [structures, setStructures] = useState<Structure[]>(
    createDefaultStructures()
  );

  const handleGather = useCallback((type: ResourceType, amount: number) => {
    const info = RESOURCE_INFO[type];
    setItems((prev) => {
      const existing = prev.find((item) => item.id === type);
      if (existing) {
        return prev.map((item) =>
          item.id === type
            ? { ...item, quantity: item.quantity + amount }
            : item
        );
      }
      return [
        ...prev,
        {
          id: type,
          name: info.name,
          quantity: amount,
          icon: info.icon,
          category: "material" as const,
        },
      ];
    });
  }, []);

  const handleCraft = useCallback((recipe: Recipe) => {
    setItems((prev) => craftItem(recipe, prev));
  }, []);

  const handleBuild = useCallback(
    (def: StructureDefinition) => {
      // Deduct materials
      setItems((prev) => spendMaterials(def, prev));
      // Mark structure as built
      setStructures((prev) =>
        prev.map((s) => (s.id === def.id ? { ...s, built: true } : s))
      );
    },
    []
  );

  const handleHotbarAssign = (item: InventoryItem, slot: number) => {
    setHotbar((prev) => {
      const next = [...prev];
      next[slot] = item;
      return next;
    });
  };

  const handleGameEvent = useCallback((event: string) => {
    if (event === "openCrafting") setCraftingOpen(true);
    if (event === "openHomestead") setHomesteadOpen(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      <h1 className="text-2xl font-bold text-zinc-200 mb-6 tracking-widest uppercase">
        Hollow Home
      </h1>
      <div className="relative">
        <GameCanvas onGather={handleGather} onGameEvent={handleGameEvent} />
        <Inventory
          items={items}
          hotbar={hotbar}
          onHotbarAssign={handleHotbarAssign}
        />
        <CraftingTable
          isOpen={craftingOpen}
          onClose={() => setCraftingOpen(false)}
          inventory={items}
          onCraft={handleCraft}
        />
        <Homestead
          isOpen={homesteadOpen}
          onClose={() => setHomesteadOpen(false)}
          structures={structures}
          inventory={items}
          onBuild={handleBuild}
        />
      </div>
    </main>
  );
}
