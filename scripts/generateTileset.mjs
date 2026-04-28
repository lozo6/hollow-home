import { createCanvas } from "canvas";
import { writeFileSync, mkdirSync } from "fs";

mkdirSync("public/assets/tilemaps", { recursive: true });

const TILE_SIZE = 32;
const COLS = 8;
const ROWS = 4;

const canvas = createCanvas(TILE_SIZE * COLS, TILE_SIZE * ROWS);
const ctx = canvas.getContext("2d");

// Define placeholder tiles
// Each entry: [col, row, fillColor, label]
const tiles = [
  // Row 0 — Ground
  [0, 0, "#2d5a27", "grass1"],
  [1, 0, "#2a5224", "grass2"],
  [2, 0, "#3a6b2a", "grass3"],
  [3, 0, "#8B7355", "dirt1"],
  [4, 0, "#7a6344", "dirt2"],
  [5, 0, "#4a7856", "grass_dark"],
  [6, 0, "#1a3a5c", "water1"],
  [7, 0, "#1e4266", "water2"],

  // Row 1 — Nature
  [0, 1, "#1a4a14", "tree_canopy"],
  [1, 1, "#5c3d1e", "tree_trunk"],
  [2, 1, "#6b8c5a", "bush"],
  [3, 1, "#8B8B7A", "stone"],
  [4, 1, "#6B6B5A", "stone_dark"],
  [5, 1, "#c8b89a", "path"],
  [6, 1, "#b5a48a", "path_dark"],
  [7, 1, "#4a6741", "fern"],

  // Row 2 — Structures
  [0, 2, "#8B7355", "wall_h"],
  [1, 2, "#7a6344", "wall_v"],
  [2, 2, "#c8b89a", "floor"],
  [3, 2, "#b5a48a", "floor_dark"],
  [4, 2, "#5c4a3a", "door"],
  [5, 2, "#2a2a2a", "well_base"],
  [6, 2, "#1a1a1a", "well_dark"],
  [7, 2, "#3a3a3a", "well_stone"],

  // Row 3 — Special
  [0, 3, "#2d4a1a", "deepwood1"],
  [1, 3, "#1a3a0a", "deepwood2"],
  [2, 3, "#3a2a1a", "bog"],
  [3, 3, "#2a1a0a", "bog_dark"],
  [4, 3, "#4a3a2a", "ruins"],
  [5, 3, "#3a2a1a", "ruins_dark"],
  [6, 3, "#000000", "void"],
  [7, 3, "#0a0a1a", "void_dark"],
];

tiles.forEach(([col, row, color, label]) => {
  const x = col * TILE_SIZE;
  const y = row * TILE_SIZE;

  // Fill tile
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // Add subtle border
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

  // Add label
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "6px monospace";
  ctx.fillText(label, x + 2, y + 10);
});

const buffer = canvas.toBuffer("image/png");
writeFileSync("public/assets/tilemaps/tileset.png", buffer);
console.log("Tileset generated: public/assets/tilemaps/tileset.png");
