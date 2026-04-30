// components/game/Homestead.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  STRUCTURE_DEFINITIONS,
  canBuild,
  type StructureDefinition,
} from "@/lib/structures";
import type { Structure } from "@/types/game";
import type { InventoryItem } from "@/components/game/Inventory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  structures: Structure[];
  inventory: InventoryItem[];
  onBuild: (def: StructureDefinition) => void;
}

export function Homestead({ isOpen, onClose, structures, inventory, onBuild }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-[480px] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-5 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-200 tracking-widest uppercase">
              🏚️ Homestead
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Restore your home, one structure at a time
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-xs"
          >
            ✕
          </button>
        </div>

        {/* Structure list */}
        <div className="flex flex-col gap-2">
          {STRUCTURE_DEFINITIONS.map((def) => {
            const structure = structures.find((s) => s.id === def.id)!;
            const buildable = canBuild(def, inventory);

            return (
              <div
                key={def.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg border transition-colors",
                  structure.built
                    ? "bg-green-950/30 border-green-800"
                    : "bg-zinc-800 border-zinc-700"
                )}
              >
                {/* Icon */}
                <span className="text-3xl">{def.icon}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-200">
                      {def.name}
                    </p>
                    {structure.built && (
                      <span className="text-xs text-green-400 font-medium">
                        ✓ Built
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">
                    {def.description}
                  </p>

                  {/* Cost */}
                  {!structure.built && (
                    <div className="flex gap-3 mt-1.5">
                      {def.cost.map((cost) => {
                        const have =
                          inventory.find((i) => i.id === cost.itemId)
                            ?.quantity ?? 0;
                        const enough = have >= cost.amount;
                        return (
                          <span
                            key={cost.itemId}
                            className={cn(
                              "text-xs font-medium",
                              enough ? "text-green-400" : "text-red-400"
                            )}
                          >
                            {cost.itemId.replace("_", " ")} {have}/
                            {cost.amount}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Unlocks */}
                  {structure.built && (
                    <p className="text-xs text-green-600 mt-0.5">
                      {def.unlocks}
                    </p>
                  )}
                </div>

                {/* Build button */}
                {!structure.built && (
                  <button
                    onClick={() => onBuild(def)}
                    disabled={!buildable}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors",
                      buildable
                        ? "bg-amber-700 hover:bg-amber-600 text-white"
                        : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                    )}
                  >
                    Build
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>Restoration progress</span>
            <span>
              {structures.filter((s) => s.built).length}/
              {structures.length}
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 rounded-full transition-all"
              style={{
                width: `${
                  (structures.filter((s) => s.built).length /
                    structures.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
