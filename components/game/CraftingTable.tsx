// components/game/CraftingTable.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RECIPES, canCraft, type Recipe } from "@/lib/crafting";
import type { InventoryItem } from "@/components/game/Inventory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onCraft: (recipe: Recipe) => void;
}

export function CraftingTable({ isOpen, onClose, inventory, onCraft }: Props) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filter, setFilter] = useState<"all" | "tool" | "material" | "seed">("all");

  if (!isOpen) return null;

  const filtered = RECIPES.filter(
    (r) => filter === "all" || r.category === filter
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-[500px] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-5 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-zinc-200 tracking-widest uppercase">
            🪵 Workbench
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-xs"
          >
            ✕
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-3">
          {(["all", "material", "tool", "seed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium capitalize transition-colors",
                filter === tab
                  ? "bg-amber-700 text-amber-100"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          {/* Recipe list */}
          <div className="flex-1 flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
            {filtered.map((recipe) => {
              const craftable = canCraft(recipe, inventory);
              return (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                    selectedRecipe?.id === recipe.id
                      ? "bg-amber-900/50 border border-amber-700"
                      : "bg-zinc-800 border border-transparent hover:border-zinc-600",
                    !craftable && "opacity-40"
                  )}
                >
                  <span className="text-lg">{recipe.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">
                      {recipe.name}
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">
                      {recipe.category}
                    </p>
                  </div>
                  {craftable && (
                    <span className="ml-auto text-xs text-green-400">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Recipe detail */}
          <div className="w-44 bg-zinc-800 rounded-lg p-3 flex flex-col gap-2">
            {selectedRecipe ? (
              <>
                <div className="text-center">
                  <span className="text-4xl">{selectedRecipe.icon}</span>
                  <p className="text-xs font-bold text-zinc-200 mt-1">
                    {selectedRecipe.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Makes {selectedRecipe.output.amount}
                  </p>
                </div>

                <div className="border-t border-zinc-700 pt-2">
                  <p className="text-xs text-zinc-500 mb-1">Requires:</p>
                  {selectedRecipe.ingredients.map((ing) => {
                    const have = inventory.find((i) => i.id === ing.type)?.quantity ?? 0;
                    const enough = have >= ing.amount;
                    return (
                      <div
                        key={ing.type}
                        className={cn(
                          "flex justify-between text-xs",
                          enough ? "text-green-400" : "text-red-400"
                        )}
                      >
                        <span className="capitalize">{ing.type}</span>
                        <span>{have}/{ing.amount}</span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => onCraft(selectedRecipe)}
                  disabled={!canCraft(selectedRecipe, inventory)}
                  className={cn(
                    "mt-auto py-2 rounded-lg text-xs font-bold transition-colors",
                    canCraft(selectedRecipe, inventory)
                      ? "bg-amber-700 hover:bg-amber-600 text-white"
                      : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                  )}
                >
                  Craft
                </button>
              </>
            ) : (
              <p className="text-xs text-zinc-600 text-center mt-4">
                Select a recipe
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
