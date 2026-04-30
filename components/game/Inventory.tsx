// components/game/Inventory.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  icon: string; // emoji placeholder until we have sprites
  category: "material" | "seed" | "food" | "artefact" | "tool" | "structure";
}

interface Props {
  items: InventoryItem[];
  hotbar: (InventoryItem | null)[];
  onHotbarAssign: (item: InventoryItem, slot: number) => void;
}

export function Inventory({ items, hotbar, onHotbarAssign }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  return (
    <>
      {/* Hotbar — always visible */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
        {hotbar.map((item, index) => (
          <div
            key={index}
            className={cn(
              "w-12 h-12 rounded border-2 flex items-center justify-center relative",
              "bg-zinc-900/90 border-zinc-600",
              item && "border-zinc-400"
            )}
          >
            {item ? (
              <>
                <span className="text-xl">{item.icon}</span>
                <span className="absolute bottom-0 right-1 text-xs text-zinc-300 font-bold">
                  {item.quantity}
                </span>
              </>
            ) : (
              <span className="text-zinc-700 text-xs">{index + 1}</span>
            )}
          </div>
        ))}

        {/* Bag button */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className={cn(
            "w-12 h-12 rounded border-2 flex items-center justify-center ml-2",
            "bg-zinc-900/90 border-zinc-600 hover:border-zinc-400 transition-colors"
          )}
        >
          <span className="text-xl">🎒</span>
        </button>
      </div>

      {/* Inventory panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-96 bg-zinc-900/95 border border-zinc-700 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-zinc-200 tracking-widest uppercase">
              Inventory
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 40 }).map((_, index) => {
              const item = items[index] ?? null;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    "w-10 h-10 rounded border flex items-center justify-center relative cursor-pointer",
                    "bg-zinc-800 border-zinc-700 hover:border-zinc-500 transition-colors",
                    selectedItem?.id === item?.id && item && "border-amber-500"
                  )}
                >
                  {item && (
                    <>
                      <span className="text-lg">{item.icon}</span>
                      <span className="absolute bottom-0 right-0.5 text-xs text-zinc-400 font-bold leading-none">
                        {item.quantity}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected item info */}
          {selectedItem && (
            <div className="mt-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{selectedItem.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    {selectedItem.name}
                  </p>
                  <p className="text-xs text-zinc-500 capitalize">
                    {selectedItem.category}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 1, 2, 3, 4, 5].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => onHotbarAssign(selectedItem, slot)}
                    className="text-xs px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300 transition-colors"
                  >
                    Slot {slot + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
