// lib/gathering.ts
import type { GatheringNode, ResourceType } from "@/types/game";

// Fixed node positions on the map
// These match up with decoration tiles we placed
const NODE_DEFINITIONS: Omit<GatheringNode, "id" | "depleted">[] = [
  // Wood nodes — near trees
  { type: "wood", quantity: 5, maxQuantity: 5, col: 8, row: 8 },
  { type: "wood", quantity: 5, maxQuantity: 5, col: 12, row: 10 },
  { type: "wood", quantity: 5, maxQuantity: 5, col: 6, row: 15 },
  { type: "wood", quantity: 5, maxQuantity: 5, col: 38, row: 8 },
  { type: "wood", quantity: 5, maxQuantity: 5, col: 42, row: 11 },
  { type: "wood", quantity: 5, maxQuantity: 5, col: 8, row: 38 },
  { type: "wood", quantity: 5, maxQuantity: 5, col: 40, row: 38 },

  // Stone nodes — near stone tiles
  { type: "stone", quantity: 3, maxQuantity: 3, col: 20, row: 24 },
  { type: "stone", quantity: 3, maxQuantity: 3, col: 28, row: 24 },
  { type: "stone", quantity: 3, maxQuantity: 3, col: 24, row: 20 },

  // Berry nodes — scattered
  { type: "berry", quantity: 4, maxQuantity: 4, col: 10, row: 12 },
  { type: "berry", quantity: 4, maxQuantity: 4, col: 35, row: 10 },
  { type: "berry", quantity: 4, maxQuantity: 4, col: 11, row: 42 },
  { type: "berry", quantity: 4, maxQuantity: 4, col: 43, row: 42 },

  // Fibre nodes — near bushes/ferns
  { type: "fibre", quantity: 6, maxQuantity: 6, col: 14, row: 8 },
  { type: "fibre", quantity: 6, maxQuantity: 6, col: 36, row: 11 },
  { type: "fibre", quantity: 6, maxQuantity: 6, col: 17, row: 41 },

  // Mushroom nodes — darker areas
  { type: "mushroom", quantity: 2, maxQuantity: 2, col: 7, row: 25 },
  { type: "mushroom", quantity: 2, maxQuantity: 2, col: 44, row: 30 },
];

// Resource display info
export const RESOURCE_INFO: Record<ResourceType, { icon: string; name: string; color: number }> = {
  wood:     { icon: "🪵", name: "Wood",     color: 0x8B6914 },
  stone:    { icon: "🪨", name: "Stone",    color: 0x8B8B7A },
  berry:    { icon: "🫐", name: "Berry",    color: 0x6B3FA0 },
  fibre:    { icon: "🌿", name: "Fibre",    color: 0x4a7a3a },
  mushroom: { icon: "🍄", name: "Mushroom", color: 0xB5451B },
};

export function createNodes(): GatheringNode[] {
  return NODE_DEFINITIONS.map((def, i) => ({
    ...def,
    id: `node_${i}`,
    depleted: false,
  }));
}

export function gatherFromNode(
  node: GatheringNode,
  amount: number = 1
): { node: GatheringNode; gathered: number } {
  if (node.depleted) return { node, gathered: 0 };

  const gathered = Math.min(amount, node.quantity);
  const newQuantity = node.quantity - gathered;

  return {
    node: {
      ...node,
      quantity: newQuantity,
      depleted: newQuantity <= 0,
    },
    gathered,
  };
}

export function refreshNodes(nodes: GatheringNode[]): GatheringNode[] {
  return nodes.map((node) => ({
    ...node,
    quantity: node.maxQuantity,
    depleted: false,
  }));
}
